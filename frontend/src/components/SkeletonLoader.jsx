import React from 'react';

export default function SkeletonLoader({ type = 'card', count = 3 }) {
  const items = Array.from({ length: count });

  if (type === 'stat') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {items.map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-navy-850/60 border border-white/5 p-6 animate-pulse"
          >
            <div className="h-4 bg-white/10 rounded w-1/3 mb-4" />
            <div className="h-8 bg-white/10 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-3 w-full">
        {items.map((_, i) => (
          <div
            key={i}
            className="rounded-xl bg-navy-850/60 border border-white/5 p-4 flex items-center justify-between animate-pulse"
          >
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-white/10 rounded w-1/4" />
              <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
            <div className="h-8 bg-white/10 rounded w-20" />
          </div>
        ))}
      </div>
    );
  }

  // Default: job / content cards
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {items.map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-navy-850/60 border border-white/5 p-6 animate-pulse space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-white/10 rounded w-3/4" />
              <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
          </div>
          <div className="h-12 bg-white/5 rounded" />
          <div className="flex gap-2">
            <div className="h-6 bg-white/10 rounded-full w-16" />
            <div className="h-6 bg-white/10 rounded-full w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
