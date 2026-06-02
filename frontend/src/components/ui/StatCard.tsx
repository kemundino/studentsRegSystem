import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
  gradient: string;
  delay?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendUp,
  gradient,
  delay = '0ms',
}) => {
  return (
    <div
      className="
        bg-white/[0.03] backdrop-blur-xl 
        border border-white/[0.06] 
        rounded-2xl p-6
        hover:bg-white/[0.06] hover:border-white/[0.12] 
        hover:shadow-lg hover:shadow-violet-500/5
        transition-all duration-300
        relative overflow-hidden
        animate-fade-in-up
      "
      style={{
        animation: `fadeInUp 0.6s ease-out ${delay} both`,
      }}
    >
      {/* Subtle gradient glow behind card */}
      <div
        className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${gradient} rounded-full opacity-[0.07] blur-2xl pointer-events-none`}
      />

      <div className="relative flex items-start justify-between">
        {/* Left: Icon + Value + Title */}
        <div className="flex flex-col gap-3">
          <div
            className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
          >
            {icon}
          </div>
          <div>
            <p className="text-3xl font-bold text-white tracking-tight">
              {value}
            </p>
            <p className="text-sm text-slate-400 mt-1">{title}</p>
          </div>
        </div>

        {/* Right: Trend badge */}
        <div
          className={`
            flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
            ${
              trendUp
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }
          `}
        >
          {trendUp ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {trend}
        </div>
      </div>

      {/* Global keyframes style (injected once) */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
