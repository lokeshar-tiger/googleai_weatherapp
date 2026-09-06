import React from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Sparkles,
  LucideIcon,
  Moon,
  CloudMoon
} from 'lucide-react';

export interface WeatherCodeInfo {
  label: string;
  description: string;
  icon: LucideIcon;
  nightIcon?: LucideIcon;
  badgeClass: string;
  gradientClass: string;
  accentColor: string;
}

export const WEATHER_CODES: Record<number, WeatherCodeInfo> = {
  0: {
    label: 'Clear sky',
    description: 'Completely cloud-free sunny conditions',
    icon: Sun,
    nightIcon: Moon,
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    gradientClass: 'from-amber-400 to-orange-400',
    accentColor: '#f59e0b'
  },
  1: {
    label: 'Mainly clear',
    description: 'Passing high clouds, mostly sunny',
    icon: Sun,
    nightIcon: Moon,
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    gradientClass: 'from-sky-400 to-amber-300',
    accentColor: '#fbbf24'
  },
  2: {
    label: 'Partly cloudy',
    description: 'Scattered clouds with periods of sunshine',
    icon: CloudSun,
    nightIcon: CloudMoon,
    badgeClass: 'bg-sky-100 text-sky-800 border-sky-200',
    gradientClass: 'from-sky-400 to-blue-400',
    accentColor: '#38bdf8'
  },
  3: {
    label: 'Overcast',
    description: 'Continuous cloud cover across the sky',
    icon: Cloud,
    badgeClass: 'bg-slate-200 text-slate-800 border-slate-300',
    gradientClass: 'from-slate-400 to-slate-500',
    accentColor: '#64748b'
  },
  45: {
    label: 'Fog',
    description: 'Reduced horizontal visibility due to fog',
    icon: CloudFog,
    badgeClass: 'bg-teal-100 text-teal-800 border-teal-200',
    gradientClass: 'from-teal-400 to-slate-400',
    accentColor: '#14b8a6'
  },
  48: {
    label: 'Depositing rime fog',
    description: 'Freezing fog coating outdoor surfaces with ice crystals',
    icon: CloudFog,
    badgeClass: 'bg-teal-100 text-teal-800 border-teal-200',
    gradientClass: 'from-cyan-500 to-teal-400',
    accentColor: '#06b6d4'
  },
  51: {
    label: 'Light drizzle',
    description: 'Gentle, very fine mist droplets',
    icon: CloudDrizzle,
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    gradientClass: 'from-sky-400 to-blue-500',
    accentColor: '#60a5fa'
  },
  53: {
    label: 'Moderate drizzle',
    description: 'Consistent light drizzle',
    icon: CloudDrizzle,
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    gradientClass: 'from-sky-500 to-blue-600',
    accentColor: '#3b82f6'
  },
  55: {
    label: 'Dense drizzle',
    description: 'Heavy drizzle reducing visibility',
    icon: CloudDrizzle,
    badgeClass: 'bg-blue-200 text-blue-900 border-blue-300',
    gradientClass: 'from-blue-500 to-indigo-600',
    accentColor: '#2563eb'
  },
  56: {
    label: 'Light freezing drizzle',
    description: 'Freezing drizzle with potential road slickness',
    icon: CloudSnow,
    badgeClass: 'bg-cyan-100 text-cyan-900 border-cyan-300',
    gradientClass: 'from-cyan-400 to-blue-600',
    accentColor: '#0ea5e9'
  },
  57: {
    label: 'Dense freezing drizzle',
    description: 'Dense freezing drizzle creating icy layers',
    icon: CloudSnow,
    badgeClass: 'bg-cyan-200 text-cyan-950 border-cyan-400',
    gradientClass: 'from-cyan-500 to-indigo-600',
    accentColor: '#0284c7'
  },
  61: {
    label: 'Slight rain',
    description: 'Intermittent light rain showers',
    icon: CloudRain,
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    gradientClass: 'from-blue-400 to-indigo-500',
    accentColor: '#3b82f6'
  },
  63: {
    label: 'Moderate rain',
    description: 'Steady steady rainfall',
    icon: CloudRain,
    badgeClass: 'bg-blue-200 text-blue-900 border-blue-300',
    gradientClass: 'from-blue-500 to-indigo-600',
    accentColor: '#2563eb'
  },
  65: {
    label: 'Heavy rain',
    description: 'Substantial downpour, ponding on roadways',
    icon: CloudRain,
    badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    gradientClass: 'from-blue-600 to-slate-700',
    accentColor: '#1d4ed8'
  },
  66: {
    label: 'Light freezing rain',
    description: 'Raindrops freezing instantly on contact',
    icon: CloudSnow,
    badgeClass: 'bg-cyan-100 text-cyan-900 border-cyan-300',
    gradientClass: 'from-cyan-400 to-slate-600',
    accentColor: '#0284c7'
  },
  67: {
    label: 'Heavy freezing rain',
    description: 'Heavy freezing rain causing dangerous glaze ice',
    icon: CloudSnow,
    badgeClass: 'bg-cyan-200 text-cyan-950 border-cyan-400',
    gradientClass: 'from-cyan-600 to-slate-800',
    accentColor: '#0369a1'
  },
  71: {
    label: 'Slight snow',
    description: 'Scattered light snowflakes',
    icon: CloudSnow,
    badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    gradientClass: 'from-slate-200 to-blue-200',
    accentColor: '#818cf8'
  },
  73: {
    label: 'Moderate snow',
    description: 'Steady snowfall accumulating on surfaces',
    icon: CloudSnow,
    badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-200',
    gradientClass: 'from-blue-200 to-indigo-300',
    accentColor: '#6366f1'
  },
  75: {
    label: 'Heavy snow',
    description: 'Intense snowfall causing reduced visibility',
    icon: CloudSnow,
    badgeClass: 'bg-indigo-200 text-indigo-950 border-indigo-300',
    gradientClass: 'from-indigo-300 to-slate-400',
    accentColor: '#4f46e5'
  },
  77: {
    label: 'Snow grains',
    description: 'Small white opaque grains of ice',
    icon: CloudSnow,
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
    gradientClass: 'from-slate-300 to-blue-300',
    accentColor: '#94a3b8'
  },
  80: {
    label: 'Slight rain showers',
    description: 'Brief passing light showers',
    icon: CloudRain,
    badgeClass: 'bg-sky-100 text-sky-800 border-sky-200',
    gradientClass: 'from-sky-400 to-blue-500',
    accentColor: '#38bdf8'
  },
  81: {
    label: 'Moderate rain showers',
    description: 'Passing rain showers of moderate intensity',
    icon: CloudRain,
    badgeClass: 'bg-blue-100 text-blue-900 border-blue-300',
    gradientClass: 'from-sky-500 to-indigo-600',
    accentColor: '#2563eb'
  },
  82: {
    label: 'Violent rain showers',
    description: 'Sudden intense torrential downpours',
    icon: CloudRain,
    badgeClass: 'bg-indigo-100 text-indigo-950 border-indigo-400',
    gradientClass: 'from-indigo-600 to-slate-800',
    accentColor: '#1e40af'
  },
  85: {
    label: 'Slight snow showers',
    description: 'Passing light snow flurries',
    icon: CloudSnow,
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
    gradientClass: 'from-slate-300 to-sky-300',
    accentColor: '#94a3b8'
  },
  86: {
    label: 'Heavy snow showers',
    description: 'Frequent heavy snow squalls',
    icon: CloudSnow,
    badgeClass: 'bg-indigo-200 text-indigo-950 border-indigo-400',
    gradientClass: 'from-indigo-400 to-slate-600',
    accentColor: '#4338ca'
  },
  95: {
    label: 'Thunderstorm',
    description: 'Lightning activity with thunder',
    icon: CloudLightning,
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    gradientClass: 'from-amber-500 to-slate-800',
    accentColor: '#d97706'
  },
  96: {
    label: 'Thunderstorm with slight hail',
    description: 'Thunderstorm accompanied by small hail',
    icon: CloudLightning,
    badgeClass: 'bg-purple-100 text-purple-900 border-purple-300',
    gradientClass: 'from-purple-600 to-slate-900',
    accentColor: '#9333ea'
  },
  99: {
    label: 'Thunderstorm with heavy hail',
    description: 'Severe thunderstorm with damaging hail',
    icon: CloudLightning,
    badgeClass: 'bg-rose-100 text-rose-900 border-rose-300',
    gradientClass: 'from-rose-600 to-slate-950',
    accentColor: '#e11d48'
  }
};

export function getWeatherInfo(code: number, isDay: number | boolean = 1): WeatherCodeInfo {
  const isDaytime = Boolean(isDay);
  const info = WEATHER_CODES[code];
  if (!info) {
    return {
      label: 'Variable conditions',
      description: 'Typical atmospheric conditions',
      icon: isDaytime ? Sun : Moon,
      badgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
      gradientClass: 'from-slate-400 to-slate-600',
      accentColor: '#64748b'
    };
  }

  if (!isDaytime && info.nightIcon) {
    return {
      ...info,
      icon: info.nightIcon
    };
  }

  return info;
}
