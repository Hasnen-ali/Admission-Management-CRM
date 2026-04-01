import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import FormField, { inputClass, selectClass } from '../../components/FormField';

export default function Programs() {
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, control, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { quotas: [{ name: 'KCET', totalSeats: 0 }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'quotas' });
  const quotas = watch('quotas');
  const totalIntake = watch('totalIntake');
  const quotaSum = quotas?.reduce((s, q) => s + (parseInt(q.totalSeats) || 0), 0) || 0;

  const load = () => api.get('/programs').then((r) => setData(r.data));
  useEffect(() => {
    load();
    api.get('/masters/departments').then((r) => setDepartments(r.data));
  }, []);

  const openCreate = () => {
    setEditing(null);
    reset({ quotas: [{ name: 'KCET', totalSeats: 0 }] });
    setModal(true);
  };
  const openEdit = (row) => {
    setEditing(row);
    reset({ ...row, department: row.department?._id });
    setModal(true);
  };

  const onSubmit = async (formData) => {
    formData.totalIntake = parseInt(formData.totalIntake);
    formData.quotas = formData.quotas.map((q) => ({ ...q, totalSeats: parseInt(q.totalSeats) }));
    try {
      if (editing) await api.put(`/programs/${editing._id}`, formData);
      else await api.post('/programs', formData);
      toast.success('Saved'); setModal(false); load();
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this program?')) return;
    await api.delete(`/programs/${id}`);
    toast.success('Deleted'); load();
  };

  const columns = [
    { key: 'name', label: 'Program', render: (r) => <span className="font-medium text-slate-800">{r.name}</span> },
    { key: 'code', label: 'Code', render: (r) => <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{r.code}</span> },
    { key: 'courseType', label: 'Type', render: (r) => <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">{r.courseType}</span> },
    { key: 'entryType', label: 'Entry' },
    { key: 'totalIntake', label: 'Intake', render: (r) => <span className="font-semibold">{r.totalIntake}</span> },
    { key: 'academicYear', label: 'Year' },
    { key: 'quotas', label: 'Quotas', render: (r) => (
      <div className="flex gap-1">
        {r.quotas?.map((q) => (
          <span key={q.name} className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
            {q.name}: {q.filledSeats}/{q.totalSeats}
          </span>
        ))}
      </div>
    )},
  ];

  const isMatch = parseInt(totalIntake) === quotaSum;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-800">Programs</h1>
          <p className="text-sm text-slate-500">{data.length} program{data.length !== 1 ? 's' : ''} configured</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition shadow-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Program
        </button>
      </div>
      <Table columns={columns} data={data} onEdit={openEdit} onDelete={onDelete} />

      {modal && (
        <Modal title={editing ? 'Edit Program' : 'Add Program'} onClose={() => setModal(false)} size="lg">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <FormField label="Program Name" error={errors.name} required>
                  <input {...register('name', { required: 'Required' })} className={inputClass} placeholder="Computer Science & Engineering" />
                </FormField>
              </div>
              <FormField label="Code" error={errors.code} required>
                <input {...register('code', { required: 'Required' })} className={inputClass} placeholder="CSE" />
              </FormField>
              <FormField label="Department" error={errors.department} required>
                <select {...register('department', { required: 'Required' })} className={selectClass}>
                  <option value="">Select Department</option>
                  {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
                </select>
              </FormField>
              <FormField label="Course Type" error={errors.courseType} required>
                <select {...register('courseType', { required: 'Required' })} className={selectClass}>
                  <option value="">Select</option>
                  <option value="UG">UG</option>
                  <option value="PG">PG</option>
                </select>
              </FormField>
              <FormField label="Entry Type" error={errors.entryType} required>
                <select {...register('entryType', { required: 'Required' })} className={selectClass}>
                  <option value="">Select</option>
                  <option value="Regular">Regular</option>
                  <option value="Lateral">Lateral</option>
                </select>
              </FormField>
              <FormField label="Admission Mode" error={errors.admissionMode} required>
                <select {...register('admissionMode', { required: 'Required' })} className={selectClass}>
                  <option value="">Select</option>
                  <option value="Government">Government</option>
                  <option value="Management">Management</option>
                </select>
              </FormField>
              <FormField label="Academic Year" error={errors.academicYear} required>
                <input {...register('academicYear', { required: 'Required' })} className={inputClass} placeholder="2025-26" />
              </FormField>
              <div className="col-span-2">
                <FormField label="Total Intake" error={errors.totalIntake} required>
                  <input type="number" {...register('totalIntake', { required: 'Required', min: 1 })} className={inputClass} placeholder="60" />
                </FormField>
              </div>
            </div>

            {/* Quotas */}
            <div className="mt-2 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Quota Distribution</p>
                  <p className={`text-xs mt-0.5 ${isMatch ? 'text-emerald-600' : 'text-amber-600'}`}>
                    Sum: {quotaSum} / {parseInt(totalIntake) || 0} {isMatch ? '✓ Matches' : '⚠ Must equal total intake'}
                  </p>
                </div>
                <button type="button" onClick={() => append({ name: '', totalSeats: 0 })} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition">
                  + Add Quota
                </button>
              </div>
              <div className="space-y-2">
                {fields.map((field, idx) => (
                  <div key={field.id} className="flex gap-2 items-center bg-slate-50 rounded-xl p-3">
                    <select {...register(`quotas.${idx}.name`, { required: true })} className={`${selectClass} flex-1`}>
                      <option value="">Select Quota</option>
                      <option value="KCET">KCET</option>
                      <option value="COMEDK">COMEDK</option>
                      <option value="Management">Management</option>
                    </select>
                    <input
                      type="number"
                      {...register(`quotas.${idx}.totalSeats`, { required: true, min: 0 })}
                      className={`${inputClass} w-28`}
                      placeholder="Seats"
                    />
                    {fields.length > 1 && (
                      <button type="button" onClick={() => remove(idx)} className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button type="button" onClick={() => setModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition disabled:opacity-50">
                {isSubmitting ? 'Saving...' : 'Save Program'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
