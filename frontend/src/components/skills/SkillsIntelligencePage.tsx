import React from 'react';
import { ArrowRight } from 'lucide-react';
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
    <div className="w-full space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Skills Intelligence
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-4xl">
          Which technical competencies are actually demanded by employers? Objective return-on-effort analysis across 15,800+ real tech job postings.
        </p>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white border border-gray-200/90 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <div className="px-6 sm:px-8 py-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Market Skills Leaderboard</h2>
            <p className="text-sm text-gray-500 mt-0.5">Ranked by verified industry demand frequency & compensation correlation</p>
          </div>
          <span className="text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 self-start sm:self-auto shadow-2xs">
            Live Market Index
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm sm:text-base">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-xs font-bold">
                <th className="py-4.5 px-6 sm:px-8">Skill</th>
                <th className="py-4.5 px-5">Demand %</th>
                <th className="py-4.5 px-5">Salary Association</th>
                <th className="py-4.5 px-5">Experience Level</th>
                <th className="py-4.5 px-5">Roles Requiring</th>
                <th className="py-4.5 px-6 sm:px-8 text-right">Market Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-800">
              {skillsLeaderboard.map(skill => (
                <tr key={skill.name} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4.5 px-6 sm:px-8 font-bold text-gray-900 flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0" />
                    <span className="text-base sm:text-lg">{skill.name}</span>
                  </td>
                  <td className="py-4.5 px-5 font-bold text-emerald-600 font-numeric text-base sm:text-lg">
                    {skill.demandPercentage}%
                  </td>
                  <td className="py-4.5 px-5 font-semibold text-gray-900 font-numeric text-sm sm:text-base">
                    {skill.avgSalaryAssociation}
                  </td>
                  <td className="py-4.5 px-5 text-gray-600 font-medium text-sm sm:text-base">
                    {skill.experienceRequirement}
                  </td>
                  <td className="py-4.5 px-5 text-gray-600">
                    <div className="flex flex-wrap gap-2">
                      {skill.rolesRequiring.map((role, idx) => (
                        <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4.5 px-6 sm:px-8 text-right">
                    <span
                      className={`inline-block px-3.5 py-1 rounded-full text-xs font-bold ${
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
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-2xl p-7 sm:p-9 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">Ready to close your high-yield skill gaps?</h3>
          <p className="text-sm sm:text-base text-indigo-200">
            Compare your current skill stack against live job requisitions to build an individualized mastery roadmap.
          </p>
        </div>
        <button
          onClick={onNavigateSkillGap}
          className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-white text-indigo-900 font-bold text-sm sm:text-base shadow hover:bg-indigo-50 active:bg-slate-100 transition-all shrink-0"
        >
          View Skill Gap Analysis <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
