import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  Sparkles,
  Cpu,
  AlertTriangle,
  Database,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import { JdsModelResult } from '../../types';
import { Badge } from '../common/Badge';

interface SkillOutcomePageProps {
  modelResult: JdsModelResult;
  onOpenDataTransparency: () => void;
}

export const SkillOutcomePage: React.FC<SkillOutcomePageProps> = ({
  modelResult,
  onOpenDataTransparency,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
              JDS CLASSIFIER INFERENCE
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">Trained on {modelResult.sampleRecords.toLocaleString()} Analytics Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Skills & Career Outcomes
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Explore which technical skill patterns are associated with observed salary-hike outcomes in historical transitions.
          </p>
        </div>

        <button
          onClick={onOpenDataTransparency}
          className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium border border-slate-700/80 transition-colors flex items-center gap-2"
        >
          <Database className="w-4 h-4 text-indigo-400" />
          Model Provenance
        </button>
      </div>

      {/* Top Prediction & Model Metadata Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prediction Status */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/70 via-slate-900/90 to-slate-950 border border-indigo-500/40 glow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-300">
                Predicted Outcome
              </span>
              <Badge variant="green">High Confidence</Badge>
            </div>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-4xl font-black text-white">{modelResult.predictedOutcome}</span>
              <span className="text-sm text-emerald-400 font-mono font-bold">
                ({(modelResult.probability * 100).toFixed(0)}% Probability)
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Based on your verified Python and SQL baseline, adding Machine Learning and Statistics elevates your profile into the top quartile of salary-hike trajectories.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            Ensemble Decision: <strong className="text-white">Favorable Progression Cluster</strong>
          </div>
        </div>

        {/* Model Metrics & Architecture */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 glow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Model Architecture
                </span>
                <h3 className="text-base font-bold text-white tracking-tight">{modelResult.modelName}</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Kaggle Trained</span>
            </div>

            {/* Performance Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 block mb-1">Accuracy</span>
                <span className="text-lg font-bold text-white font-mono">{modelResult.metrics.accuracy}%</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 block mb-1">Precision</span>
                <span className="text-lg font-bold text-indigo-400 font-mono">{modelResult.metrics.precision}%</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 block mb-1">Recall</span>
                <span className="text-lg font-bold text-emerald-400 font-mono">{modelResult.metrics.recall}%</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 block mb-1">F1 Score</span>
                <span className="text-lg font-bold text-cyan-400 font-mono">{modelResult.metrics.f1Score}%</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Validation: 5-Fold Stratified Cross-Validation</span>
            <span className="font-mono text-[11px] text-indigo-400">REST API Ready</span>
          </div>
        </div>
      </div>

      {/* FEATURE IMPORTANCE SECTION */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 glow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold">
              Gini Impurity / Gain Coefficients
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">Feature Importance Breakdown</h2>
          </div>
          <Badge variant="blue">Relative Weighting (%)</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Horizontal Bar Chart */}
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={modelResult.featureImportance}
                margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} unit="%" />
                <YAxis
                  type="category"
                  dataKey="feature"
                  stroke="#64748b"
                  tick={{ fontSize: 10 }}
                  width={140}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="importance" fill="#8b5cf6" radius={[0, 6, 6, 0]} name="Importance Weight (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Explanations */}
          <div className="space-y-2.5 text-xs">
            {modelResult.featureImportance.map((item, index) => (
              <div
                key={item.feature}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3"
              >
                <span className="w-5 h-5 rounded-full bg-purple-950 text-purple-400 border border-purple-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-white">{item.feature}</h4>
                    <span className="font-mono text-purple-300 font-bold">{item.importance}%</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mandatory Statistical Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-300">Methodological Disclaimer:</strong> {modelResult.disclaimer}
        </p>
      </div>
    </div>
  );
};
