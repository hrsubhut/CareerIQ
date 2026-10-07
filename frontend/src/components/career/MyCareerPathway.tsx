import React from 'react';
import { ArrowDown, ChevronRight, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { CareerRecommendation } from '../../types';

interface MyCareerPathwayProps {
  currentRole: string;
  targetRole: string;
  recommendations: CareerRecommendation[];
  onSelectRole: (roleName: string) => void;
}

const STAGES = [
  {
    role: 'Data Analyst',
    stage: 'Current Role',
    stageType: 'current' as const,
    match: 87,
    experience: '1–3 Years',
    salary: '$75k – $105k',
    summary: 'Your validated baseline in SQL, Excel, and data visualization. Strong foundation for the Data Scientist path.',
    whatNext: 'Build structured machine learning modeling projects with real datasets.',
  },
  {
    role: 'Senior Data Analyst',
    stage: 'Near-Term',
    stageType: 'near' as const,
    match: 78,
    experience: '3–5 Years',
    salary: '$95k – $130k',
    summary: 'Requires A/B testing design, causal inference, and stakeholder communication skills.',
    whatNext: 'Learn experimentation design and metric sensitivity analysis.',
  },
  {
    role: 'Data Scientist',
    stage: 'Your Target',
    stageType: 'target' as const,
    match: 71,
    experience: '3–5 Years',
    salary: '$110k – $160k',
    summary: 'Primary target role with high market demand and +43% compensation upside from current level.',
    whatNext: 'Master scikit-learn predictive modeling & inferential statistics.',
    isTarget: true,
  },
  {
    role: 'Senior Data Scientist',
    stage: 'Long-Term',
    stageType: 'future' as const,
    match: 62,
    experience: '5–7 Years',
    salary: '$140k – $190k',
    summary: 'Requires production model deployment, MLOps, and architectural ownership at scale.',
    whatNext: 'Learn Docker, Airflow, and automated model monitoring systems.',
  },
];

const STAGE_COLORS: Record<string, { badge: string; border: string; bg: string }> = {
  current: {
    badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    border: 'border-emerald-300',
    bg: 'bg-emerald-50/30',
  },
  near: {
    badge: 'bg-gray-100 text-gray-600',
    border: 'border-gray-200',
    bg: 'bg-white',
  },
  target: {
    badge: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    border: 'border-indigo-400',
    bg: 'bg-indigo-50/20',
  },
  future: {
    badge: 'bg-gray-100 text-gray-500',
    border: 'border-gray-200',
    bg: 'bg-white',
  },
};

export const MyCareerPathway: React.FC<MyCareerPathwayProps> = ({
  currentRole,
  targetRole,
  recommendations,
  onSelectRole,
}) => {
  return (
    <div className="space-y-8 max-w-3xl mx-auto py-4 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Career Pathways</h1>
        <p className="text-sm text-gray-500 mt-1">
          Realistic step-by-step progression from <strong className="text-gray-700">{currentRole}</strong> to <strong className="text-indigo-600">{targetRole}</strong>.
        </p>
      </div>

      {/* Pathway steps */}
      <div className="space-y-3">
        {STAGES.map((stage, idx) => {
          const colors = STAGE_COLORS[stage.stageType];
          return (
            <React.Fragment key={stage.role}>
              <div
                onClick={() => onSelectRole(stage.role)}
                className={`rounded-2xl border p-5 shadow-sm cursor-pointer transition-all duration-200 card-hover ${colors.border} ${colors.bg} ${
                  stage.isTarget ? 'ring-1 ring-indigo-400' : ''
                }`}
              >
                {/* Title row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-base font-bold text-gray-900">{stage.role}</h2>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${colors.badge}`}>
                      {stage.stage}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-500">Match:</span>
                    <span className="text-sm font-bold text-emerald-600 font-numeric">{stage.match}%</span>
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden ml-1">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${stage.match}%` }}
                      />
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed mb-3">{stage.summary}</p>

                {/* Meta grid */}
                <div className="flex flex-wrap gap-4 text-xs pt-3 border-t border-gray-100/80">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    {stage.experience}
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                    {stage.salary}
                  </div>
                  <div className="flex items-center gap-1.5 text-indigo-600 font-semibold ml-auto">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {stage.whatNext.slice(0, 45)}{stage.whatNext.length > 45 ? '…' : ''}
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </div>
              </div>

              {idx < STAGES.length - 1 && (
                <div className="flex justify-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-px h-3 bg-gray-300" />
                    <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                      <ArrowDown className="w-3 h-3 text-gray-400" />
                    </div>
                    <div className="w-px h-3 bg-gray-300" />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Market opportunities from recommendations */}
      {recommendations.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Market Matched Opportunities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recommendations.slice(0, 4).map(rec => (
              <div
                key={rec.id}
                onClick={() => onSelectRole(rec.role)}
                className="p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-sm cursor-pointer transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xs font-bold text-gray-900">{rec.role}</h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-numeric">
                    {rec.match_score}%
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">{rec.salary_range}</p>
                <div className="w-full h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${rec.match_score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
