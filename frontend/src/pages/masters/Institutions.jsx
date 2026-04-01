import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import FormField, { inputClass } from '../../components/FormField';

export default function Institutions() {
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const load = () => api.get('/masters/institutions').then((r) => setData(r.data));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); reset({}); setModal(true); };
  const openEdit = (row) => { setEditing(row); reset(row); setModal(true); };

  const onSubmit = async (formData) => {
    try {
      if (editing) await api.put(`/masters/institutions/${editing._id}`, formData);
      else await api.post('/masters/institutions', formData);
      toast.success(editing ? 'Institution updated' : 'Institution created');
      setModal(false); load();
    } catch (e) { toast.error(e.response?.data?.message || 'Something went wrong'); }
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this institution?')) return;
    await api.delete(`/masters/institutions/${id}`);
    toast.success('Deleted'); load();
  };

  const columns = [
    { key: 'name', label: 'Institution Name' },
    { key: 'code', label: 'Code', render: (r) => <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{r.code}</span> },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
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
          <h1 className="text-lg font-bold text-slate-800">Institutions</h1>
          <p className="text-sm text-slate-500">{data.length} institution{data.length !== 1 ? 's' : ''} configured</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition shadow-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Institution
        </button>
      </div>

      <Table columns={columns} data={data} onEdit={openEdit} onDelete={onDelete} />

      {modal && (
        <Modal title={editing ? 'Edit Institution' : 'Add Institution'} onClose={() => setModal(false)}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-x-4">
              <div className="col-span-2">
                <FormField label="Institution Name" error={errors.name} required>
                  <input {...register('name', { required: 'Required' })} className={inputClass} placeholder="e.g. RV Institute of Technology" />
                </FormField>
              </div>
              <FormField label="Code" error={errors.code} required>
                <input {...register('code', { required: 'Required' })} className={inputClass} placeholder="e.g. RVIT" />
              </FormField>
              <FormField label="Phone" error={errors.phone}>
                <input {...register('phone')} className={inputClass} placeholder="080-12345678" />
              </FormField>
              <div className="col-span-2">
                <FormField label="Email" error={errors.email}>
                  <input type="email" {...register('email')} className={inputClass} placeholder="info@institution.edu" />
                </FormField>
              </div>
              <div className="col-span-2">
                <FormField label="Address">
                  <input {...register('address')} className={inputClass} placeholder="Full address" />
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
