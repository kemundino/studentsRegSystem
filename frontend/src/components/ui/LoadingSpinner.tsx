import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const sizeMap = {
  sm: { container: 'w-6 h-6', border: 'border-2' },
  md: { container: 'w-10 h-10', border: 'border-[3px]' },
  lg: { container: 'w-14 h-14', border: 'border-4' },
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
}) => {
  const { container, border } = sizeMap[size];

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative">
        {/* Track ring */}
        <div
          className={`${container} rounded-full ${border} border-white/[0.06]`}
        />
        {/* Spinning gradient ring */}
        <div
          className={`absolute inset-0 ${container} rounded-full ${border} border-transparent border-t-violet-500 border-r-cyan-500 animate-spin`}
        />
      </div>
      {text && (
        <p className="text-sm text-slate-400 animate-pulse">{text}</p>
      )}

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
