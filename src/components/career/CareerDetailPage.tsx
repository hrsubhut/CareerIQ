import React from 'react';
import { ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';
import { CareerRecommendation, UserProfile } from '../../types';

interface CareerDetailPageProps {
  career: CareerRecommendation;
  user: UserProfile;
  onBack: () => void;
  onNavigateSkillGap: (targetRole: string) => void;
}

export const CareerDetailPage: React.FC<CareerDetailPageProps> = ({
  career,
  user,
  onBack,
  onNavigateSkillGap,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in-up">
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>

      {/* Main Header Card */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-gray-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
              Role Intelligence Breakdown
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">{career.role}</h1>
            <p className="text-sm text-gray-500 mt-1.5 font-medium">
              Market Benchmark: {career.salary_range} • {career.required_experience} Required
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-4xl sm:text-5xl font-black text-emerald-600 font-mono">{career.match_score}%</span>
            <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Compatibility Match</span>
          </div>
        </div>

        {/* Snapshot Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 text-xs">
          <div>
            <span className="text-gray-500 block">Market Demand</span>
            <span className="font-bold text-gray-900 text-sm mt-0.5 block">{career.demand}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Average Salary</span>
            <span className="font-bold text-gray-900 text-sm mt-0.5 block">${career.avg_salary.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Transition Effort</span>
            <span className="font-bold text-indigo-600 text-sm mt-0.5 block">{career.transition_effort}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Analyzed Postings</span>
            <span className="font-bold text-gray-900 text-sm mt-0.5 block">{career.analyzed_postings.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* What did the data tell me? */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900">What did the data tell me about this role?</h2>
        <div className="space-y-2.5">
          {career.reasons.map((reason, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{reason}</span>
            </div>
          ))}
        </div>

        {/* Required skills breakdown */}
        <div className="pt-4 border-t border-gray-100">
          <span className="text-xs font-semibold text-gray-800 block mb-2">Required Skills:</span>
          <div className="flex flex-wrap gap-2">
            {career.required_skills.map(s => (
              <span
                key={s.name}
                className="px-2.5 py-1 rounded bg-gray-50 border border-gray-200 text-xs text-gray-800 font-medium"
              >
                {s.name} <span className="text-indigo-600 text-[11px]">({s.importance} Priority)</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* What should I do next? */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900">What should I do next?</h2>
          <p className="text-xs text-gray-600 mt-1">
            Analyze the exact skill deficits between your profile and {career.role}, and generate your custom learning plan.
          </p>
        </div>

        <button
          onClick={() => onNavigateSkillGap(career.role)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors shrink-0"
        >
          View Skill Gap for {career.role} <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
