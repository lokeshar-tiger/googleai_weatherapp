import React from 'react';
import {
  Compass,
  Activity,
  Shirt,
  Sun,
  Car,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldAlert
} from 'lucide-react';
import { PlanningRecommendation } from '../types/weather';

interface PlanningIntelligenceProps {
  recommendations: PlanningRecommendation[];
}

export const PlanningIntelligence: React.FC<PlanningIntelligenceProps> = ({
  recommendations
}) => {
  if (!recommendations || recommendations.length === 0) return null;

  const getStatusBadge = (status: PlanningRecommendation['status']) => {
    switch (status) {
      case 'optimal':
        return {
          icon: CheckCircle2,
          badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
          indicator: 'bg-emerald-400',
          label: 'Favorable'
        };
      case 'moderate':
        return {
          icon: Info,
          badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
          indicator: 'bg-cyan-400',
          label: 'Advisory'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          indicator: 'bg-amber-400',
          label: 'Caution'
        };
      case 'alert':
        return {
          icon: ShieldAlert,
          badge: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
          indicator: 'bg-rose-400',
          label: 'Hazard Alert'
        };
    }
  };

  const getCategoryIcon = (category: PlanningRecommendation['category']) => {
    switch (category) {
      case 'activity':
        return Activity;
      case 'clothing':
        return Shirt;
      case 'uv':
        return Sun;
      case 'travel':
        return Car;
      default:
        return Compass;
    }
  };

  return (
    <div className="w-full glass-panel p-6 space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold shadow-[0_0_12px_rgba(0,242,255,0.2)]">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Operational & Activity Advisory
            </h3>
            <p className="text-xs text-white/50">
              Deterministic guidelines formulated from live Open-Meteo atmospheric metrics
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 self-start sm:self-auto">
          Automated Insights
        </span>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => {
          const statusInfo = getStatusBadge(rec.status);
          const CategoryIcon = getCategoryIcon(rec.category);
          const StatusIcon = statusInfo.icon;

          return (
            <div
              key={rec.id}
              className="p-5 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-cyan-400/40 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                {/* Category & Status Badges */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400">
                      <CategoryIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-white/50">
                      {rec.category === 'uv' ? 'UV & Sun' : rec.category}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusInfo.badge}`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    <span>{statusInfo.label}</span>
                  </span>
                </div>

                {/* Title and summary */}
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base leading-snug">
                    {rec.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-white/70 mt-1 leading-relaxed">
                    {rec.summary}
                  </p>
                </div>

                {/* Detail text */}
                <p className="text-xs text-white/50 leading-relaxed pt-1">
                  {rec.detail}
                </p>
              </div>

              {/* Explicit data attribution note */}
              <div className="pt-2 border-t border-white/5 text-[11px] text-cyan-400/70 font-mono">
                {rec.metricBasis}
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanatory footer disclaimer */}
      <div className="p-3.5 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl text-xs text-cyan-200/90 flex items-center space-x-2.5">
        <Info className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>
          <strong className="text-white">Data transparency:</strong> Recommendations are calculated deterministically from Open-Meteo meteorology metrics (temperature, precipitation probability, UV index, and wind gusts).
        </span>
      </div>
    </div>
  );
};
