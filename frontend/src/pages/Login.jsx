import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch {
      toast.error('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500 rounded-full opacity-10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-500/30">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Admission CRM</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1.5">Email address</label>
              <input
                type="email"
                placeholder="admin@crm.com"
                {...register('email', { required: 'Email is required' })}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                {...register('password', { required: 'Password is required' })}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10">
            <p className="text-xs text-slate-400 text-center mb-3">Demo credentials</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { role: 'Admin', email: 'admin@crm.com', pass: 'admin123', color: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 hover:border-indigo-400/60', badge: 'bg-indigo-500/30 text-indigo-300' },
                { role: 'Officer', email: 'officer@crm.com', pass: 'officer123', color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 hover:border-emerald-400/60', badge: 'bg-emerald-500/30 text-emerald-300' },
                { role: 'Mgmt', email: 'mgmt@crm.com', pass: 'mgmt123', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 hover:border-purple-400/60', badge: 'bg-purple-500/30 text-purple-300' },
              ].map((c) => (
                <div
                  key={c.role}
                  onClick={() => { setValue('email', c.email); setValue('password', c.pass); }}
                  className={`bg-gradient-to-br ${c.color} border cursor-pointer rounded-xl p-3 text-center transition-all duration-200 hover:scale-105`}
                >
                  <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1 ${c.badge}`}>{c.role}</span>
                  <p className="text-slate-300 text-xs truncate">{c.email}</p>
                  <p className="text-slate-500 text-xs">{c.pass}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
