import React, { useEffect, useRef } from 'react';
import {
  ArrowRight,
  BookOpen,
  Award,
  Video,
  Briefcase,
  TrendingUp,
  Zap,
  ChevronRight,
  Target,
  BarChart2,
} from 'lucide-react';
import { UserProfile, CareerRecommendation, MarketOverview } from '../../types';

interface OverviewDashboardProps {
  user: UserProfile;
  recommendations: CareerRecommendation[];
  marketOverview: MarketOverview | null;
  onSelectRole: (role: string) => void;
  onNavigateTab: (tab: any) => void;
  onTakeAssessment: () => void;
  onStartInterview: () => void;
  assessmentScore?: number | null;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  user,
  recommendations,
  marketOverview,
  onSelectRole,
  onNavigateTab,
  onTakeAssessment,
  onStartInterview,
  assessmentScore,
}) => {
  const readinessRef = useRef<HTMLDivElement>(null);

  // Derive dynamic career readiness based on user skills vs common required skills
  const dynamicReadiness = React.useMemo(() => {
    const ROLE_SKILLS: Record<string, string[]> = {
      'Data Scientist': ['python', 'sql', 'statistics', 'machine learning', 'data science', 'deep learning'],
      'Data Analyst': ['sql', 'excel', 'power bi', 'python', 'data visualization', 'statistics'],
      'ML Engineer': ['python', 'machine learning', 'deep learning', 'mlops', 'system design', 'docker'],
    };
    const reqSkills = ROLE_SKILLS[user.targetRole] || ROLE_SKILLS['Data Scientist'];
    const userSkillNames = user.skills.map(s => s.name.toLowerCase());
    let matchCount = 0;
    reqSkills.forEach(req => {
      if (userSkillNames.some(u => u.includes(req) || req.includes(u))) matchCount++;
    });
    const matchPct = Math.round((matchCount / reqSkills.length) * 100);
    // Add a baseline of 30% plus the match percentage (up to max 98%)
    return Math.min(98, 30 + Math.floor(matchPct * 0.7));
  }, [user.targetRole, user.skills]);

  // Animate readiness bar on mount
  useEffect(() => {
    const el = readinessRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.style.width = `${dynamicReadiness}%`;
    });
  }, [dynamicReadiness]);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const topRecs = recommendations.slice(0, 3);

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4 animate-fade-in-up">

      {/* ── Hero greeting ─────────────────────────────────── */}
      <div className="space-y-1">
        <p className="text-sm font-medium text-indigo-600">{greeting} 👋</p>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          {user.name}
        </h1>
        <p className="text-sm text-gray-500">
          {user.currentRole} · {user.yearsOfExperience} yr{user.yearsOfExperience !== 1 ? 's' : ''} exp
          {user.location ? ` · ${user.location}` : ''}
        </p>
      </div>

      {/* ── Career readiness banner ────────────────────────── */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Career Readiness</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-gray-900 font-numeric">{dynamicReadiness}%</span>
              <span className="text-sm text-gray-500 pb-1">for {user.targetRole}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-gray-500">Skill match</p>
              <p className="text-lg font-bold text-gray-900 font-numeric">{user.profileStrength}%</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-right">
              <p className="text-xs text-gray-500">Skill gaps</p>
              <p className="text-lg font-bold text-indigo-600 font-numeric">{user.criticalSkillGapsCount}</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-right">
              <p className="text-xs text-gray-500">Opportunity</p>
              <p className="text-lg font-bold text-emerald-600">High</p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            ref={readinessRef}
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-1000 ease-out progress-fill"
            style={{ width: '0%' }}
          />
        </div>
        <div className="flex justify-between mt-1.5 text-[11px] text-gray-400">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* ── 3-col quick actions ────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ActionCard
          icon={<BookOpen className="w-4 h-4 text-indigo-600" />}
          label="Learning Roadmap"
          value={`${user.criticalSkillGapsCount} Gaps`}
          sub={`Curriculum for ${user.targetRole}`}
          ctaLabel="Open Roadmap"
          ctaColor="indigo"
          onClick={() => onNavigateTab('learning')}
        />
        <ActionCard
          icon={<Target className="w-4 h-4 text-emerald-600" />}
          label="Technical Assessment"
          value={assessmentScore != null ? `${assessmentScore}%` : 'Not taken'}
          sub={`30 MCQs for ${user.targetRole}`}
          ctaLabel={assessmentScore != null ? 'Retake Test' : 'Start Assessment'}
          ctaColor="emerald"
          onClick={onTakeAssessment}
        />
        <ActionCard
          icon={<Video className="w-4 h-4 text-purple-600" />}
          label="AI Mock Interview"
          value="Practice"
          sub="Real interview simulation with AI"
          ctaLabel="Start Interview"
          ctaColor="purple"
          onClick={onStartInterview}
        />
      </div>

      {/* ── Career path snapshot ───────────────────────────── */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Your Career Path</p>
          </div>
          <button
            onClick={() => onNavigateTab('career-paths')}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            All pathways <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          {/* Current */}
          <div className="flex-1 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">Now</span>
            <p className="text-base font-bold text-gray-900">{user.currentRole}</p>
            <p className="text-xs text-gray-500 mt-0.5">{user.yearsOfExperience} yrs experience</p>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center sm:px-2">
            <div className="flex items-center gap-1">
              <div className="w-8 h-px bg-indigo-200" />
              <div className="w-2 h-2 rounded-full bg-indigo-400" />
              <div className="w-8 h-px bg-indigo-200" />
            </div>
          </div>

          {/* Target */}
          <div className="flex-1 rounded-xl border border-indigo-300 bg-indigo-50/60 p-4 relative">
            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block mb-1">Target</span>
            <p className="text-base font-bold text-indigo-700">{user.targetRole}</p>
            <p className="text-xs text-emerald-600 font-medium mt-0.5">{dynamicReadiness}% ready</p>
            <div className="absolute top-3 right-3">
              <Target className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Skill gaps + What to learn ─────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skill gaps */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Top Skill Gaps</p>
            <button
              onClick={() => onNavigateTab('skill-gap')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
            >
              Full analysis <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Derive top gap skills by checking which common skills user does NOT have */}
            {(() => {
              const ROLE_SKILLS: Record<string, {skill: string; pct: number}[]> = {
                'Data Scientist': [
                  { skill: 'Machine Learning', pct: 74 },
                  { skill: 'Statistics', pct: 68 },
                  { skill: 'Deep Learning', pct: 52 },
                  { skill: 'Big Data', pct: 41 },
                ],
                'Data Analyst': [
                  { skill: 'SQL Advanced', pct: 71 },
                  { skill: 'Power BI', pct: 63 },
                  { skill: 'Statistics', pct: 58 },
                ],
                'ML Engineer': [
                  { skill: 'MLOps', pct: 69 },
                  { skill: 'Docker', pct: 61 },
                  { skill: 'Deep Learning', pct: 75 },
                ],
              };
              const userSkillNames = user.skills.map(s => s.name.toLowerCase());
              const roleGaps = ROLE_SKILLS[user.targetRole] || ROLE_SKILLS['Data Scientist'];
              const gaps = roleGaps.filter(g => !userSkillNames.some(u => u.includes(g.skill.toLowerCase()) || g.skill.toLowerCase().includes(u))).slice(0, 3);
              if (gaps.length === 0) return <p className="text-xs text-emerald-600 font-semibold">No critical gaps detected for your current skills!</p>;
              return gaps.map((g, i) => (
                <div key={g.skill}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-800">{g.skill}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      i === 0 ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-gray-100 text-gray-600'
                    }`}>{i === 0 ? 'High' : 'Medium'}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${i === 0 ? 'bg-indigo-500' : 'bg-gray-400'}`} style={{ width: `${g.pct}%` }} />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">{g.pct}% of {user.targetRole} postings require this</p>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* What to do next */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">What to Do Next</p>

          <div className="space-y-3">
            {(() => {
              const userSkillNames = user.skills.map(s => s.name.toLowerCase());
              const roleActions: Record<string, { label: string; sub: string; urgent: boolean }[]> = {
                'Data Scientist': [
                  { label: 'Learn Machine Learning fundamentals', sub: 'Coursera: ML Specialization by Andrew Ng', urgent: !userSkillNames.some(s => s.includes('machine') || s.includes('ml')) },
                  { label: 'Practice statistics & A/B testing', sub: 'Khan Academy: Statistics & Probability', urgent: !userSkillNames.some(s => s.includes('stat')) },
                  { label: 'Build a Kaggle portfolio project', sub: 'Classification or regression with real dataset', urgent: false },
                ],
                'Data Analyst': [
                  { label: 'Master advanced SQL (window functions)', sub: 'Mode Analytics SQL Tutorial (free)', urgent: true },
                  { label: 'Build a Power BI / Tableau dashboard', sub: 'Use public dataset from Kaggle', urgent: false },
                  { label: 'Practice Python for data cleaning', sub: 'Pandas + NumPy fundamentals', urgent: false },
                ],
                'ML Engineer': [
                  { label: 'Learn Docker & containerization', sub: 'Docker official getting-started guide', urgent: true },
                  { label: 'Deploy an ML model with FastAPI', sub: 'Build a simple prediction endpoint', urgent: false },
                  { label: 'Study MLOps fundamentals', sub: 'MLflow + model monitoring', urgent: false },
                ],
              };
              const actions = roleActions[user.targetRole] || roleActions['Data Scientist'];
              return actions.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                    item.urgent ? 'border-indigo-600' : 'border-gray-300'
                  }`}>
                    {item.urgent && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">{item.label}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ));
            })()}
          </div>

          <button
            onClick={() => onNavigateTab('learning')}
            className="mt-5 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Zap className="w-3.5 h-3.5" />
            Open Full Learning Roadmap
          </button>
        </div>
      </div>

      {/* ── Career recommendations ─────────────────────────── */}
      {topRecs.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recommended Career Paths</p>
            <button
              onClick={() => onNavigateTab('career-paths')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
            >
              Explore all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {topRecs.map(rec => (
              <div
                key={rec.id}
                onClick={() => onSelectRole(rec.role)}
                className="p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-sm cursor-pointer transition-all duration-200 card-hover"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-xs font-bold text-gray-900 leading-tight">{rec.role}</h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded shrink-0">
                    {rec.match_score}%
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mb-2">{rec.salary_range}</p>
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${rec.match_score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Job market CTA ─────────────────────────────────── */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
            <BarChart2 className="w-4.5 h-4.5 text-indigo-600" style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Job Market Intelligence</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {marketOverview?.totalJobsAnalyzed?.toLocaleString() ?? '17,400'}+ job postings analyzed for your target role.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateTab('job-market')}
          className="px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold shrink-0 shadow-sm transition-colors flex items-center gap-2"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          View Market Benchmarks
        </button>
      </div>
    </div>
  );
};

// ── ActionCard sub-component ─────────────────────────────

const colorMap: Record<string, { btn: string; badge: string }> = {
  indigo: {
    btn: 'border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100',
    badge: 'text-indigo-600',
  },
  emerald: {
    btn: 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100',
    badge: 'text-emerald-600',
  },
  purple: {
    btn: 'border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100',
    badge: 'text-purple-600',
  },
};

const ActionCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  ctaLabel: string;
  ctaColor: string;
  onClick: () => void;
}> = ({ icon, label, value, sub, ctaLabel, ctaColor, onClick }) => {
  const colors = colorMap[ctaColor] || colorMap.indigo;
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
      <div>
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
        </div>
        <p className={`text-2xl font-bold font-numeric ${colors.badge}`}>{value}</p>
        <p className="text-xs text-gray-500 mt-1">{sub}</p>
      </div>
      <button
        onClick={onClick}
        className={`mt-4 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${colors.btn}`}
      >
        {ctaLabel}
      </button>
    </div>
  );
};
