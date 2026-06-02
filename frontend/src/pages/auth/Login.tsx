import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      const errorData = err.response?.data?.detail;
      if (typeof errorData === 'string') {
        setError(errorData);
      } else if (Array.isArray(errorData)) {
        const messages = errorData.map((e: any) => e.msg || JSON.stringify(e)).join(', ');
        setError(messages || 'Validation error.');
      } else if (errorData && typeof errorData === 'object') {
        setError(errorData.message || JSON.stringify(errorData));
      } else {
        setError('Failed to login. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
            top: '-10%',
            right: '-10%',
            animation: 'blob-move 12s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
          style={{
            background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
            bottom: '-10%',
            left: '-5%',
            animation: 'blob-move 15s ease-in-out infinite reverse',
          }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full opacity-10 blur-[80px]"
          style={{
            background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'blob-move 10s ease-in-out infinite 2s',
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Login Card */}
      <div
        className="relative z-10 w-full max-w-md mx-4"
        style={{ animation: 'fadeInUp 0.6s ease-out forwards' }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 shadow-2xl shadow-violet-500/25 mb-5"
            style={{ animation: 'float 4s ease-in-out infinite' }}
          >
            <GraduationCap className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Welcome to <span className="gradient-text">UniSystem</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Sign in to access your university dashboard
          </p>
        </div>

        {/* Glass Card */}
        <div className="glass rounded-2xl p-8 shadow-2xl shadow-black/20">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div
                className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
                style={{ animation: 'fadeInDown 0.3s ease-out' }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <div
                className={`
                  relative flex items-center gap-3 px-4 py-3 rounded-xl
                  bg-white/[0.04] border transition-all duration-300
                  ${focusedField === 'email'
                    ? 'border-violet-500/40 bg-white/[0.06] shadow-lg shadow-violet-500/5'
                    : 'border-white/[0.06] hover:border-white/[0.12]'
                  }
                `}
              >
                <Mail size={18} className={`flex-shrink-0 transition-colors ${focusedField === 'email' ? 'text-violet-500 dark:text-violet-400' : 'text-slate-500'}`} />
                <input
                  id="email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="admin@university.edu"
                  className="bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-500 text-sm w-full"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <div
                className={`
                  relative flex items-center gap-3 px-4 py-3 rounded-xl
                  bg-white/[0.04] border transition-all duration-300
                  ${focusedField === 'password'
                    ? 'border-violet-500/40 bg-white/[0.06] shadow-lg shadow-violet-500/5'
                    : 'border-white/[0.06] hover:border-white/[0.12]'
                  }
                `}
              >
                <Lock size={18} className={`flex-shrink-0 transition-colors ${focusedField === 'password' ? 'text-violet-500 dark:text-violet-400' : 'text-slate-500'}`} />
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your password"
                  className="bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-500 text-sm w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors flex-shrink-0"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="
                w-full py-3 px-4 rounded-xl
                bg-gradient-to-r from-violet-600 to-cyan-600
                hover:from-violet-500 hover:to-cyan-500
                text-white font-semibold text-sm
                transition-all duration-300
                hover:shadow-lg hover:shadow-violet-500/20
                hover:-translate-y-0.5
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                flex items-center justify-center gap-2
                group
              "
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 dark:text-slate-400 mt-6">
          © 2025 UniSystem. All rights reserved.
        </p>
      </div>
    </div>
  );
};
