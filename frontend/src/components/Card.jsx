import React from 'react';

export default function Card({
  children,
  className = '',
  glow = false,
  hover = true,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl bg-navy-850/60 backdrop-blur-xl border border-white/10 ${
        hover
          ? 'transition-all duration-300 hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-950/40 hover:-translate-y-0.5'
          : ''
      } ${
        glow ? 'border-violet-500/30 shadow-lg shadow-violet-900/20' : 'shadow-lg shadow-black/30'
      } p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
