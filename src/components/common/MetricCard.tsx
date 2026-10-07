import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  highlight?: boolean;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  highlight = false,
  className = '',
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 glow-card ${
        highlight
          ? 'bg-gradient-to-br from-indigo-950/60 via-slate-900/80 to-slate-950 border-indigo-500/40 shadow-lg shadow-indigo-950/30'
          : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700/80'
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {Icon && (
          <div
            className={`p-2 rounded-xl ${
              highlight ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800/60 text-slate-400'
            }`}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2.5">
        <span className="text-3xl font-bold tracking-tight text-white">{value}</span>
        {trend && (
          <span
            className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
              trend.isPositive
                ? 'text-emerald-400 bg-emerald-950/50'
                : 'text-amber-400 bg-amber-950/50'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">{subtitle}</p>}
    </div>
  );
};
