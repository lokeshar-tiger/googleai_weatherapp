import React from 'react';
import { Clock, Droplets } from 'lucide-react';
import { HourlyForecastItem, TemperatureUnit } from '../types/weather';
import { getWeatherInfo } from '../utils/weatherCodes';
import { formatTemperature } from '../services/openMeteo';

interface HourlyForecastProps {
  hourlyItems: HourlyForecastItem[];
  unit: TemperatureUnit;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourlyItems, unit }) => {
  if (!hourlyItems || hourlyItems.length === 0) return null;

  return (
    <div className="w-full glass-panel p-6 space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center space-x-2.5">
          <Clock className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white tracking-tight">24-Hour Horizon</h3>
        </div>
        <span className="text-xs font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full">
          Hourly Progression
        </span>
      </div>

      {/* Horizontal Scrollable Carousel */}
      <div className="overflow-x-auto pb-2 -mx-2 px-2 scrollbar-thin scrollbar-thumb-white/10">
        <div className="flex space-x-3 min-w-max py-1">
          {hourlyItems.map((hour) => {
            const weatherInfo = getWeatherInfo(hour.weatherCode, hour.isDay);
            const Icon = weatherInfo.icon;

            return (
              <div
                key={hour.time}
                className={`w-24 p-3.5 rounded-2xl flex flex-col items-center justify-between text-center transition-all ${
                  hour.isCurrentHour
                    ? 'bg-cyan-500/15 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,242,255,0.2)]'
                    : 'bg-white/5 border border-white/5 hover:bg-white/10 hover:border-cyan-400/30'
                }`}
              >
                {/* Hour */}
                <span
                  className={`text-xs font-semibold ${
                    hour.isCurrentHour ? 'text-cyan-300 font-bold' : 'text-white/60'
                  }`}
                >
                  {hour.hourDisplay}
                </span>

                {/* Icon */}
                <div className="my-2.5 w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400">
                  <Icon className="w-4 h-4 text-cyan-400" />
                </div>

                {/* Temperature */}
                <span className="text-sm font-extrabold text-white font-mono">
                  {formatTemperature(hour.temperature, unit)}
                </span>

                {/* Rain probability if > 0 */}
                <div className="mt-1.5 h-4 flex items-center justify-center">
                  {hour.precipProbability > 0 ? (
                    <span className="text-[10px] text-cyan-300 font-medium flex items-center gap-0.5">
                      <Droplets className="w-2.5 h-2.5 text-cyan-400" />
                      {hour.precipProbability}%
                    </span>
                  ) : (
                    <span className="text-[10px] text-white/30">--</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
