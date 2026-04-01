import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import FormField, { inputClass } from '../../components/FormField';

export default function AcademicYears() {
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const load = () => api.get('/masters/academic-years').then((r) => setData(r.data));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); reset({}); setModal(true); };
  const openEdit = (row) => { setEditing(row); reset(row); setModal(true); };

  const onSubmit = async (formData) => {
    try {
      if (editing) await api.put(`/masters/academic-years/${editing._id}`, formData);
      else await api.post('/masters/academic-years', formData);
      toast.success('Saved'); setModal(false); load();
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this academic year?')) return;
    await api.delete(`/masters/academic-years/${id}`);
    toast.success('Deleted'); load();
  };

  const columns = [
    { key: 'year', label: 'Academic Year', render: (r) => <span className="font-semibold text-slate-800">{r.year}</span> },
    { key: 'isActive', label: 'Status', render: (r) => (
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${r.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
        {r.isActive ? '✓ Active' : 'Inactive'}
      </span>
    )},
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-800">Academic Years</h1>
          <p className="text-sm text-slate-500">{data.length} year{data.length !== 1 ? 's' : ''} configured</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition shadow-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Year
        </button>
      </div>
      <Table columns={columns} data={data} onEdit={openEdit} onDelete={onDelete} />
      {modal && (
        <Modal title={editing ? 'Edit Academic Year' : 'Add Academic Year'} onClose={() => setModal(false)} size="sm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField label="Year" error={errors.year} required>
              <input {...register('year', { required: 'Required' })} className={inputClass} placeholder="2025-26" />
            </FormField>
            <div className="flex items-center gap-3 mb-4">
              <input type="checkbox" id="isActive" {...register('isActive')} className="w-4 h-4 accent-indigo-600" />
              <label htmlFor="isActive" className="text-sm font-medium text-slate-700">Set as Active Year</label>
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition disabled:opacity-50">
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
