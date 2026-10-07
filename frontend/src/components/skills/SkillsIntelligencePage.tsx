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
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Skills Intelligence
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Which skills does the market actually demand? Objective return-on-effort analysis across 17,400 job postings.
        </p>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">Market Skills Leaderboard</h2>
          <span className="text-xs text-gray-500">Ranked by overall demand & salary correlation</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-5 font-semibold">Skill</th>
                <th className="py-3 px-4 font-semibold">Demand %</th>
                <th className="py-3 px-4 font-semibold">Salary Association</th>
                <th className="py-3 px-4 font-semibold">Experience Level</th>
                <th className="py-3 px-4 font-semibold">Roles Requiring</th>
                <th className="py-3 px-5 font-semibold text-right">Market Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-800">
              {skillsLeaderboard.map(skill => (
                <tr key={skill.name} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    {skill.name}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-600 font-mono">
                    {skill.demandPercentage}%
                  </td>
                  <td className="py-3.5 px-4 font-medium text-gray-900 font-mono">
                    {skill.avgSalaryAssociation}
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">
                    {skill.experienceRequirement}
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">
                    <span className="truncate block max-w-xs">{skill.rolesRequiring.slice(0, 3).join(', ')}</span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        skill.learningPriority === 'High'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {skill.learningPriority} Priority
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Callout */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Want to see which of these skills you are missing?</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Compare your profile directly against target role benchmarks to pinpoint your exact skill gaps.
          </p>
        </div>

        <button
          onClick={onNavigateSkillGap}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors shrink-0"
        >
          View Skill Gap Analysis <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
