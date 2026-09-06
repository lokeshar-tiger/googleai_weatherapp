import React from 'react';
import { CloudSun, RefreshCw, Compass } from 'lucide-react';
import { TemperatureUnit } from '../types/weather';

interface HeaderProps {
  unit: TemperatureUnit;
  onUnitToggle: (unit: TemperatureUnit) => void;
  onRefresh: () => void;
  isLoading: boolean;
  lastUpdated?: Date | null;
}

export const Header: React.FC<HeaderProps> = ({
  unit,
  onUnitToggle,
  onRefresh,
  isLoading,
  lastUpdated
}) => {
  const formattedTime = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : null;

  return (
    <header className="border-b border-white/10 bg-[#05070A]/80 backdrop-blur-xl sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(6,182,212,0.5)]">
            <CloudSun className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">
                Weather<span className="text-cyan-400">Intel</span>
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Open-Meteo Live
              </span>
            </div>
            <p className="text-xs text-white/50 hidden sm:block">
              Meteorological intelligence & 7-day predictive planning
            </p>
          </div>
        </div>

        {/* Action Controls: Units toggle & Refresh */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {formattedTime && (
            <span className="text-xs text-white/40 hidden md:inline-block">
              Updated {formattedTime}
            </span>
          )}

          {/* Unit Toggle Button */}
          <div className="inline-flex p-0.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold">
            <button
              id="unit-celsius-btn"
              type="button"
              onClick={() => onUnitToggle('celsius')}
              className={`px-3 py-1 rounded-full transition-all ${
                unit === 'celsius'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(34,211,238,0.4)] font-bold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              °C
            </button>
            <button
              id="unit-fahrenheit-btn"
              type="button"
              onClick={() => onUnitToggle('fahrenheit')}
              className={`px-3 py-1 rounded-full transition-all ${
                unit === 'fahrenheit'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(34,211,238,0.4)] font-bold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              °F
            </button>
          </div>

          {/* Refresh button */}
          <button
            id="refresh-weather-btn"
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh current weather data"
            className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
