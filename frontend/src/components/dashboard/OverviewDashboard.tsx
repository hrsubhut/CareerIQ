import React, { useEffect, useRef } from 'react';
import {
  ArrowRight,
  BookOpen,
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
    <div className="w-full space-y-8 animate-fade-in-up">

      {/* ── Hero greeting ─────────────────────────────────── */}
      <div className="space-y-2 pb-4 border-b border-gray-200">
        <p className="text-sm sm:text-base font-bold text-indigo-600">{greeting} 👋</p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
          {user.name}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 font-medium">
          {user.currentRole} · {user.yearsOfExperience} yr{user.yearsOfExperience !== 1 ? 's' : ''} exp
          {user.location ? ` · ${user.location}` : ''}
        </p>
      </div>

      {/* ── Career readiness banner ────────────────────────── */}
      <div className="rounded-3xl border border-gray-200/90 bg-white p-6 sm:p-9 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-7">
          <div>
            <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-1.5">Career Readiness Index</p>
            <div className="flex items-baseline gap-3.5">
              <span className="text-5xl sm:text-6xl font-black text-gray-900 font-numeric tracking-tight">{dynamicReadiness}%</span>
              <span className="text-base sm:text-lg text-gray-500 font-medium">for {user.targetRole}</span>
            </div>
          </div>
          <div className="flex items-center gap-6 sm:gap-10">
            <div className="text-left sm:text-right">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Skill match</p>
              <p className="text-2xl sm:text-3xl font-black text-gray-900 font-numeric mt-0.5">{user.profileStrength}%</p>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div className="text-left sm:text-right">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Skill gaps</p>
              <p className="text-2xl sm:text-3xl font-black text-indigo-600 font-numeric mt-0.5">{user.criticalSkillGapsCount}</p>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div className="text-left sm:text-right">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Opportunity</p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-0.5">High</p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            ref={readinessRef}
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 transition-all duration-1000 ease-out progress-fill"
            style={{ width: '0%' }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400 font-semibold font-numeric">
          <span>0%</span>
          <span>50%</span>
          <span>100% Benchmark</span>
        </div>
      </div>

      {/* ── Quick actions 4-across responsive grid ────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ActionCard
          icon={<BookOpen className="w-6 h-6 text-indigo-600" />}
          label="Learning Roadmap"
          value={`${user.criticalSkillGapsCount} Gaps`}
          sub={`Curriculum for ${user.targetRole}`}
          ctaLabel="Open Roadmap"
          ctaColor="indigo"
          onClick={() => onNavigateTab('learning')}
        />
        <ActionCard
          icon={<Target className="w-6 h-6 text-emerald-600" />}
          label="Technical Assessment"
          value={assessmentScore != null ? `${assessmentScore}%` : 'Not taken'}
          sub={`30 MCQs for ${user.targetRole}`}
          ctaLabel={assessmentScore != null ? 'Retake Test' : 'Start Assessment'}
          ctaColor="emerald"
          onClick={onTakeAssessment}
        />
        <ActionCard
          icon={<Video className="w-6 h-6 text-purple-600" />}
          label="AI Mock Interview"
          value="Practice"
          sub="Realistic interview simulation"
          ctaLabel="Start Interview"
          ctaColor="purple"
          onClick={onStartInterview}
        />
        <ActionCard
          icon={<Briefcase className="w-6 h-6 text-sky-600" />}
          label="Career Opportunities"
          value="Matched"
          sub={`Companies hiring for ${user.targetRole}`}
          ctaLabel="View Opportunities"
          ctaColor="sky"
          onClick={() => onNavigateTab('jobs')}
        />
      </div>

      {/* ── Career path snapshot ───────────────────────────── */}
      <div className="rounded-3xl border border-gray-200/90 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider">Your Career Pathway</p>
          </div>
          <button
            onClick={() => onNavigateTab('career-paths')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            All pathways <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-4">
          {/* Current */}
          <div className="flex-1 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 sm:p-6">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1.5">Now</span>
            <p className="text-lg sm:text-xl font-black text-gray-900">{user.currentRole}</p>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">{user.yearsOfExperience} yrs experience</p>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center sm:px-2">
            <div className="flex items-center gap-1.5">
              <div className="w-8 sm:w-12 h-0.5 bg-indigo-300" />
              <div className="w-3 h-3 rounded-full bg-indigo-500 ring-2 ring-indigo-200" />
              <div className="w-8 sm:w-12 h-0.5 bg-indigo-300" />
            </div>
          </div>

          {/* Target */}
          <div className="flex-1 rounded-2xl border border-indigo-300 bg-indigo-50/60 p-5 sm:p-6 relative">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block mb-1.5">Target</span>
            <p className="text-lg sm:text-xl font-black text-indigo-800">{user.targetRole}</p>
            <p className="text-xs sm:text-sm text-emerald-600 font-bold mt-1">{dynamicReadiness}% ready</p>
            <div className="absolute top-5 right-5">
              <Target className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Skill gaps + What to learn ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skill gaps */}
        <div className="rounded-3xl border border-gray-200/90 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider">Top Skill Gaps</p>
            <button
              onClick={() => onNavigateTab('skill-gap')}
              className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 transition-colors"
            >
              Full analysis <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Derive top gap skills */}
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
              if (gaps.length === 0) return <p className="text-sm text-emerald-600 font-bold">No critical gaps detected for your current skills!</p>;
              return gaps.map((g, i) => (
                <div key={g.skill} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base font-bold text-gray-800">{g.skill}</span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg ${
                      i === 0 ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-gray-100 text-gray-600'
                    }`}>{i === 0 ? 'High Priority' : 'Standard'}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${i === 0 ? 'bg-indigo-500' : 'bg-gray-400'}`} style={{ width: `${g.pct}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 font-medium">{g.pct}% of {user.targetRole} postings require this</p>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* What to do next */}
        <div className="rounded-3xl border border-gray-200/90 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-5">Recommended Next Steps</p>

            <div className="space-y-4">
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
                  <div key={i} className="flex items-start gap-3.5">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                      item.urgent ? 'border-indigo-600' : 'border-gray-300'
                    }`}>
                      {item.urgent && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('learning')}
            className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Zap className="w-4 h-4" />
            Open Full Learning Roadmap
          </button>
        </div>
      </div>

      {/* ── Career recommendations ─────────────────────────── */}
      {topRecs.length > 0 && (
        <div className="rounded-3xl border border-gray-200/90 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider">Recommended Career Alternatives</p>
            <button
              onClick={() => onNavigateTab('career-paths')}
              className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 transition-colors"
            >
              Explore all <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {topRecs.map(rec => (
              <div
                key={rec.id}
                onClick={() => onSelectRole(rec.role)}
                className="p-5 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-bold text-gray-900 leading-tight">{rec.role}</h3>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md shrink-0 font-numeric">
                      {rec.match_score}%
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-3">{rec.salary_range}</p>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
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
      <div className="rounded-3xl border border-indigo-200/50 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-7 sm:p-9 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-start gap-5 z-10">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0 shadow-inner">
            <BarChart2 className="w-7 h-7 text-indigo-300" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <h3 className="text-xl sm:text-2xl font-black text-white">Job Market Intelligence Stream</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                LIVE
              </span>
            </div>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
              {marketOverview?.totalJobsAnalyzed?.toLocaleString() ?? '15,841'}+ real-world postings analyzed with active internet job streaming.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateTab('job-market')}
          className="px-7 py-3.5 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 rounded-xl text-sm sm:text-base font-bold shrink-0 shadow-lg transition-all flex items-center gap-2.5 z-10"
        >
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          Explore Market Stream
        </button>
      </div>
    </div>
  );
};

// ── ActionCard sub-component ─────────────────────────────

const colorMap: Record<string, { btn: string; badge: string; iconBg: string }> = {
  indigo: {
    btn: 'border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-300',
    badge: 'text-indigo-600',
    iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  },
  emerald: {
    btn: 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300',
    badge: 'text-emerald-600',
    iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  purple: {
    btn: 'border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 hover:border-purple-300',
    badge: 'text-purple-600',
    iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
  },
  sky: {
    btn: 'border-sky-200 text-sky-700 bg-sky-50 hover:bg-sky-100 hover:border-sky-300',
    badge: 'text-sky-600',
    iconBg: 'bg-sky-50 text-sky-600 border-sky-100',
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
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3.5 mb-3.5">
          <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${colors.iconBg}`}>
            {icon}
          </div>
          <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider">{label}</p>
        </div>
        <p className={`text-3xl sm:text-4xl font-black font-numeric mt-1 tracking-tight ${colors.badge}`}>{value}</p>
        <p className="text-xs sm:text-sm text-slate-600 mt-1.5 font-medium">{sub}</p>
      </div>
      <button
        onClick={onClick}
        className={`mt-6 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold border shadow-2xs hover:shadow transition-all ${colors.btn}`}
      >
        {ctaLabel}
      </button>
    </div>
  );
};
