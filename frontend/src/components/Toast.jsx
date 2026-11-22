import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({
  isOpen,
  message,
  type = 'success',
  onClose,
}) {
  if (!isOpen || !message) return null;

  const typeConfig = {
    success: {
      icon: CheckCircle2,
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-950/60',
      iconColor: 'text-emerald-400',
    },
    error: {
      icon: AlertCircle,
      border: 'border-rose-500/30',
      bg: 'bg-rose-950/60',
      iconColor: 'text-rose-400',
    },
    info: {
      icon: Info,
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-950/60',
      iconColor: 'text-cyan-400',
    },
  };

  const current = typeConfig[type] || typeConfig.info;
  const Icon = current.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border ${current.border} ${current.bg} backdrop-blur-xl shadow-xl text-white max-w-md`}
      >
        <Icon className={`w-5 h-5 flex-shrink-0 ${current.iconColor}`} />
        <span className="text-sm font-medium">{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
