import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hover = true,
  padding = 'p-6',
}) => {
  return (
    <div
      className={`
        bg-white/[0.03] backdrop-blur-xl 
        border border-white/[0.06] 
        rounded-2xl ${padding}
        ${hover ? 'hover:bg-white/[0.06] hover:border-white/[0.12] hover:shadow-lg hover:shadow-violet-500/5' : ''}
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
};
