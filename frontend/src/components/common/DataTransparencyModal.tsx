import React from 'react';
import { X, Database, ShieldCheck, Cpu, Calendar, AlertTriangle, Layers } from 'lucide-react';
import { MarketOverview } from '../../types';

interface DataTransparencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  metadata?: Partial<MarketOverview>;
}

export const DataTransparencyModal: React.FC<DataTransparencyModalProps> = ({
  isOpen,
  onClose,
  metadata,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Data & Analytical Methodology</h3>
              <p className="text-xs text-slate-400">Verifiable benchmark provenance & model transparency</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto text-sm text-slate-300">
          {/* Key Dataset Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Analytics Jobs</span>
              </div>
              <div className="text-xl font-bold text-white">~15,800</div>
              <div className="text-[11px] text-slate-500">Structured postings</div>
            </div>

            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>Data Science Jobs</span>
              </div>
              <div className="text-xl font-bold text-white">~1,600</div>
              <div className="text-[11px] text-slate-500">Verified ML/DS records</div>
            </div>

            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Benchmark Window</span>
              </div>
              <div className="text-xl font-bold text-white">{metadata?.dataPeriod || '2024-2025'}</div>
              <div className="text-[11px] text-slate-500">Continuous sampling</div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-400" /> Primary Data Sources
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Aggregated industry recruitment repository consisting of 15,800 Analytics role records (Data Analyst, Business Analyst, BI Specialist) and 1,600 specialized Data Science records (Predictive Modeling, ML Engineers, Deep Learning Researchers).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1.5">
                Variables & Dimensions Analyzed
              </h4>
              <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                <li><strong className="text-slate-300">Technical Skills:</strong> 140+ extracted tokens (Python, SQL, PyTorch, dbt, Power BI, Statistics)</li>
                <li><strong className="text-slate-300">Compensation:</strong> Base salary ranges, bonus benchmarks, normalized percentile distributions</li>
                <li><strong className="text-slate-300">Experience Thresholds:</strong> Minimum and preferred years of experience, qualification tiers</li>
                <li><strong className="text-slate-300">Work Modality:</strong> Onsite, hybrid, and verified remote distribution patterns</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1.5">
                Modeling & Analytical Methodology
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-2">
                Recommendations are derived via multidimensional cosine similarity across validated technical skill matrices. Predictive salary-hike likelihood uses gradient-boosted ensembles trained on historical tenure and qualification transitions.
              </p>
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">Cosine Similarity</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">XGBoost Classifiers</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">Percentile Scaling</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> Limitations & Confidence Disclaimers
              </h4>
              <p className="text-xs text-amber-200/80 leading-relaxed">
                Market numbers reflect observed patterns in the aggregated dataset. Estimates represent decision-support insights and do not constitute legal employment guarantees or guaranteed compensation covenants.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex justify-between items-center text-xs text-slate-400">
          <span>Metadata updated: {metadata?.lastUpdated || '2026-10-01'}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
