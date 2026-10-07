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
  Brain,
  ShieldAlert,
  Database,
  Info,
  Scale,
  Sparkles,
} from 'lucide-react';
import { SdsWorkStyleResult } from '../../types';
import { Badge } from '../common/Badge';

interface WorkStylePageProps {
  sdsResult: SdsWorkStyleResult;
  onOpenDataTransparency: () => void;
}

export const WorkStylePage: React.FC<WorkStylePageProps> = ({
  sdsResult,
  onOpenDataTransparency,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
              SDS EXPLORATORY STUDY
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">Sample: {sdsResult.sampleRecords.toLocaleString()} Data Science Profiles</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Work Style & Success Insights
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Exploratory empirical research mapping Big Five behavioral dimensions against project delivery indicators.
          </p>
        </div>

        <button
          onClick={onOpenDataTransparency}
          className="px-4 py-2 bg-slate-800/80 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-medium border border-slate-700/80 transition-colors flex items-center gap-2"
        >
          <Database className="w-4 h-4 text-indigo-400" />
          Data Provenance
        </button>
      </div>

      {/* Overview Card */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 glow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              Big Five Factor Model
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">Observed Dimension Profile</h2>
          </div>
          <Badge variant="blue">Exploratory Cohort</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Horizontal Comparison Chart */}
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={sdsResult.dimensions}
                margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} />
                <YAxis
                  type="category"
                  dataKey="dimension"
                  stroke="#64748b"
                  tick={{ fontSize: 10 }}
                  width={150}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="score" fill="#38bdf8" radius={[0, 6, 6, 0]} name="Candidate Score" />
                <Bar dataKey="benchmarkAverage" fill="#64748b" radius={[0, 6, 6, 0]} name="Cohort Benchmark" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Dimension Details & Observed Associations */}
          <div className="space-y-3 text-xs">
            {sdsResult.dimensions.map(dim => (
              <div
                key={dim.dimension}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-white">{dim.dimension}</h4>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-cyan-300 font-bold">{dim.score}</span>
                    <span className="text-slate-500">/ avg {dim.benchmarkAverage}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  <strong className="text-slate-400">Observed Association in Sample:</strong> {dim.observedAssociation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clear Governance / Compliance Disclaimer */}
      <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-900/50 text-xs text-amber-200/90 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-300 uppercase tracking-wider text-[11px]">
          <ShieldAlert className="w-4 h-4 text-amber-400" /> Ethical AI Governance & Legal Disclaimer
        </div>
        <p className="leading-relaxed">
          {sdsResult.disclaimer}
        </p>
        <p className="text-[11px] text-amber-300/70">
          This platform strictly separates objective technical skill assessments from exploratory psychometric patterns. Personality indicators have zero bearing on match scores, career recommendations, or platform eligibility.
        </p>
      </div>
    </div>
  );
};
