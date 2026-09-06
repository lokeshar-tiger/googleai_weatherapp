import React, { useState } from 'react';
import {
  Calendar,
  Droplets,
  Wind,
  SunMedium,
  Sunrise,
  Sunset,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { DayForecastItem, TemperatureUnit } from '../types/weather';
import { getWeatherInfo } from '../utils/weatherCodes';
import { formatTemperature, formatWindSpeed } from '../services/openMeteo';

interface Forecast7DayProps {
  forecasts: DayForecastItem[];
  unit: TemperatureUnit;
}

export const Forecast7Day: React.FC<Forecast7DayProps> = ({ forecasts, unit }) => {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  if (!forecasts || forecasts.length === 0) return null;

  // Find min and max across all 7 days to draw proportional temperature bars
  const allMins = forecasts.map((f) => f.tempMin);
  const allMaxs = forecasts.map((f) => f.tempMax);
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const rangeSpan = Math.max(globalMax - globalMin, 1);

  const toggleExpand = (date: string) => {
    setExpandedDate(expandedDate === date ? null : date);
  };

  return (
    <div className="w-full glass-panel p-6 space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center space-x-2.5">
          <Calendar className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white tracking-tight">7-Day Atmospheric Outlook</h3>
        </div>
        <span className="text-xs font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full">
          Daily Sequence
        </span>
      </div>

      <div className="grid grid-cols-1 divide-y divide-white/5">
        {forecasts.map((day) => {
          const weatherInfo = getWeatherInfo(day.weatherCode, true);
          const Icon = weatherInfo.icon;
          const isExpanded = expandedDate === day.date;

          // Calculate temperature range bar percentages
          const leftPercent = ((day.tempMin - globalMin) / rangeSpan) * 100;
          const barWidthPercent = Math.max(((day.tempMax - day.tempMin) / rangeSpan) * 100, 8);

          return (
            <div key={day.date} className="py-2.5 transition-all">
              <button
                type="button"
                onClick={() => toggleExpand(day.date)}
                className="w-full flex items-center justify-between text-left hover:bg-white/5 p-2.5 rounded-2xl transition-colors group"
              >
                {/* Day name & date */}
                <div className="w-28 sm:w-36 shrink-0">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`font-semibold text-sm ${
                        day.isToday ? 'text-cyan-300 font-bold' : 'text-white'
                      }`}
                    >
                      {day.dayName}
                    </span>
                    {day.isToday && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-semibold uppercase">
                        Today
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-white/40 block mt-0.5">
                    {new Date(`${day.date}T12:00:00Z`).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      timeZone: 'UTC'
                    })}
                  </span>
                </div>

                {/* Condition icon & label */}
                <div className="flex items-center space-x-3 flex-1 min-w-0 pr-2">
                  <div className="w-9 h-9 rounded-xl bg-white/5 group-hover:bg-white/10 flex items-center justify-center text-cyan-400 shrink-0 border border-white/10 transition-colors">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="min-w-0 hidden sm:block">
                    <span className="text-xs font-semibold text-white/90 truncate block">
                      {weatherInfo.label}
                    </span>
                    {day.precipProbability > 0 && (
                      <span className="text-[11px] text-cyan-300 font-medium flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-cyan-400" />
                        {day.precipProbability}% rain
                      </span>
                    )}
                  </div>
                </div>

                {/* Precipitation pill for mobile */}
                <div className="sm:hidden text-xs text-cyan-300 font-medium px-2 shrink-0">
                  {day.precipProbability > 0 ? `${day.precipProbability}%` : ''}
                </div>

                {/* Temperature range bar */}
                <div className="flex items-center space-x-3 w-44 sm:w-56 justify-end shrink-0">
                  <span className="text-xs font-medium text-white/50 w-9 text-right font-mono">
                    {formatTemperature(day.tempMin, unit)}
                  </span>

                  {/* Visual Bar with Cyan Glow */}
                  <div className="relative w-20 sm:w-28 h-2 bg-white/10 rounded-full overflow-hidden hidden xs:block">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-rose-400 shadow-[0_0_8px_rgba(0,242,255,0.4)]"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${barWidthPercent}%`
                      }}
                    />
                  </div>

                  <span className="text-sm font-bold text-white w-9 text-right font-mono">
                    {formatTemperature(day.tempMax, unit)}
                  </span>

                  <div className="text-white/40 pl-1 group-hover:text-cyan-400 transition-colors">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </button>

              {/* Expanded details drawer */}
              {isExpanded && (
                <div className="mt-2.5 p-4 rounded-2xl bg-white/[0.03] border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs animate-fadeIn">
                  <div className="flex items-center space-x-2.5 bg-white/5 p-3 rounded-xl border border-white/5">
                    <Droplets className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <div className="text-white/40 font-medium text-[11px]">Precipitation</div>
                      <div className="font-semibold text-white">
                        {day.precipProbability}% ({day.precipSum} mm)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5 bg-white/5 p-3 rounded-xl border border-white/5">
                    <Wind className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <div className="text-white/40 font-medium text-[11px]">Wind & Gusts</div>
                      <div className="font-semibold text-white">
                        {formatWindSpeed(day.windSpeedMax, unit)} (Gusts {formatWindSpeed(day.windGustsMax, unit)})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5 bg-white/5 p-3 rounded-xl border border-white/5">
                    <SunMedium className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <div className="text-white/40 font-medium text-[11px]">Max UV Index</div>
                      <div className="font-semibold text-white">
                        {day.uvIndexMax ? day.uvIndexMax.toFixed(1) : 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5 bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="flex items-center text-amber-400 shrink-0">
                      <Sunrise className="w-4 h-4 mr-0.5" />
                      <Sunset className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-white/40 font-medium text-[11px]">Sun Timings</div>
                      <div className="font-semibold text-white">
                        {day.sunrise || '--:--'} / {day.sunset || '--:--'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
