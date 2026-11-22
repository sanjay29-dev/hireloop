import React from 'react';
import { motion } from 'framer-motion';

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  icon: Icon,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-950 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-violet-600 via-purple-600 to-teal-500 hover:from-violet-500 hover:to-teal-400 text-white shadow-lg shadow-violet-600/25 hover:shadow-violet-600/40 hover:-translate-y-0.5 active:translate-y-0 focus:ring-violet-500',
    secondary:
      'bg-white/10 hover:bg-white/15 text-white border border-white/10 backdrop-blur-md hover:border-white/20 active:bg-white/5 focus:ring-teal-400',
    outline:
      'bg-transparent hover:bg-violet-500/10 text-violet-300 border border-violet-500/30 hover:border-violet-500/60 focus:ring-violet-400',
    danger:
      'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 hover:border-rose-500/50 focus:ring-rose-400',
    ghost:
      'bg-transparent hover:bg-white/5 text-slate-300 hover:text-white focus:ring-white/20',
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      ) : Icon ? (
        <Icon className={`${size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}`} />
      ) : null}
      {children}
    </motion.button>
  );
}
