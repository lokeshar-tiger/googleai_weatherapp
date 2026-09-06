import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { TrendingUp, Droplets, Wind } from 'lucide-react';
import { DayForecastItem, TemperatureUnit } from '../types/weather';
import { toFahrenheit } from '../services/openMeteo';

interface ForecastChartProps {
  forecasts: DayForecastItem[];
  unit: TemperatureUnit;
}

type ChartView = 'temperature' | 'precipitation' | 'wind';

export const ForecastChart: React.FC<ForecastChartProps> = ({ forecasts, unit }) => {
  const [activeView, setActiveView] = useState<ChartView>('temperature');

  if (!forecasts || forecasts.length === 0) return null;

  const chartData = forecasts.map((f) => {
    const maxTemp = unit === 'fahrenheit' ? toFahrenheit(f.tempMax) : f.tempMax;
    const minTemp = unit === 'fahrenheit' ? toFahrenheit(f.tempMin) : f.tempMin;
    const windSpeed = unit === 'fahrenheit' ? Math.round(f.windSpeedMax * 0.621371) : f.windSpeedMax;
    const windGusts = unit === 'fahrenheit' ? Math.round(f.windGustsMax * 0.621371) : f.windGustsMax;

    return {
      name: f.dayName,
      date: f.date,
      maxTemp,
      minTemp,
      precipProb: f.precipProbability,
      precipSum: f.precipSum,
      windSpeed,
      windGusts
    };
  });

  const tempSymbol = unit === 'fahrenheit' ? '°F' : '°C';
  const windSymbol = unit === 'fahrenheit' ? 'mph' : 'km/h';

  return (
    <div className="w-full glass-panel p-6 space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      {/* Header and View Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center space-x-2.5">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white tracking-tight">Meteorological Trend Analytics</h3>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center space-x-1.5 p-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveView('temperature')}
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center space-x-1.5 ${
              activeView === 'temperature'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(0,242,255,0.2)] font-bold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <span>Temperature ({tempSymbol})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('precipitation')}
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center space-x-1.5 ${
              activeView === 'precipitation'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(0,242,255,0.2)] font-bold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            <span>Precipitation (%)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('wind')}
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center space-x-1.5 ${
              activeView === 'wind'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(0,242,255,0.2)] font-bold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
            <span>Wind ({windSymbol})</span>
          </button>
        </div>
      </div>

      {/* Responsive Chart Container */}
      <div className="w-full h-64 sm:h-72 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeView === 'temperature' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMaxTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00F2FF" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#00F2FF" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorMinTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818CF8" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#818CF8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.07)" />
              <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.4)" fontSize={12} tickLine={false} />
              <YAxis
                stroke="rgba(255, 255, 255, 0.4)"
                fontSize={12}
                tickLine={false}
                unit={tempSymbol}
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090E17',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
                  color: '#ffffff',
                  fontSize: '12px'
                }}
                formatter={(value: any, name: any) => [
                  `${value}${tempSymbol}`,
                  name === 'maxTemp' ? 'High Temp' : 'Low Temp'
                ]}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ fontSize: '12px', paddingBottom: '10px', color: 'rgba(255, 255, 255, 0.7)' }}
              />
              <Area
                type="monotone"
                dataKey="maxTemp"
                name="High Temp"
                stroke="#00F2FF"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorMaxTemp)"
              />
              <Area
                type="monotone"
                dataKey="minTemp"
                name="Low Temp"
                stroke="#818CF8"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorMinTemp)"
              />
            </AreaChart>
          ) : activeView === 'precipitation' ? (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.07)" />
              <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.4)" fontSize={12} tickLine={false} />
              <YAxis
                stroke="rgba(255, 255, 255, 0.4)"
                fontSize={12}
                tickLine={false}
                unit="%"
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090E17',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
                  color: '#ffffff',
                  fontSize: '12px'
                }}
                formatter={(value: any, name: any) => [
                  name === 'precipProb' ? `${value}%` : `${value} mm`,
                  name === 'precipProb' ? 'Rain Probability' : 'Precipitation Sum'
                ]}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="rect"
                wrapperStyle={{ fontSize: '12px', paddingBottom: '10px', color: 'rgba(255, 255, 255, 0.7)' }}
              />
              <Bar
                dataKey="precipProb"
                name="Precipitation Probability"
                fill="#00F2FF"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.07)" />
              <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.4)" fontSize={12} tickLine={false} />
              <YAxis
                stroke="rgba(255, 255, 255, 0.4)"
                fontSize={12}
                tickLine={false}
                unit={` ${windSymbol}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090E17',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
                  color: '#ffffff',
                  fontSize: '12px'
                }}
                formatter={(value: any, name: any) => [
                  `${value} ${windSymbol}`,
                  name === 'windSpeed' ? 'Max Wind Speed' : 'Max Wind Gusts'
                ]}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ fontSize: '12px', paddingBottom: '10px', color: 'rgba(255, 255, 255, 0.7)' }}
              />
              <Line
                type="monotone"
                dataKey="windSpeed"
                name="Max Wind Speed"
                stroke="#00F2FF"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#00F2FF' }}
              />
              <Line
                type="monotone"
                dataKey="windGusts"
                name="Max Wind Gusts"
                stroke="#C084FC"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#C084FC' }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
