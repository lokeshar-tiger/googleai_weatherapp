import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-pulse" id="weather-loading-skeleton">
      {/* Hero card skeleton */}
      <div className="w-full glass-panel h-64 sm:h-72 p-8 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="w-40 h-4 bg-white/10 rounded-md" />
          <div className="w-64 h-10 bg-white/10 rounded-lg" />
          <div className="w-48 h-4 bg-white/10 rounded-md" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-white/5 rounded-xl border border-white/5" />
          ))}
        </div>
      </div>

      {/* 24-hour carousel skeleton */}
      <div className="w-full glass-panel p-6 space-y-4">
        <div className="w-48 h-5 bg-white/10 rounded-md" />
        <div className="flex space-x-3 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-24 h-28 bg-white/5 border border-white/5 rounded-2xl shrink-0" />
          ))}
        </div>
      </div>

      {/* Grid of Forecast & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="w-full glass-panel p-6 h-80 space-y-4">
          <div className="w-44 h-5 bg-white/10 rounded-md" />
          <div className="w-full h-56 bg-white/5 rounded-2xl border border-white/5" />
        </div>
        <div className="w-full glass-panel p-6 h-80 space-y-4">
          <div className="w-44 h-5 bg-white/10 rounded-md" />
          <div className="w-full h-56 bg-white/5 rounded-2xl border border-white/5" />
        </div>
      </div>
    </div>
  );
};
