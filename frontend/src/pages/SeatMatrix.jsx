import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function SeatMatrix() {
  const [matrix, setMatrix] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/programs/seat-matrix')
      .then((r) => setMatrix(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-12 text-slate-400">Loading...</div>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-slate-800">Seat Matrix</h1>
        <p className="text-sm text-slate-500">Real-time seat availability across all programs</p>
      </div>

      <div className="space-y-4">
        {matrix.map((prog) => {
          const totalFilled = prog.quotas.reduce((sum, q) => sum + q.filled, 0);
          const pct = Math.round((totalFilled / prog.totalIntake) * 100) || 0;

          return (
            <div key={prog.code} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-5 py-4 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-white text-base">{prog.program}</h2>
                  <p className="text-indigo-200 text-xs mt-0.5">Code: {prog.code} • Total Intake: {prog.totalIntake}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{pct}%</p>
                  <p className="text-xs text-indigo-200">Filled</p>
                </div>
              </div>

              {/* Quotas */}
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {prog.quotas.map((q) => {
                    const qPct = q.total ? Math.round((q.filled / q.total) * 100) : 0;
                    const colors = {
                      KCET: { bg: 'bg-blue-50', text: 'text-blue-700', bar: 'bg-blue-500' },
                      COMEDK: { bg: 'bg-purple-50', text: 'text-purple-700', bar: 'bg-purple-500' },
                      Management: { bg: 'bg-emerald-50', text: 'text-emerald-700', bar: 'bg-emerald-500' },
                    };
                    const c = colors[q.name] || { bg: 'bg-slate-50', text: 'text-slate-700', bar: 'bg-slate-500' };

                    return (
                      <div key={q.name} className={`${c.bg} rounded-xl p-4 border border-slate-100`}>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-xs font-bold ${c.text} uppercase tracking-wide`}>{q.name}</span>
                          <span className={`text-lg font-bold ${c.text}`}>{qPct}%</span>
                        </div>
                        <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                          <div className="flex justify-between"><span>Total</span><span className="font-semibold">{q.total}</span></div>
                          <div className="flex justify-between"><span>Filled</span><span className="font-semibold text-emerald-600">{q.filled}</span></div>
                          <div className="flex justify-between"><span>Available</span><span className="font-semibold text-amber-600">{q.remaining}</span></div>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div className={`${c.bar} h-2 rounded-full transition-all duration-500`} style={{ width: `${qPct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
