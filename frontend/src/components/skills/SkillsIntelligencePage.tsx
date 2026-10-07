import React from 'react';
import { Brain, ArrowRight } from 'lucide-react';
import { SkillLeaderboardItem } from '../../types';

interface SkillsIntelligencePageProps {
  skillsLeaderboard: SkillLeaderboardItem[];
  onNavigateSkillGap: () => void;
}

export const SkillsIntelligencePage: React.FC<SkillsIntelligencePageProps> = ({
  skillsLeaderboard,
  onNavigateSkillGap,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="pb-2 border-b border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Skills Intelligence
        </h1>
        <p className="text-base text-gray-600 mt-1.5">
          Which technical competencies are actually demanded by employers? Objective return-on-effort analysis across 15,800+ real tech job postings.
        </p>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white border border-gray-200/90 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Market Skills Leaderboard</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Ranked by verified industry demand frequency & compensation correlation</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 self-start sm:self-auto">
            Live Market Index
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-xs font-bold">
                <th className="py-4 px-6">Skill</th>
                <th className="py-4 px-5">Demand %</th>
                <th className="py-4 px-5">Salary Association</th>
                <th className="py-4 px-5">Experience Level</th>
                <th className="py-4 px-5">Roles Requiring</th>
                <th className="py-4 px-6 text-right">Market Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-800">
              {skillsLeaderboard.map(skill => (
                <tr key={skill.name} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6 font-bold text-gray-900 flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0" />
                    <span className="text-base">{skill.name}</span>
                  </td>
                  <td className="py-4 px-5 font-bold text-emerald-600 font-mono text-base">
                    {skill.demandPercentage}%
                  </td>
                  <td className="py-4 px-5 font-semibold text-gray-900 font-mono">
                    {skill.avgSalaryAssociation}
                  </td>
                  <td className="py-4 px-5 text-gray-600 font-medium">
                    {skill.experienceRequirement}
                  </td>
                  <td className="py-4 px-5 text-gray-600">
                    <div className="flex flex-wrap gap-1.5">
                      {skill.rolesRequiring.map((role, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        skill.learningPriority === 'High'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : skill.learningPriority === 'Medium'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {skill.learningPriority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">Ready to close your high-yield skill gaps?</h3>
          <p className="text-sm sm:text-base text-indigo-200">
            Compare your current skill stack against live job requisitions to build an individualized mastery roadmap.
          </p>
        </div>
        <button
          onClick={onNavigateSkillGap}
          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white text-indigo-900 font-bold text-sm shadow hover:bg-indigo-50 transition-all shrink-0"
        >
          View Skill Gap Analysis <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
