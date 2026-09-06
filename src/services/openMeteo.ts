import {
  GeocodingResponse,
  GeocodingResult,
  ForecastApiResponse,
  DayForecastItem,
  HourlyForecastItem,
  TemperatureUnit
} from '../types/weather';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function searchCities(query: string): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(trimmed)}&count=8&language=en&format=json`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Geocoding service returned status ${response.status}`);
    }

    const data: GeocodingResponse = await response.json();
    return data.results || [];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to search for city "${trimmed}": ${error.message}`);
    }
    throw new Error(`Network error while searching for city "${trimmed}"`);
  }
}

export async function fetchWeatherForecast(
  latitude: number,
  longitude: number
): Promise<ForecastApiResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'rain',
      'showers',
      'snowfall',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
      'uv_index'
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'daylight_duration',
      'sunshine_duration',
      'uv_index_max',
      'precipitation_sum',
      'rain_sum',
      'showers_sum',
      'snowfall_sum',
      'precipitation_hours',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'wind_gusts_10m_max',
      'wind_direction_10m_dominant'
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'surface_pressure',
      'wind_speed_10m',
      'wind_gusts_10m',
      'uv_index',
      'is_day'
    ].join(','),
    timezone: 'auto'
  });

  const url = `${FORECAST_BASE_URL}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Forecast service returned status ${response.status}`);
    }

    const data: ForecastApiResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to retrieve forecast data: ${error.message}`);
    }
    throw new Error('Network error while retrieving weather forecast');
  }
}

export function formatDayForecast(daily: ForecastApiResponse['daily']): DayForecastItem[] {
  if (!daily || !daily.time) return [];

  const todayStr = new Date().toISOString().split('T')[0];

  return daily.time.map((timeStr, index) => {
    // Parse date safely
    const dateObj = new Date(`${timeStr}T12:00:00Z`);
    const isToday = timeStr === todayStr || index === 0;

    const dayName = isToday
      ? 'Today'
      : index === 1
      ? 'Tomorrow'
      : dateObj.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });

    return {
      date: timeStr,
      dayName,
      isToday,
      weatherCode: daily.weather_code[index] ?? 0,
      tempMax: Math.round(daily.temperature_2m_max[index] ?? 0),
      tempMin: Math.round(daily.temperature_2m_min[index] ?? 0),
      apparentTempMax: daily.apparent_temperature_max
        ? Math.round(daily.apparent_temperature_max[index] ?? 0)
        : undefined,
      apparentTempMin: daily.apparent_temperature_min
        ? Math.round(daily.apparent_temperature_min[index] ?? 0)
        : undefined,
      precipProbability: daily.precipitation_probability_max?.[index] ?? 0,
      precipSum: Math.round((daily.precipitation_sum?.[index] ?? 0) * 10) / 10,
      windSpeedMax: Math.round(daily.wind_speed_10m_max?.[index] ?? 0),
      windGustsMax: Math.round(daily.wind_gusts_10m_max?.[index] ?? 0),
      windDirectionDominant: daily.wind_direction_10m_dominant?.[index],
      uvIndexMax: daily.uv_index_max?.[index] ? Math.round(daily.uv_index_max[index] * 10) / 10 : undefined,
      sunrise: daily.sunrise?.[index] ? daily.sunrise[index].split('T')[1]?.slice(0, 5) : undefined,
      sunset: daily.sunset?.[index] ? daily.sunset[index].split('T')[1]?.slice(0, 5) : undefined
    };
  });
}

export function formatHourlyForecast(
  hourly: ForecastApiResponse['hourly'],
  currentIsoTime?: string
): HourlyForecastItem[] {
  if (!hourly || !hourly.time) return [];

  // Find the closest hour index
  const now = currentIsoTime ? new Date(currentIsoTime) : new Date();
  const currentHourString = now.toISOString().slice(0, 13); // "YYYY-MM-DDTHH"

  let startIndex = hourly.time.findIndex((t) => t.startsWith(currentHourString));
  if (startIndex === -1) startIndex = 0;

  // Take next 24 hours
  const next24 = hourly.time.slice(startIndex, startIndex + 24);

  return next24.map((timeStr, idx) => {
    const actualIndex = startIndex + idx;
    const dateObj = new Date(timeStr);
    const hourNumber = dateObj.getHours();
    const isAm = hourNumber < 12;
    const displayHour12 = hourNumber % 12 === 0 ? 12 : hourNumber % 12;
    const hourDisplay = idx === 0 ? 'Now' : `${displayHour12} ${isAm ? 'AM' : 'PM'}`;

    return {
      time: timeStr,
      hourDisplay,
      isCurrentHour: idx === 0,
      temperature: Math.round(hourly.temperature_2m[actualIndex] ?? 0),
      apparentTemp: hourly.apparent_temperature
        ? Math.round(hourly.apparent_temperature[actualIndex] ?? 0)
        : undefined,
      precipProbability: hourly.precipitation_probability?.[actualIndex] ?? 0,
      weatherCode: hourly.weather_code?.[actualIndex] ?? 0,
      humidity: hourly.relative_humidity_2m?.[actualIndex],
      windSpeed: hourly.wind_speed_10m ? Math.round(hourly.wind_speed_10m[actualIndex]) : undefined,
      uvIndex: hourly.uv_index?.[actualIndex],
      isDay: hourly.is_day ? hourly.is_day[actualIndex] === 1 : hourNumber >= 6 && hourNumber < 20
    };
  });
}

export function toFahrenheit(celsius: number): number {
  return Math.round((celsius * 9) / 5 + 32);
}

export function formatTemperature(
  tempCelsius: number,
  unit: TemperatureUnit = 'celsius'
): string {
  if (unit === 'fahrenheit') {
    return `${toFahrenheit(tempCelsius)}°F`;
  }
  return `${Math.round(tempCelsius)}°C`;
}

export function formatWindSpeed(
  speedKmh: number,
  unit: TemperatureUnit = 'celsius'
): string {
  if (unit === 'fahrenheit') {
    const mph = Math.round(speedKmh * 0.621371);
    return `${mph} mph`;
  }
  return `${Math.round(speedKmh)} km/h`;
}

export function getWindDirectionCompass(degrees: number): string {
  const directions = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
  ];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}
