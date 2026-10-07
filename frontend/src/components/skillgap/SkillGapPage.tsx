import React from 'react';
import { ArrowRight, CheckCircle2, Circle, ChevronDown } from 'lucide-react';
import { UserProfile } from '../../types';

interface SkillGapPageProps {
  user: UserProfile;
  targetRole: string;
  onTargetRoleChange: (newRole: string) => void;
  onCreateRoadmap: () => void;
}

const ROLE_REQUISITES: Record<string, { high: string[]; medium: string[]; low: string[] }> = {
  'Data Scientist': {
    high: ['Machine Learning', 'Python', 'Statistics'],
    medium: ['Big Data', 'SQL', 'Data Visualization'],
    low: ['Deep Learning', 'Cloud (AWS/GCP)', 'Feature Engineering'],
  },
  'Senior Data Analyst': {
    high: ['SQL', 'Statistics', 'Data Visualization'],
    medium: ['A/B Testing', 'Python', 'Power BI'],
    low: ['R', 'Looker', 'dbt'],
  },
  'Business Intelligence Analyst': {
    high: ['Power BI', 'SQL', 'Excel'],
    medium: ['Data Modeling', 'DAX', 'Tableau'],
    low: ['ETL', 'Azure Synapse', 'Looker Studio'],
  },
  'Machine Learning Engineer': {
    high: ['Machine Learning', 'Deep Learning', 'Python'],
    medium: ['Docker', 'Big Data', 'FastAPI'],
    low: ['Kubernetes', 'MLflow', 'Terraform'],
  },
};

const PRIORITY_CONTEXT: Record<string, { why: string; action: string }> = {
  'Machine Learning': {
    why: 'Required in 74% of Data Scientist postings — the single highest-impact gap to close.',
    action: 'Complete ML Specialization by Andrew Ng on Coursera (4-6 weeks).',
  },
  'Statistics': {
    why: 'Core for A/B testing, hypothesis testing and quantifying model confidence.',
    action: 'Finish Stanford Statistics course + practice with SciPy on real datasets.',
  },
  'Python': {
    why: 'The dominant language across 78% of all analytics/data postings.',
    action: 'Build 3 Kaggle notebook projects demonstrating pandas + scikit-learn workflows.',
  },
  'Big Data': {
    why: 'Needed for datasets exceeding memory limits — key for senior positions.',
    action: 'Complete BigQuery fundamentals + practice partitioned SQL queries.',
  },
  'SQL': {
    why: 'Foundation skill for all data roles — gaps here are an immediate red flag.',
    action: 'Practice advanced window functions and CTEs on Mode Analytics.',
  },
  'Data Visualization': {
    why: 'Required for stakeholder communication — 64% of roles demand it explicitly.',
    action: 'Build 2 interactive Tableau / Power BI dashboards with real datasets.',
  },
};

export const SkillGapPage: React.FC<SkillGapPageProps> = ({
  user,
  targetRole,
  onTargetRoleChange,
  onCreateRoadmap,
}) => {
  const userSkillNames = user.skills.map(s => s.name);
  const requisites = ROLE_REQUISITES[targetRole] || ROLE_REQUISITES['Data Scientist'];
  const allSkills = [...requisites.high, ...requisites.medium, ...requisites.low];

  const has = (skill: string) =>
    userSkillNames.some(
      u => u.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(u.toLowerCase())
    );

  const hasSkills = allSkills.filter(has);
  const gapSkills = allSkills.filter(s => !has(s));
  const readinessPct = Math.round((hasSkills.length / allSkills.length) * 100);

  return (
    <div className="w-full space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Skill Gap Analysis</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-4xl">
            Exact breakdown of what you have vs. what <strong className="text-gray-900 font-bold">{targetRole}</strong> demands in market requisitions.
          </p>
        </div>
        <div className="relative shrink-0">
          <select
            value={targetRole}
            onChange={e => onTargetRoleChange(e.target.value)}
            className="appearance-none pl-5 pr-11 py-3 bg-white border border-gray-300 rounded-xl text-sm sm:text-base font-bold text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-sm cursor-pointer"
          >
            <option value="Data Scientist">Data Scientist</option>
            <option value="Senior Data Analyst">Senior Data Analyst</option>
            <option value="Business Intelligence Analyst">BI Analyst</option>
            <option value="Machine Learning Engineer">ML Engineer</option>
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Summary score */}
      <div className="rounded-2xl border border-gray-200/90 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-6">
          <div className="flex-1">
            <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-1.5">Skill Coverage Benchmark</p>
            <div className="flex items-end gap-3">
              <span className="text-4xl sm:text-5xl font-black text-gray-900 font-numeric">{readinessPct}%</span>
              <span className="text-sm sm:text-base text-gray-500 pb-1 font-medium">of {targetRole} requirements met</span>
            </div>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <p className="text-3xl font-black text-emerald-600 font-numeric">{hasSkills.length}</p>
              <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1">Skills matched</p>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="text-center">
              <p className="text-3xl font-black text-indigo-600 font-numeric">{gapSkills.length}</p>
              <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1">Gaps to close</p>
            </div>
          </div>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 transition-all duration-1000"
            style={{ width: `${readinessPct}%` }}
          />
        </div>
      </div>

      {/* You Have / You Need */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* You Have */}
        <div className="rounded-2xl border border-emerald-200 bg-white p-6 sm:p-7 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-gray-100">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <h3 className="text-base sm:text-lg font-bold text-gray-900">Skills You Have ({hasSkills.length})</h3>
          </div>
          <div className="space-y-3">
            {hasSkills.map(skill => (
              <div key={skill} className="flex items-center gap-3 text-sm sm:text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-semibold text-gray-900">{skill}</span>
              </div>
            ))}
            {hasSkills.length === 0 && (
              <p className="text-sm text-gray-400 italic">
                Add your skills in your profile to see matches here.
              </p>
            )}
          </div>
        </div>

        {/* You Need */}
        <div className="rounded-2xl border border-indigo-200 bg-white p-6 sm:p-7 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-gray-100">
            <div className="w-3 h-3 rounded-full bg-indigo-500" />
            <h3 className="text-base sm:text-lg font-bold text-gray-900">Skills to Acquire ({gapSkills.length})</h3>
          </div>
          <div className="space-y-3">
            {[
              ...requisites.high.filter(s => !has(s)),
              ...requisites.medium.filter(s => !has(s)),
              ...requisites.low.filter(s => !has(s)),
            ].map((skill) => {
              const isHigh = requisites.high.includes(skill);
              const isMed = requisites.medium.includes(skill);
              return (
                <div key={skill} className="flex items-center gap-3 text-sm sm:text-base">
                  <Circle className={`w-4 h-4 shrink-0 ${isHigh ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span className={`font-semibold ${isHigh ? 'text-gray-900' : 'text-gray-600'}`}>{skill}</span>
                  <span className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-lg ${
                    isHigh
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : isMed
                      ? 'bg-gray-100 text-gray-600'
                      : 'bg-gray-50 text-gray-400'
                  }`}>
                    {isHigh ? 'High' : isMed ? 'Medium' : 'Low'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Prioritized gap cards */}
      {requisites.high
        .filter(s => !has(s))
        .slice(0, 3)
        .map(skill => {
          const ctx = PRIORITY_CONTEXT[skill];
          return (
            <div key={skill} className="rounded-2xl border border-gray-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg mb-2">
                    High Priority Gap
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900">{skill}</h3>
                </div>
              </div>
              {ctx && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm sm:text-base">
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <p className="font-bold text-gray-800 mb-1.5">Why it matters</p>
                    <p className="text-gray-600 leading-relaxed">{ctx.why}</p>
                  </div>
                  <div className="bg-indigo-50/60 rounded-xl p-5 border border-indigo-100">
                    <p className="font-bold text-indigo-700 mb-1.5">Recommended Action</p>
                    <p className="text-indigo-900/90 leading-relaxed font-medium">{ctx.action}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}

      {/* CTA */}
      <div className="rounded-2xl border border-gray-200/90 bg-white p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Ready to bridge these gaps?</h2>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Get a structured week-by-week learning plan to close your top skill gaps.
          </p>
        </div>
        <button
          onClick={onCreateRoadmap}
          className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm sm:text-base font-bold flex items-center gap-2.5 shadow-md hover:shadow-lg transition-all shrink-0"
        >
          Build My Learning Roadmap <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};
