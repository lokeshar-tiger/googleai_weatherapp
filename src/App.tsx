/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { CitySearch } from './components/CitySearch';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { HourlyForecast } from './components/HourlyForecast';
import { Forecast7Day } from './components/Forecast7Day';
import { ForecastChart } from './components/ForecastChart';
import { PlanningIntelligence } from './components/PlanningIntelligence';
import { ErrorMessage } from './components/ErrorMessage';
import { LoadingSkeleton } from './components/LoadingSkeleton';

import {
  GeocodingResult,
  ForecastApiResponse,
  TemperatureUnit,
  DayForecastItem,
  HourlyForecastItem,
  PlanningRecommendation
} from './types/weather';

import {
  searchCities,
  fetchWeatherForecast,
  formatDayForecast,
  formatHourlyForecast
} from './services/openMeteo';

import { generatePlanningRecommendations } from './utils/recommendations';

// Default initial city (Chennai as requested)
const DEFAULT_CITY: GeocodingResult = {
  id: 1264527,
  name: 'Chennai',
  latitude: 13.0878,
  longitude: 80.2785,
  country: 'India',
  country_code: 'IN',
  admin1: 'Tamil Nadu',
  timezone: 'Asia/Kolkata'
};

const RECENT_SEARCHES_KEY = 'weather_intel_recent_searches';
const UNIT_PREFERENCE_KEY = 'weather_intel_unit';

export default function App() {
  const [selectedCity, setSelectedCity] = useState<GeocodingResult>(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState<ForecastApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [error, setError] = useState<{
    title: string;
    message: string;
    searchedCity?: string;
  } | null>(null);

  // Unit toggle state
  const [unit, setUnit] = useState<TemperatureUnit>(() => {
    const saved = localStorage.getItem(UNIT_PREFERENCE_KEY);
    return saved === 'fahrenheit' ? 'fahrenheit' : 'celsius';
  });

  // Recent searches state
  const [recentSearches, setRecentSearches] = useState<GeocodingResult[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      return saved ? JSON.parse(saved) : [DEFAULT_CITY];
    } catch {
      return [DEFAULT_CITY];
    }
  });

  const handleUnitToggle = (newUnit: TemperatureUnit) => {
    setUnit(newUnit);
    localStorage.setItem(UNIT_PREFERENCE_KEY, newUnit);
  };

  const saveRecentSearch = (city: GeocodingResult) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.id !== city.id && item.name !== city.name);
      const updated = [city, ...filtered].slice(0, 6);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  // Load weather for a given city
  const loadWeatherForCity = useCallback(async (city: GeocodingResult) => {
    setIsLoading(true);
    setError(null);

    try {
      const forecast = await fetchWeatherForecast(city.latitude, city.longitude);
      setWeatherData(forecast);
      setSelectedCity(city);
      setLastUpdated(new Date());
      saveRecentSearch(city);
    } catch (err) {
      console.error('Forecast fetch failed:', err);
      setError({
        title: 'Weather Data Unavailable',
        message:
          err instanceof Error
            ? err.message
            : 'Unable to retrieve meteorological data for this location. Please check your network connection.',
        searchedCity: city.name
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Search cities via Geocoding API
  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      const results = await searchCities(query);
      setSearchResults(results);

      if (results.length === 0) {
        setError({
          title: 'Location Not Found',
          message: `We couldn't find any locations matching "${query}". Please verify spelling or try including country name (e.g., "${query}, India").`,
          searchedCity: query
        });
      } else {
        // Automatically load weather for the top match
        const topMatch = results[0];
        await loadWeatherForCity(topMatch);
      }
    } catch (err) {
      console.error('Search failed:', err);
      setError({
        title: 'Search Service Error',
        message:
          err instanceof Error
            ? err.message
            : 'Could not connect to the geocoding service. Please try again in a moment.',
        searchedCity: query
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Direct selection from search dropdown or chips
  const handleSelectCity = (city: GeocodingResult) => {
    setSearchResults([]);
    loadWeatherForCity(city);
  };

  // Initial load on mount
  useEffect(() => {
    loadWeatherForCity(DEFAULT_CITY);
  }, [loadWeatherForCity]);

  // Derived formatted weather views
  const dayForecasts: DayForecastItem[] = weatherData
    ? formatDayForecast(weatherData.daily)
    : [];

  const todayForecast = dayForecasts[0];

  const hourlyForecasts: HourlyForecastItem[] = weatherData
    ? formatHourlyForecast(weatherData.hourly, weatherData.current?.time)
    : [];

  const recommendations: PlanningRecommendation[] =
    weatherData && weatherData.current
      ? generatePlanningRecommendations(weatherData.current, todayForecast)
      : [];

  return (
    <div className="min-h-screen bg-[#05070A] text-white flex flex-col font-sans relative overflow-x-hidden">
      {/* Immersive ambient glows */}
      <div className="bg-glow" />
      <div className="bg-glow-alt" />

      {/* Header with unit toggle & refresh */}
      <Header
        unit={unit}
        onUnitToggle={handleUnitToggle}
        onRefresh={() => loadWeatherForCity(selectedCity)}
        isLoading={isLoading || isSearching}
        lastUpdated={lastUpdated}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 relative z-10">
        {/* City Search Bar & Quick Controls */}
        <section aria-label="City Search">
          <CitySearch
            onSearch={handleSearch}
            onSelectResult={handleSelectCity}
            isLoading={isLoading}
            searchResults={searchResults}
            isSearching={isSearching}
            currentSelectedCity={selectedCity}
            recentSearches={recentSearches}
            onClearRecent={handleClearRecent}
          />
        </section>

        {/* Error notification if search or forecast failed */}
        {error && (
          <section aria-label="Error Alert">
            <ErrorMessage
              title={error.title}
              message={error.message}
              searchedCity={error.searchedCity}
              onRetry={() => {
                if (selectedCity) loadWeatherForCity(selectedCity);
              }}
              onSelectSuggestion={(city) => handleSearch(city)}
            />
          </section>
        )}

        {/* Loading Skeleton */}
        {isLoading && !weatherData && <LoadingSkeleton />}

        {/* Main Weather Intelligence Content */}
        {weatherData && weatherData.current && (
          <div className="space-y-6 sm:space-y-8">
            {/* Hero Current Weather telemetry card */}
            <section aria-label="Current Conditions">
              <CurrentWeatherCard
                current={weatherData.current}
                selectedCity={selectedCity}
                unit={unit}
                todayForecast={todayForecast}
                timezone={weatherData.timezone}
              />
            </section>

            {/* 24-Hour Horizon Carousel */}
            {hourlyForecasts.length > 0 && (
              <section aria-label="24-Hour Outlook">
                <HourlyForecast hourlyItems={hourlyForecasts} unit={unit} />
              </section>
            )}

            {/* 2-Column Analytics & 7-Day Forecast Grid */}
            <section aria-label="Forecast and Analytics" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 7-Day Day-by-Day Forecast Breakdown */}
              <Forecast7Day forecasts={dayForecasts} unit={unit} />

              {/* 7-Day Trend Visualizations */}
              <ForecastChart forecasts={dayForecasts} unit={unit} />
            </section>

            {/* Planning & Activity Intelligence Recommendations */}
            <section aria-label="Planning Recommendations">
              <PlanningIntelligence recommendations={recommendations} />
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/10 bg-[#05070A]/80 backdrop-blur-xl py-6 text-center text-xs text-white/40 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Weather<span className="text-cyan-400 font-semibold">Intel</span> • Powered by Open-Meteo Public Meteorological & Geocoding APIs
          </span>
          <span className="text-white/30">
            Real-time Telemetry & Atmospheric Forecasting
          </span>
        </div>
      </footer>
    </div>
  );
}
