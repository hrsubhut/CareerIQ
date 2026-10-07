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
    <div className="w-full space-y-8 animate-fade-in-up">
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> Back to Pathways
        </button>
      </div>

      {/* Main Header Card */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-gray-100">
          <div>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-indigo-600 block mb-1">
              Role Intelligence Breakdown
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">{career.role}</h1>
            <p className="text-sm sm:text-base text-gray-500 mt-2 font-medium">
              Market Benchmark: {career.salary_range} • {career.required_experience} Required
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-4xl sm:text-5xl font-black text-emerald-600 font-numeric">{career.match_score}%</span>
            <span className="block text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mt-1">Compatibility Match</span>
          </div>
        </div>

        {/* Snapshot Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6">
          <div>
            <span className="text-xs sm:text-sm text-gray-500 font-medium block">Market Demand</span>
            <span className="font-black text-gray-900 text-lg sm:text-xl mt-1 block">{career.demand}</span>
          </div>
          <div>
            <span className="text-xs sm:text-sm text-gray-500 font-medium block">Average Salary</span>
            <span className="font-black text-gray-900 text-lg sm:text-xl mt-1 block font-numeric">${career.avg_salary.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-xs sm:text-sm text-gray-500 font-medium block">Transition Effort</span>
            <span className="font-black text-indigo-600 text-lg sm:text-xl mt-1 block">{career.transition_effort}</span>
          </div>
          <div>
            <span className="text-xs sm:text-sm text-gray-500 font-medium block">Analyzed Postings</span>
            <span className="font-black text-gray-900 text-lg sm:text-xl mt-1 block font-numeric">{career.analyzed_postings.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* What did the data tell me? */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-gray-900">What did the data tell me about this role?</h2>
        <div className="space-y-3.5">
          {career.reasons.map((reason, idx) => (
            <div key={idx} className="flex items-start gap-3 text-sm sm:text-base text-gray-700 leading-relaxed">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{reason}</span>
            </div>
          ))}
        </div>

        {/* Required skills breakdown */}
        <div className="pt-6 border-t border-gray-100">
          <span className="text-sm font-bold text-gray-900 block mb-3">Required Technical Competencies:</span>
          <div className="flex flex-wrap gap-2.5">
            {career.required_skills.map(s => (
              <span
                key={s.name}
                className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 font-semibold"
              >
                {s.name} <span className="text-indigo-600 font-bold ml-1">({s.importance} Priority)</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* What should I do next? */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <h2 className="text-xl font-bold text-gray-900">What should I do next?</h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1.5 leading-relaxed">
            Analyze the exact skill deficits between your profile and {career.role}, and generate your custom learning plan.
          </p>
        </div>

        <button
          onClick={() => onNavigateSkillGap(career.role)}
          className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm sm:text-base font-bold flex items-center gap-2.5 shadow-md hover:shadow-lg transition-all shrink-0"
        >
          View Skill Gap for {career.role} <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};
