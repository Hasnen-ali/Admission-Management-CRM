import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import FormField, { inputClass, selectClass } from '../../components/FormField';

export default function Applicants() {
  const [data, setData] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [modal, setModal] = useState(false);
  const [docModal, setDocModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const docForm = useForm();

  const load = () => api.get('/applicants').then((r) => setData(r.data));
  useEffect(() => {
    load();
    api.get('/programs').then((r) => setPrograms(r.data));
  }, []);

  const openCreate = () => { setEditing(null); reset({}); setModal(true); };
  const openEdit = (row) => { setEditing(row); reset({ ...row, program: row.program?._id }); setModal(true); };

  const onSubmit = async (formData) => {
    formData.marks = parseFloat(formData.marks);
    try {
      if (editing) await api.put(`/applicants/${editing._id}`, formData);
      else await api.post('/applicants', formData);
      toast.success(editing ? 'Updated' : 'Applicant added');
      setModal(false); load();
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this applicant?')) return;
    await api.delete(`/applicants/${id}`);
    toast.success('Deleted'); load();
  };

  const openDocModal = (row) => { setDocModal(row); docForm.reset({ documentStatus: row.documentStatus }); };
  const onDocSubmit = async (formData) => {
    await api.patch(`/applicants/${docModal._id}/document-status`, formData);
    toast.success('Document status updated'); setDocModal(null); load();
  };

  const statusBadge = (s) => {
    const styles = {
      Applied: 'bg-blue-100 text-blue-700',
      Allocated: 'bg-amber-100 text-amber-700',
      Confirmed: 'bg-emerald-100 text-emerald-700',
      Rejected: 'bg-red-100 text-red-700',
    };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[s]}`}>{s}</span>;
  };

  const docBadge = (s) => {
    const styles = { Pending: 'bg-slate-100 text-slate-600', Submitted: 'bg-blue-100 text-blue-600', Verified: 'bg-emerald-100 text-emerald-600' };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[s]}`}>{s}</span>;
  };

  const columns = [
    { key: 'name', label: 'Name', render: (r) => <span className="font-medium text-slate-800">{r.name}</span> },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'category', label: 'Category', render: (r) => <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{r.category}</span> },
    { key: 'quotaType', label: 'Quota' },
    { key: 'marks', label: 'Marks', render: (r) => <span className="font-semibold text-indigo-600">{r.marks}%</span> },
    { key: 'program', label: 'Program', render: (r) => r.program?.name || '—' },
    { key: 'documentStatus', label: 'Documents', render: (r) => docBadge(r.documentStatus) },
    { key: 'status', label: 'Status', render: (r) => statusBadge(r.status) },
    { key: 'actions', label: '', render: (r) => (
      <button onClick={() => openDocModal(r)} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">Update Docs</button>
    )},
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-800">Applicants</h1>
          <p className="text-sm text-slate-500">{data.length} applicant{data.length !== 1 ? 's' : ''} registered</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition shadow-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Applicant
        </button>
      </div>

      <Table columns={columns} data={data} onEdit={openEdit} onDelete={onDelete} />

      {modal && (
        <Modal title={editing ? 'Edit Applicant' : 'Add Applicant'} onClose={() => setModal(false)} size="lg">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Full Name" error={errors.name} required>
                <input {...register('name', { required: 'Required' })} className={inputClass} placeholder="John Doe" />
              </FormField>
              <FormField label="Email" error={errors.email} required>
                <input type="email" {...register('email', { required: 'Required' })} className={inputClass} placeholder="john@example.com" />
              </FormField>
              <FormField label="Phone" error={errors.phone} required>
                <input {...register('phone', { required: 'Required' })} className={inputClass} placeholder="9876543210" />
              </FormField>
              <FormField label="Marks (%)" error={errors.marks} required>
                <input type="number" step="0.01" {...register('marks', { required: 'Required', min: 0, max: 100 })} className={inputClass} placeholder="85.5" />
              </FormField>
              <FormField label="Category" error={errors.category} required>
                <select {...register('category', { required: 'Required' })} className={selectClass}>
                  <option value="">Select Category</option>
                  {['GM', 'SC', 'ST', 'OBC'].map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </FormField>
              <FormField label="Entry Type" error={errors.entryType} required>
                <select {...register('entryType', { required: 'Required' })} className={selectClass}>
                  <option value="">Select</option>
                  <option value="Regular">Regular</option>
                  <option value="Lateral">Lateral</option>
                </select>
              </FormField>
              <FormField label="Quota Type" error={errors.quotaType} required>
                <select {...register('quotaType', { required: 'Required' })} className={selectClass}>
                  <option value="">Select Quota</option>
                  {['KCET', 'COMEDK', 'Management'].map((q) => <option key={q} value={q}>{q}</option>)}
                </select>
              </FormField>
              <FormField label="Academic Year" error={errors.academicYear} required>
                <input {...register('academicYear', { required: 'Required' })} className={inputClass} placeholder="2025-26" />
              </FormField>
              <div className="col-span-2">
                <FormField label="Program" error={errors.program} required>
                  <select {...register('program', { required: 'Required' })} className={selectClass}>
                    <option value="">Select Program</option>
                    {programs.map((p) => <option key={p._id} value={p._id}>{p.name} ({p.code})</option>)}
                  </select>
                </FormField>
              </div>
              <div className="col-span-2">
                <FormField label="Allotment Number (for Govt flow)">
                  <input {...register('allotmentNumber')} className={inputClass} placeholder="KCET2025001" />
                </FormField>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
              <button type="button" onClick={() => setModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition disabled:opacity-50">
                {isSubmitting ? 'Saving...' : 'Save Applicant'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {docModal && (
        <Modal title="Update Document Status" onClose={() => setDocModal(null)} size="sm">
          <form onSubmit={docForm.handleSubmit(onDocSubmit)}>
            <FormField label="Document Status">
              <select {...docForm.register('documentStatus')} className={selectClass}>
                {['Pending', 'Submitted', 'Verified'].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
            <div className="flex justify-end gap-3 pt-2 mt-2">
              <button type="button" onClick={() => setDocModal(null)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition">Update</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
