import React, { useMemo, useState } from 'react';
import {
  ExternalLink, CheckCircle, MapPin,
  Building2, Target, Zap, ChevronDown, ChevronUp, AlertTriangle
} from 'lucide-react';
import { UserProfile } from '../../types';
import { AssessmentResult } from '../../lib/assessment/scoring';
import { computeMatches, JobMatch } from '../../lib/jobs/matching';

interface CareerOpportunitiesProps {
  user: UserProfile;
  assessmentResult: AssessmentResult | null;
  onNavigateTab: (tab: string) => void;
  onStartAssessment: () => void;
}

function MatchBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs sm:text-sm mb-1.5 font-medium">
        <span className="text-gray-500">{label}</span>
        <span className={`font-bold font-numeric ${color}`}>{value}%</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${
          value >= 80 ? 'bg-emerald-500' : value >= 60 ? 'bg-amber-400' : 'bg-red-400'
        }`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function JobCard({ match, onNavigateTab, onStartAssessment }: {
  match: JobMatch;
  onNavigateTab: (tab: string) => void;
  onStartAssessment: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const matchColor = match.careerIQMatch >= 80 ? 'text-emerald-600' : match.careerIQMatch >= 65 ? 'text-amber-600' : 'text-red-500';
  const matchBg = match.careerIQMatch >= 80 ? 'bg-emerald-50 border-emerald-200' : match.careerIQMatch >= 65 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200';

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div className="p-6 sm:p-7 pb-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl border border-gray-200 bg-white flex items-center justify-center p-2 shadow-xs shrink-0">
              <img
                src={match.company.logo}
                alt={match.company.name}
                className="w-full h-full object-contain"
                onError={e => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">{match.company.name}</h3>
              <p className="text-sm sm:text-base text-gray-600 font-medium">{match.role}</p>
              <div className="flex items-center gap-2 mt-1">
                <Building2 className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs text-gray-500">{match.company.industry}</span>
                {match.locationMatch && (
                  <>
                    <span className="text-gray-300">·</span>
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-500">Remote Available</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Match badge */}
          <div className={`px-4 py-2 rounded-2xl border text-center shrink-0 ${matchBg}`}>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-wider">CareerIQ Match</p>
            <p className={`text-2xl sm:text-3xl font-black font-numeric leading-tight ${matchColor}`}>{match.careerIQMatch}%</p>
          </div>
        </div>

        {/* Skill chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {match.matchedSkills.map(s => (
            <span key={s} className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-lg">
              <CheckCircle className="w-3.5 h-3.5" /> {s}
            </span>
          ))}
          {match.missingSkills.slice(0, 2).map(s => (
            <span key={s} className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold rounded-lg">
              <AlertTriangle className="w-3.5 h-3.5" /> {s}
            </span>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex gap-3">
          <a
            href={match.company.careerPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base font-bold rounded-xl transition-all shadow-sm"
          >
            Explore Careers at {match.company.name}
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={() => setExpanded(prev => !prev)}
            className="px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-gray-100 px-6 sm:px-7 py-5 space-y-6 animate-fade-in-up bg-slate-50/50">
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Match Breakdown</h4>
            <div className="space-y-3">
              <MatchBar label="Skill Overlap" value={match.skillMatch} color="text-emerald-600" />
              <MatchBar label="Assessment Alignment" value={match.assessmentMatch} color="text-indigo-600" />
              <MatchBar label="Experience Fit" value={match.experienceMatch} color="text-indigo-600" />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onNavigateTab('skill-gap')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-indigo-300 text-indigo-700 bg-white hover:bg-indigo-50 text-xs sm:text-sm font-bold rounded-xl transition-colors"
            >
              <Target className="w-4 h-4" /> View Skill Gap
            </button>
            <button
              onClick={onStartAssessment}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-emerald-300 text-emerald-700 bg-white hover:bg-emerald-50 text-xs sm:text-sm font-bold rounded-xl transition-colors"
            >
              <Zap className="w-4 h-4" /> Take Assessment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export const CareerOpportunities: React.FC<CareerOpportunitiesProps> = ({
  user, assessmentResult, onNavigateTab, onStartAssessment
}) => {
  const userSkillNames = user.skills.map(s => s.name);
  const matches = useMemo(
    () => computeMatches(userSkillNames, user.targetRole, user.yearsOfExperience, assessmentResult),
    [user, assessmentResult]
  );

  return (
    <div className="w-full space-y-8 animate-fade-in-up">
      {/* Page Header */}
      <div className="pb-4 border-b border-gray-200">
        <p className="text-xs sm:text-sm font-bold text-indigo-600 uppercase tracking-wider mb-1.5">Career Opportunities</p>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Your Matched Opportunities</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-4xl">
          Ranked by CareerIQ Match — derived from empirical hiring signals, required skill profiles, and target roles.
        </p>
      </div>

      {/* Assessment nudge */}
      {!assessmentResult && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div>
            <p className="text-base sm:text-lg font-bold text-amber-900">Improve your match accuracy</p>
            <p className="text-sm text-amber-700 mt-1">Take the 30-question MCQ assessment to get personalized skill-based match scores.</p>
          </div>
          <button
            onClick={onStartAssessment}
            className="shrink-0 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white text-sm sm:text-base font-bold rounded-xl shadow transition-colors"
          >
            Start Assessment
          </button>
        </div>
      )}

      {/* Flow bar */}
      <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-1">
        {['Assess', 'Understand', 'Match', 'Prepare', 'Apply'].map((step, i, arr) => (
          <React.Fragment key={step}>
            <span className={`shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-bold ${
              step === 'Match' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-gray-100 text-gray-600'
            }`}>{step}</span>
            {i < arr.length - 1 && <div className="w-8 h-px bg-gray-300 shrink-0" />}
          </React.Fragment>
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {[
          { label: 'Opportunities Found', value: matches.length, color: 'text-indigo-600' },
          { label: 'Top Match', value: `${matches[0]?.careerIQMatch ?? 0}%`, color: 'text-emerald-600' },
          { label: 'Skills Matched', value: matches[0]?.matchedSkills.length ?? 0, color: 'text-indigo-600' },
          { label: 'Skill Gaps', value: matches[0]?.missingSkills.length ?? 0, color: 'text-amber-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider block">{stat.label}</span>
            <span className={`text-3xl sm:text-4xl font-black mt-2.5 block tracking-tight font-numeric ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Job cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {matches.map(m => (
          <JobCard
            key={m.company.id}
            match={m}
            onNavigateTab={onNavigateTab}
            onStartAssessment={onStartAssessment}
          />
        ))}
      </div>

      {matches.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-base font-semibold">No matching companies found for your current target role.</p>
          <p className="text-sm mt-1">Try updating your target role in your profile.</p>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs sm:text-sm text-gray-400 text-center pb-4">
        CareerIQ connects you to official company career pages. CareerIQ does not submit applications on your behalf.
        All links open the official destination.
      </p>
    </div>
  );
};
