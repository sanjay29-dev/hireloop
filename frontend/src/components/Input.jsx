import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Input({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  required = false,
  disabled = false,
  className = '',
  rows,
  ...props
}) {
  const isTextarea = type === 'textarea';
  const isPassword = type === 'password';
  const [showPassword, setShowPassword] = useState(false);

  // Compute effective type for password fields with visibility toggle
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
        >
          {label} {required && <span className="text-violet-400">*</span>}
        </label>
      )}

      <div className="relative rounded-xl">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        {isTextarea ? (
          <textarea
            id={name}
            name={name}
            rows={rows || 4}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full rounded-xl bg-navy-900/60 border ${
              error
                ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-white/10 hover:border-white/20 focus:border-violet-500 focus:ring-violet-500/20'
            } backdrop-blur-md text-white placeholder-slate-500 text-sm p-3 focus:outline-none focus:ring-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
            {...props}
          />
        ) : (
          <input
            id={name}
            name={name}
            type={inputType}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full rounded-xl bg-navy-900/60 border ${
              error
                ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-white/10 hover:border-white/20 focus:border-violet-500 focus:ring-violet-500/20'
            } backdrop-blur-md text-white placeholder-slate-500 text-sm py-2.5 ${
              Icon ? 'pl-10' : 'pl-3.5'
            } ${isPassword ? 'pr-10' : 'pr-3.5'} focus:outline-none focus:ring-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
            {...props}
          />
        )}

        {/* Show/Hide password toggle button */}
        {isPassword && !disabled && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors focus:outline-none cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 text-slate-400 hover:text-teal-400" />
            ) : (
              <Eye className="w-4 h-4 text-slate-400 hover:text-teal-400" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-rose-400 font-medium flex items-center gap-1">
          <span>•</span> {error}
        </p>
      )}
    </div>
  );
}
