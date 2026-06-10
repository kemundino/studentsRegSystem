import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Loader2, GraduationCap } from 'lucide-react';
import { verifyEmail } from '../../api/backend';

export const Verify = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      setStatus('error');
      setMessage('Invalid verification link. Missing email parameter.');
      return;
    }

    const performVerification = async () => {
      try {
        await verifyEmail(email);
        setStatus('success');
        setMessage('Your email has been successfully verified! You can now log in to your dashboard.');
        // Auto redirect after 5 seconds
        setTimeout(() => {
          navigate('/login');
        }, 5000);
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.detail || 'Verification failed. The link may have expired or is invalid.');
      }
    };

    performVerification();
  }, [email, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0e1a] flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-8 rounded-2xl shadow-2xl text-center space-y-6">
        
        {/* Logo */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20 mb-4">
            <GraduationCap className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Email Verification</h1>
        </div>

        {/* Verification Status */}
        <div className="py-6 flex flex-col items-center justify-center">
          {status === 'loading' && (
            <div className="space-y-4 flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-violet-500 animate-spin" />
              <p className="text-sm text-slate-500 dark:text-slate-400">Verifying your teacher profile...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/35">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-xl font-semibold text-emerald-500">Verification Successful!</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs">{message}</p>
              <p className="text-xs text-slate-400">Redirecting to login page in 5 seconds...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 dark:bg-rose-500/20 text-rose-500 flex items-center justify-center border border-rose-500/35">
                <AlertCircle size={36} />
              </div>
              <h2 className="text-xl font-semibold text-rose-500">Verification Failed</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs">{message}</p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-white/10">
          <Link
            to="/login"
            className="inline-block w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold text-sm hover:opacity-95 transition-opacity"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};
