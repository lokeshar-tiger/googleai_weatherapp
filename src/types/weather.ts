export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string; // state/province
  admin2?: string;
  timezone?: string;
  population?: number;
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
  generationtime_ms?: number;
}

export interface CurrentWeatherData {
  time: string;
  interval?: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  rain?: number;
  showers?: number;
  snowfall?: number;
  weather_code: number;
  cloud_cover?: number;
  pressure_msl?: number;
  surface_pressure?: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
  uv_index?: number;
}

export interface DailyForecastData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max?: number[];
  apparent_temperature_min?: number[];
  sunrise?: string[];
  sunset?: string[];
  daylight_duration?: number[];
  sunshine_duration?: number[];
  uv_index_max?: number[];
  precipitation_sum?: number[];
  rain_sum?: number[];
  showers_sum?: number[];
  snowfall_sum?: number[];
  precipitation_hours?: number[];
  precipitation_probability_max?: number[];
  wind_speed_10m_max?: number[];
  wind_gusts_10m_max?: number[];
  wind_direction_10m_dominant?: number[];
}

export interface HourlyForecastData {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m?: number[];
  apparent_temperature?: number[];
  precipitation_probability?: number[];
  precipitation?: number[];
  weather_code?: number[];
  wind_speed_10m?: number[];
  wind_gusts_10m?: number[];
  uv_index?: number[];
  is_day?: number[];
}

export interface ForecastApiResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units?: Record<string, string>;
  current: CurrentWeatherData;
  hourly?: HourlyForecastData;
  daily: DailyForecastData;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface DayForecastItem {
  date: string;
  dayName: string;
  isToday: boolean;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  apparentTempMax?: number;
  apparentTempMin?: number;
  precipProbability: number;
  precipSum: number;
  windSpeedMax: number;
  windGustsMax: number;
  windDirectionDominant?: number;
  uvIndexMax?: number;
  sunrise?: string;
  sunset?: string;
}

export interface HourlyForecastItem {
  time: string;
  hourDisplay: string;
  isCurrentHour: boolean;
  temperature: number;
  apparentTemp?: number;
  precipProbability: number;
  weatherCode: number;
  humidity?: number;
  windSpeed?: number;
  uvIndex?: number;
  isDay?: boolean;
}

export interface PlanningRecommendation {
  id: string;
  category: 'activity' | 'clothing' | 'uv' | 'travel' | 'comfort';
  title: string;
  summary: string;
  detail: string;
  status: 'optimal' | 'moderate' | 'warning' | 'alert';
  metricBasis: string;
}
