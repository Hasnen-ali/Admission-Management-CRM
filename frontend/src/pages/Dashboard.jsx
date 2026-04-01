import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ label, value, sub, color, icon }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-start gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-slate-800">{value ?? '—'}</p>
      <p className="text-sm text-slate-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/dashboard/summary').then((r) => setData(r.data)).catch(() => {});
  }, []);

  const fillPct = data ? Math.round((data.totalAdmitted / data.totalIntake) * 100) || 0 : 0;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-sm text-slate-500 mt-0.5">Here's what's happening with admissions today.</p>
        </div>
        <span className="text-xs bg-indigo-50 text-indigo-600 font-medium px-3 py-1.5 rounded-full border border-indigo-100">
          AY 2025-26
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Intake"
          value={data?.totalIntake}
          color="bg-indigo-50"
          icon={<svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
        />
        <StatCard
          label="Admitted"
          value={data?.totalAdmitted}
          sub={`${fillPct}% filled`}
          color="bg-emerald-50"
          icon={<svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          label="Remaining Seats"
          value={data?.remainingSeats}
          color="bg-amber-50"
          icon={<svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          label="Pending Docs"
          value={data?.pendingDocuments}
          sub={`${data?.pendingFees ?? 0} pending fees`}
          color="bg-red-50"
          icon={<svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
        />
      </div>

      {/* Overall progress */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-slate-700">Overall Admission Progress</p>
          <span className="text-sm font-bold text-indigo-600">{fillPct}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-3 rounded-full transition-all duration-700"
            style={{ width: `${fillPct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>{data?.totalAdmitted ?? 0} admitted</span>
          <span>{data?.totalIntake ?? 0} total seats</span>
        </div>
      </div>

      {/* Quota breakdown */}
      {data?.quotaSummary && (
        <div>
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Quota-wise Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(data.quotaSummary).map(([name, q]) => {
              const pct = q.total ? Math.round((q.filled / q.total) * 100) : 0;
              const colors = { KCET: 'from-blue-500 to-blue-600', COMEDK: 'from-purple-500 to-purple-600', Management: 'from-emerald-500 to-emerald-600' };
              const bgColors = { KCET: 'bg-blue-50 text-blue-700', COMEDK: 'bg-purple-50 text-purple-700', Management: 'bg-emerald-50 text-emerald-700' };
              return (
                <div key={name} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${bgColors[name] || 'bg-slate-100 text-slate-600'}`}>{name}</span>
                    <span className="text-lg font-bold text-slate-800">{pct}%</span>
                  </div>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between text-slate-600"><span>Total Seats</span><span className="font-medium">{q.total}</span></div>
                    <div className="flex justify-between text-slate-600"><span>Filled</span><span className="font-medium text-emerald-600">{q.filled}</span></div>
                    <div className="flex justify-between text-slate-600"><span>Remaining</span><span className="font-medium text-amber-600">{q.remaining}</span></div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className={`bg-gradient-to-r ${colors[name] || 'from-slate-400 to-slate-500'} h-2 rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
