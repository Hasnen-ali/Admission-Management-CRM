import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import FormField, { inputClass, selectClass } from '../../components/FormField';

export default function Campuses() {
  const [data, setData] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const load = () => api.get('/masters/campuses').then((r) => setData(r.data));
  useEffect(() => {
    load();
    api.get('/masters/institutions').then((r) => setInstitutions(r.data));
  }, []);

  const openCreate = () => { setEditing(null); reset({}); setModal(true); };
  const openEdit = (row) => { setEditing(row); reset({ ...row, institution: row.institution?._id }); setModal(true); };

  const onSubmit = async (formData) => {
    try {
      if (editing) await api.put(`/masters/campuses/${editing._id}`, formData);
      else await api.post('/masters/campuses', formData);
      toast.success('Saved'); setModal(false); load();
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this campus?')) return;
    await api.delete(`/masters/campuses/${id}`);
    toast.success('Deleted'); load();
  };

  const columns = [
    { key: 'name', label: 'Campus Name', render: (r) => <span className="font-medium text-slate-800">{r.name}</span> },
    { key: 'code', label: 'Code', render: (r) => <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{r.code}</span> },
    { key: 'institution', label: 'Institution', render: (r) => r.institution?.name || '—' },
    { key: 'address', label: 'Address' },
    { key: 'isActive', label: 'Status', render: (r) => (
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
        {r.isActive ? 'Active' : 'Inactive'}
      </span>
    )},
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-800">Campuses</h1>
          <p className="text-sm text-slate-500">{data.length} campus{data.length !== 1 ? 'es' : ''} configured</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition shadow-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Campus
        </button>
      </div>
      <Table columns={columns} data={data} onEdit={openEdit} onDelete={onDelete} />
      {modal && (
        <Modal title={editing ? 'Edit Campus' : 'Add Campus'} onClose={() => setModal(false)}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Campus Name" error={errors.name} required>
                <input {...register('name', { required: 'Required' })} className={inputClass} placeholder="Main Campus" />
              </FormField>
              <FormField label="Code" error={errors.code} required>
                <input {...register('code', { required: 'Required' })} className={inputClass} placeholder="MAIN" />
              </FormField>
              <div className="col-span-2">
                <FormField label="Institution" error={errors.institution} required>
                  <select {...register('institution', { required: 'Required' })} className={selectClass}>
                    <option value="">Select Institution</option>
                    {institutions.map((i) => <option key={i._id} value={i._id}>{i.name}</option>)}
                  </select>
                </FormField>
              </div>
              <div className="col-span-2">
                <FormField label="Address">
                  <input {...register('address')} className={inputClass} placeholder="Campus address" />
                </FormField>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 mt-2">
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
