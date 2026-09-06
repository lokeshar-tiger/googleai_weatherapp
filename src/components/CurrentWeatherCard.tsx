import React from 'react';
import {
  Wind,
  Droplets,
  Gauge,
  SunMedium,
  Umbrella,
  Compass,
  ArrowUp,
  ArrowDown,
  Cloud,
  Eye,
  Clock,
  MapPin
} from 'lucide-react';
import {
  CurrentWeatherData,
  GeocodingResult,
  TemperatureUnit,
  DayForecastItem
} from '../types/weather';
import { getWeatherInfo } from '../utils/weatherCodes';
import {
  formatTemperature,
  formatWindSpeed,
  getWindDirectionCompass
} from '../services/openMeteo';

interface CurrentWeatherCardProps {
  current: CurrentWeatherData;
  selectedCity: GeocodingResult;
  unit: TemperatureUnit;
  todayForecast?: DayForecastItem;
  timezone?: string;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  current,
  selectedCity,
  unit,
  todayForecast,
  timezone
}) => {
  const weatherInfo = getWeatherInfo(current.weather_code, current.is_day);
  const IconComponent = weatherInfo.icon;
  const windCompass = getWindDirectionCompass(current.wind_direction_10m);

  // Local time formatted from ISO string or current
  const formattedTime = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="w-full glass-panel overflow-hidden relative shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      {/* Decorative ambient weather icon watermark */}
      <div className="absolute -top-6 -right-6 p-6 opacity-10 text-white pointer-events-none">
        <IconComponent className="w-48 h-48 sm:w-60 sm:h-60" strokeWidth={1} />
      </div>

      {/* Hero Content Section */}
      <div className="relative z-10 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* City & Condition Header */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 text-sm font-medium">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>
                {[selectedCity.name, selectedCity.admin1, selectedCity.country]
                  .filter(Boolean)
                  .join(', ')}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                {selectedCity.name}
              </h2>
              <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-300/90 font-mono">
                {selectedCity.latitude.toFixed(2)}°N, {selectedCity.longitude.toFixed(2)}°E
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-white/50 text-xs sm:text-sm">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Local: {formattedTime} ({timezone || 'Auto'})
              </span>
              <span>•</span>
              <span className="capitalize text-white/70 font-medium">
                {current.is_day ? 'Daytime' : 'Night'}
              </span>
            </div>
          </div>

          {/* Large Temperature Display */}
          <div className="flex items-center space-x-5">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,242,255,0.15)]">
              <IconComponent className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>

            <div>
              <div className="flex items-start text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white">
                {unit === 'fahrenheit'
                  ? Math.round((current.temperature_2m * 9) / 5 + 32)
                  : Math.round(current.temperature_2m)}
                <span className="text-3xl sm:text-4xl mt-2 font-light text-cyan-400 ml-1">
                  {unit === 'fahrenheit' ? '°F' : '°C'}
                </span>
              </div>
              <div className="text-sm font-semibold text-white/80 flex items-center gap-2">
                <span>{weatherInfo.label}</span>
                <span>•</span>
                <span className="text-white/50 font-normal">
                  Feels {formatTemperature(current.apparent_temperature, unit)}
                </span>
              </div>
              {todayForecast && (
                <div className="flex items-center space-x-3 text-xs text-white/60 mt-1 font-medium">
                  <span className="flex items-center text-rose-300">
                    <ArrowUp className="w-3.5 h-3.5 mr-0.5 text-rose-400" /> High: {formatTemperature(todayForecast.tempMax, unit)}
                  </span>
                  <span className="flex items-center text-cyan-300">
                    <ArrowDown className="w-3.5 h-3.5 mr-0.5 text-cyan-400" /> Low: {formatTemperature(todayForecast.tempMin, unit)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Atmospheric Metrics Grid */}
      <div className="p-6 pt-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 relative z-10">
        {/* Wind Speed & Direction */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-cyan-400/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/40 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider">Wind</span>
            <Wind className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-base sm:text-lg font-bold text-white">
            {formatWindSpeed(current.wind_speed_10m, unit)}
          </div>
          <div className="text-xs text-white/50 mt-1 flex items-center gap-1">
            <Compass className="w-3 h-3 text-cyan-400/70" />
            <span>{windCompass} ({current.wind_direction_10m}°)</span>
          </div>
        </div>

        {/* Relative Humidity */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-cyan-400/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/40 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider">Humidity</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-base sm:text-lg font-bold text-white">
            {current.relative_humidity_2m}%
          </div>
          <div className="text-xs text-white/50 mt-1">
            {current.relative_humidity_2m > 65
              ? 'Humid air'
              : current.relative_humidity_2m < 35
              ? 'Dry atmosphere'
              : 'Optimal comfort'}
          </div>
        </div>

        {/* UV Index */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-cyan-400/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/40 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider">UV Index</span>
            <SunMedium className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-base sm:text-lg font-bold text-white">
            {(current.uv_index ?? todayForecast?.uvIndexMax ?? 0).toFixed(1)}
          </div>
          <div className="text-xs text-white/50 mt-1">
            {(current.uv_index ?? 0) >= 8
              ? 'Very High'
              : (current.uv_index ?? 0) >= 6
              ? 'High risk'
              : (current.uv_index ?? 0) >= 3
              ? 'Moderate'
              : 'Low risk'}
          </div>
        </div>

        {/* Surface Pressure */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-cyan-400/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/40 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider">Pressure</span>
            <Gauge className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-base sm:text-lg font-bold text-white">
            {Math.round(current.pressure_msl ?? current.surface_pressure ?? 1013)} <span className="text-xs font-normal opacity-50">hPa</span>
          </div>
          <div className="text-xs text-white/50 mt-1">
            {(current.pressure_msl ?? 1013) > 1015 ? 'High system' : 'Standard'}
          </div>
        </div>

        {/* Precipitation */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-cyan-400/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/40 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider">Precipitation</span>
            <Umbrella className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-base sm:text-lg font-bold text-white">
            {current.precipitation} <span className="text-xs font-normal opacity-50">mm</span>
          </div>
          <div className="text-xs text-white/50 mt-1">
            {todayForecast ? `${todayForecast.precipProbability}% chance today` : 'Real-time trace'}
          </div>
        </div>

        {/* Wind Gusts / Cloud Cover */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-cyan-400/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/40 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider">Peak Gusts</span>
            <Wind className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-base sm:text-lg font-bold text-white">
            {formatWindSpeed(current.wind_gusts_10m, unit)}
          </div>
          <div className="text-xs text-white/50 mt-1">
            {current.cloud_cover !== undefined ? `${current.cloud_cover}% clouds` : 'Peak gusts'}
          </div>
        </div>
      </div>
    </div>
  );
};
