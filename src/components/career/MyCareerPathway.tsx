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
    bg: 'bg-indigo-50/30',
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
    <div className="w-full space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Career Pathways</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-4xl">
          Realistic step-by-step progression from <strong className="text-gray-900 font-bold">{currentRole}</strong> to <strong className="text-indigo-600 font-bold">{targetRole}</strong>.
        </p>
      </div>

      {/* Pathway steps */}
      <div className="space-y-5">
        {STAGES.map((stage, idx) => {
          const colors = STAGE_COLORS[stage.stageType];
          return (
            <React.Fragment key={stage.role}>
              <div
                onClick={() => onSelectRole(stage.role)}
                className={`rounded-2xl border p-6 sm:p-7 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 ${colors.border} ${colors.bg} ${
                  stage.isTarget ? 'ring-2 ring-indigo-400 shadow-md' : ''
                }`}
              >
                {/* Title row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900">{stage.role}</h2>
                    <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg ${colors.badge}`}>
                      {stage.stage}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm text-gray-500 font-semibold">Match:</span>
                    <span className="text-base sm:text-lg font-black text-emerald-600 font-numeric">{stage.match}%</span>
                    <div className="w-20 sm:w-24 h-2 bg-gray-200 rounded-full overflow-hidden ml-1">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${stage.match}%` }}
                      />
                    </div>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">{stage.summary}</p>

                {/* Meta grid */}
                <div className="flex flex-wrap items-center gap-5 text-xs sm:text-sm pt-4 border-t border-gray-100/90 font-medium">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{stage.experience}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span>{stage.salary}</span>
                  </div>
                  <div className="flex items-center gap-2 text-indigo-700 font-bold ml-auto">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    <span>{stage.whatNext}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {idx < STAGES.length - 1 && (
                <div className="flex justify-center py-1">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-0.5 h-3 bg-indigo-300" />
                    <div className="w-7 h-7 rounded-full bg-white border border-indigo-200 flex items-center justify-center shadow-xs">
                      <ArrowDown className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                    <div className="w-0.5 h-3 bg-indigo-300" />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Market opportunities from recommendations */}
      {recommendations.length > 0 && (
        <div className="rounded-2xl border border-gray-200/90 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Market Matched Opportunities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendations.slice(0, 4).map(rec => (
              <div
                key={rec.id}
                onClick={() => onSelectRole(rec.role)}
                className="p-5 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-1.5">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">{rec.role}</h3>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-numeric">
                      {rec.match_score}%
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">{rec.salary_range}</p>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
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
