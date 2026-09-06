import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, X, Loader2, History, ChevronRight } from 'lucide-react';
import { GeocodingResult } from '../types/weather';

interface CitySearchProps {
  onSearch: (cityQuery: string) => Promise<void>;
  onSelectResult: (city: GeocodingResult) => void;
  isLoading: boolean;
  searchResults: GeocodingResult[];
  isSearching: boolean;
  currentSelectedCity: GeocodingResult | null;
  recentSearches: GeocodingResult[];
  onClearRecent: () => void;
}

const POPULAR_CITIES = [
  { name: 'Chennai', country: 'India', lat: 13.0878, lon: 80.2785 },
  { name: 'London', country: 'United Kingdom', lat: 51.5085, lon: -0.1257 },
  { name: 'New York', country: 'United States', lat: 40.7128, lon: -74.006 },
  { name: 'Tokyo', country: 'Japan', lat: 35.6895, lon: 139.6917 },
  { name: 'Paris', country: 'France', lat: 48.8534, lon: 2.3488 },
  { name: 'Sydney', country: 'Australia', lat: -33.8678, lon: 151.2073 }
];

export const CitySearch: React.FC<CitySearchProps> = ({
  onSearch,
  onSelectResult,
  isLoading,
  searchResults,
  isSearching,
  currentSelectedCity,
  recentSearches,
  onClearRecent
}) => {
  const [query, setQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsDropdownOpen(true);
    onSearch(query.trim());
  };

  const handleSelect = (item: GeocodingResult) => {
    setQuery(`${item.name}${item.country ? `, ${item.country}` : ''}`);
    setIsDropdownOpen(false);
    onSelectResult(item);
  };

  const handleChipClick = (cityName: string) => {
    setQuery(cityName);
    onSearch(cityName);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3" ref={containerRef}>
      {/* Search Input Bar */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center rounded-full bg-white/5 border border-white/10 focus-within:border-cyan-400/50 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="pl-4 pr-2 text-white/40">
            <Search className="w-5 h-5 text-white/40" />
          </div>

          <input
            id="city-search-input"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!isDropdownOpen && searchResults.length > 0) {
                setIsDropdownOpen(true);
              }
            }}
            placeholder="Search city (e.g. London, Chennai, Tokyo)..."
            className="w-full py-3.5 pr-2 text-white placeholder:text-white/40 bg-transparent text-sm sm:text-base focus:outline-none"
            autoComplete="off"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsDropdownOpen(false);
              }}
              className="p-1.5 mr-1 text-white/40 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              title="Clear text"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="pr-1.5">
            <button
              id="city-search-button"
              type="submit"
              disabled={isLoading || isSearching || !query.trim()}
              className="px-5 sm:px-6 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-300 text-slate-950 font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span className="hidden sm:inline">Searching...</span>
                </>
              ) : (
                <span>Search</span>
              )}
            </button>
          </div>
        </div>

        {/* Dropdown for Geocoding search results */}
        {isDropdownOpen && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#0A0E17]/95 backdrop-blur-2xl rounded-2xl border border-white/15 shadow-[0_16px_36px_rgba(0,0,0,0.8)] overflow-hidden z-40">
            <div className="px-4 py-2.5 bg-white/[0.04] border-b border-white/10 text-xs font-semibold text-white/50 flex justify-between items-center">
              <span className="text-cyan-400 font-bold uppercase tracking-wider">Matching Locations ({searchResults.length})</span>
              <span>Select exact location</span>
            </div>
            <ul className="divide-y divide-white/5 max-h-72 overflow-y-auto">
              {searchResults.map((result) => {
                const region = [result.admin1, result.country].filter(Boolean).join(', ');
                const isCurrent = currentSelectedCity?.id === result.id;
                return (
                  <li key={result.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(result)}
                      className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-cyan-500/10 transition-colors ${
                        isCurrent ? 'bg-cyan-500/15' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                        <div>
                          <div className="font-semibold text-white text-sm">
                            {result.name}
                            {result.country_code && (
                              <span className="ml-2 text-xs font-medium px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 uppercase">
                                {result.country_code}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-white/50">
                            {region || 'Global coordinates'} • {result.latitude.toFixed(2)}°, {result.longitude.toFixed(2)}°
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/30" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </form>

      {/* Quick City Chips & Recent History */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
        <span className="text-white/40 font-medium mr-1 flex items-center">
          Popular:
        </span>
        {POPULAR_CITIES.map((city) => {
          const isSelected = currentSelectedCity?.name.toLowerCase() === city.name.toLowerCase();
          return (
            <button
              key={city.name}
              id={`quick-chip-${city.name.toLowerCase()}`}
              type="button"
              onClick={() => handleChipClick(city.name)}
              disabled={isLoading || isSearching}
              className={`px-3.5 py-1.5 rounded-full border transition-all ${
                isSelected
                  ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 font-bold shadow-[0_0_12px_rgba(0,242,255,0.25)]'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20'
              }`}
            >
              {city.name}
            </button>
          );
        })}

        {/* Invalid test chip for quick test as requested in prompt */}
        <button
          id="test-invalid-chip"
          type="button"
          onClick={() => handleChipClick('xyzinvalidcity123')}
          disabled={isLoading || isSearching}
          title="Test invalid/nonexistent city error handling"
          className="px-3 py-1.5 rounded-full border border-dashed border-rose-400/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 font-medium transition-all"
        >
          Test Invalid City
        </button>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="ml-auto flex items-center gap-1.5 pt-1 sm:pt-0">
            <span className="text-white/40 flex items-center gap-1">
              <History className="w-3.5 h-3.5" />
              Recent:
            </span>
            {recentSearches.slice(0, 3).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectResult(item)}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-white/70 border border-white/5 text-xs truncate max-w-[110px]"
                title={`${item.name}, ${item.country || ''}`}
              >
                {item.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
