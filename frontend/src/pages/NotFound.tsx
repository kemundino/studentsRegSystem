import { Home, ArrowLeft } from 'lucide-react';

const notFoundStyles = `
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
@keyframes pulse-glow {
  0%, 100% { text-shadow: 0 0 40px rgba(139,92,246,0.3), 0 0 80px rgba(6,182,212,0.15); }
  50% { text-shadow: 0 0 60px rgba(139,92,246,0.5), 0 0 120px rgba(6,182,212,0.25); }
}`;

export const NotFound = () => {
  return (
    <>
      <style>{notFoundStyles}</style>
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        </div>

        <div className="text-center relative z-10">
          {/* Floating 404 */}
          <div
            style={{ animation: 'float 6s ease-in-out infinite, pulse-glow 4s ease-in-out infinite' }}
          >
            <h1
              className="text-[10rem] sm:text-[14rem] font-extrabold leading-none bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent select-none"
              style={{ animation: 'fadeInUp 0.8s ease-out forwards', opacity: 0 }}
            >
              404
            </h1>
          </div>

          {/* Subtitle */}
          <h2
            className="text-2xl sm:text-3xl font-bold text-white mt-2"
            style={{ animation: 'fadeInUp 0.6s ease-out forwards', animationDelay: '0.2s', opacity: 0 }}
          >
            Page Not Found
          </h2>

          {/* Description */}
          <p
            className="text-slate-400 mt-4 max-w-md mx-auto text-sm sm:text-base leading-relaxed"
            style={{ animation: 'fadeInUp 0.6s ease-out forwards', animationDelay: '0.35s', opacity: 0 }}
          >
            Oops! The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>

          {/* Actions */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
            style={{ animation: 'fadeInUp 0.6s ease-out forwards', animationDelay: '0.5s', opacity: 0 }}
          >
            <a
              href="/"
              className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-300 hover:scale-105"
            >
              <Home size={18} />
              Go Home
            </a>
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-300 font-semibold text-sm hover:bg-white/[0.08] hover:text-white transition-all duration-300"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
          </div>

          {/* Decorative line */}
          <div
            className="mt-12 flex justify-center"
            style={{ animation: 'fadeInUp 0.6s ease-out forwards', animationDelay: '0.65s', opacity: 0 }}
          >
            <div className="w-24 h-0.5 rounded-full bg-gradient-to-r from-violet-500/50 to-cyan-500/50" />
          </div>
        </div>
      </div>
    </>
  );
};
