import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import FormField, { selectClass } from '../../components/FormField';
import { useAuth } from '../../context/AuthContext';

export default function Admissions() {
  const { user } = useAuth();
  const [admissions, setAdmissions] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [allocateModal, setAllocateModal] = useState(false);
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm();
  const selectedProgram = watch('programId');

  const load = () => api.get('/admissions').then((r) => setAdmissions(r.data));
  useEffect(() => {
    load();
    api.get('/applicants?status=Applied').then((r) => setApplicants(r.data));
    api.get('/programs').then((r) => setPrograms(r.data));
  }, []);

  const quotasForProgram = programs.find((p) => p._id === selectedProgram)?.quotas || [];

  const onAllocate = async (formData) => {
    try {
      await api.post('/admissions/allocate', {
        applicantId: formData.applicantId,
        programId: formData.programId,
        quotaName: formData.quotaName,
      });
      toast.success('Seat allocated successfully');
      setAllocateModal(false); reset(); load();
      api.get('/applicants?status=Applied').then((r) => setApplicants(r.data));
    } catch (e) { toast.error(e.response?.data?.message || 'Allocation failed'); }
  };

  const updateFee = async (id, feeStatus) => {
    await api.patch(`/admissions/${id}/fee`, { feeStatus });
    toast.success('Fee status updated'); load();
  };

  const confirmAdmission = async (id) => {
    try {
      await api.patch(`/admissions/${id}/confirm`);
      toast.success('Admission confirmed');
      load();
    } catch (e) { toast.error(e.response?.data?.message || 'Cannot confirm'); }
  };

  const isOfficer = ['admin', 'admission_officer'].includes(user?.role);

  const columns = [
    { key: 'admissionNumber', label: 'Admission No.', render: (r) => <span className="font-mono text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded">{r.admissionNumber}</span> },
    { key: 'applicant', label: 'Applicant', render: (r) => <span className="font-medium text-slate-800">{r.applicant?.name || '—'}</span> },
    { key: 'program', label: 'Program', render: (r) => r.program?.name || '—' },
    { key: 'quotaName', label: 'Quota', render: (r) => <span className="font-semibold text-xs">{r.quotaName}</span> },
    { key: 'feeStatus', label: 'Fee Status', render: (r) => (
      isOfficer && !r.isConfirmed ? (
        <select
          value={r.feeStatus}
          onChange={(e) => updateFee(r._id, e.target.value)}
          className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
        </select>
      ) : (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${r.feeStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
          {r.feeStatus}
        </span>
      )
    )},
    { key: 'isConfirmed', label: 'Confirmed', render: (r) => (
      r.isConfirmed ? (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
          Yes
        </span>
      ) : isOfficer ? (
        <button onClick={() => confirmAdmission(r._id)} className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3 py-1 rounded-lg transition">
          Confirm
        </button>
      ) : (
        <span className="text-xs text-slate-400">No</span>
      )
    )},
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-800">Admissions</h1>
          <p className="text-sm text-slate-500">{admissions.length} admission{admissions.length !== 1 ? 's' : ''} processed</p>
        </div>
        {isOfficer && (
          <button onClick={() => { reset(); setAllocateModal(true); }} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition shadow-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Allocate Seat
          </button>
        )}
      </div>

      <Table columns={columns} data={admissions} />

      {allocateModal && (
        <Modal title="Allocate Seat to Applicant" onClose={() => setAllocateModal(false)}>
          <form onSubmit={handleSubmit(onAllocate)}>
            <FormField label="Select Applicant" error={errors.applicantId} required>
              <select {...register('applicantId', { required: 'Required' })} className={selectClass}>
                <option value="">Choose applicant</option>
                {applicants.map((a) => (
                  <option key={a._id} value={a._id}>{a.name} — {a.quotaType} ({a.marks}%)</option>
                ))}
              </select>
            </FormField>
            <FormField label="Select Program" error={errors.programId} required>
              <select {...register('programId', { required: 'Required' })} className={selectClass}>
                <option value="">Choose program</option>
                {programs.map((p) => <option key={p._id} value={p._id}>{p.name} ({p.code})</option>)}
              </select>
            </FormField>
            <FormField label="Select Quota" error={errors.quotaName} required>
              <select {...register('quotaName', { required: 'Required' })} className={selectClass} disabled={!selectedProgram}>
                <option value="">Choose quota</option>
                {quotasForProgram.map((q) => (
                  <option key={q.name} value={q.name} disabled={q.filledSeats >= q.totalSeats}>
                    {q.name} — {q.filledSeats}/{q.totalSeats} filled {q.filledSeats >= q.totalSeats && '(FULL)'}
                  </option>
                ))}
              </select>
            </FormField>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
              <button type="button" onClick={() => setAllocateModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition disabled:opacity-50">
                {isSubmitting ? 'Allocating...' : 'Allocate Seat'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
