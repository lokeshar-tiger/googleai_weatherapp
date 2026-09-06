import React from 'react';
import { AlertCircle, RefreshCw, Search, MapPinOff } from 'lucide-react';

interface ErrorMessageProps {
  title: string;
  message: string;
  searchedCity?: string;
  onRetry?: () => void;
  onSelectSuggestion?: (city: string) => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  searchedCity,
  onRetry,
  onSelectSuggestion
}) => {
  const isCityNotFound =
    message.toLowerCase().includes('not found') ||
    message.toLowerCase().includes('no locations') ||
    title.toLowerCase().includes('not found');

  const suggestions = ['Chennai', 'London', 'Tokyo', 'New York'];

  return (
    <div
      id="weather-error-banner"
      className="w-full max-w-4xl mx-auto my-6 p-6 rounded-3xl bg-rose-950/20 border border-rose-500/30 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
          {isCityNotFound ? (
            <MapPinOff className="w-6 h-6" />
          ) : (
            <AlertCircle className="w-6 h-6" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-white">
            {title}
          </h3>
          <p className="text-sm text-white/70 mt-1 leading-relaxed">
            {message}
          </p>

          {isCityNotFound && (
            <div className="mt-3.5 pt-3.5 border-t border-white/10">
              <span className="text-xs font-semibold text-white/40 block mb-2">
                Suggestions: Try verifying the spelling or select from these verified cities:
              </span>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => onSelectSuggestion?.(city)}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all flex items-center space-x-1.5"
                  >
                    <Search className="w-3 h-3 text-cyan-400" />
                    <span>{city}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {onRetry && (
          <div className="self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={onRetry}
              className="px-4 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center space-x-1.5 shadow-[0_0_15px_rgba(0,242,255,0.3)]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
