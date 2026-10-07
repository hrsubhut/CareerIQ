import React from 'react';
import {
  Compass,
  GitBranch,
  TrendingUp,
  Brain,
  Sliders,
  Map,
  Award,
  Video,
  FileText,
  Briefcase,
  Settings,
  HelpCircle,
  X,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { UserProfile } from '../../types';

export type NavItemKey =
  | 'overview'
  | 'my-career'
  | 'job-market'
  | 'skills-intelligence'
  | 'skill-gap'
  | 'learning-roadmap'
  | 'assessments'
  | 'mock-interview'
  | 'resume'
  | 'applications'
  | 'skill-outcome'
  | 'work-style';

interface SidebarProps {
  currentTab: NavItemKey;
  onSelectTab: (tab: NavItemKey) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  user: UserProfile | null;
  onOpenDataTransparency: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  user,
}) => {
  const primaryNavItems: { key: NavItemKey; label: string; icon: any; isFuture?: boolean }[] = [
    { key: 'overview', label: 'Overview', icon: Compass },
    { key: 'my-career', label: 'My Career', icon: GitBranch },
    { key: 'job-market', label: 'Job Market', icon: TrendingUp },
    { key: 'skills-intelligence', label: 'Skills Intelligence', icon: Brain },
    { key: 'skill-gap', label: 'Skill Gap', icon: Sliders },
    { key: 'skill-outcome', label: 'Skill Outcomes (JDS)', icon: Sparkles },
    { key: 'work-style', label: 'Work Style Insights', icon: Brain },
    { key: 'learning-roadmap', label: 'Learning Roadmap', icon: Map, isFuture: true },
    { key: 'assessments', label: 'Assessments', icon: Award, isFuture: true },
    { key: 'mock-interview', label: 'Mock Interview', icon: Video, isFuture: true },
    { key: 'resume', label: 'Resume', icon: FileText, isFuture: true },
    { key: 'applications', label: 'Applications', icon: Briefcase, isFuture: true },
  ];

  const handleNavClick = (key: NavItemKey) => {
    onSelectTab(key);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0d1322] border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800/80 bg-[#0a0f1c]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-brand-500 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                CareerPath <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-mono">AI</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">CAREER INTELLIGENCE</p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Intelligence Core
          </div>

          {primaryNavItems.slice(0, 7).map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />}
              </button>
            );
          })}

          <div className="pt-4 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Career Copilot Modules</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400">PROTOTYPE</span>
          </div>

          {primaryNavItems.slice(7).map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Soon</span>
              </button>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="p-3 border-t border-slate-800/80 bg-[#0a0f1c] space-y-1">
          <div className="flex items-center justify-between px-2 py-1.5 text-xs text-slate-400">
            <button
              onClick={() => alert('Settings: Kaggle API configurations & environment variables.')}
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            <button
              onClick={() => alert('Help & Analytics Documentation: Contact support@careerpath.ai')}
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Help</span>
            </button>
          </div>

          {/* User mini profile card */}
          {user && (
            <div className="mt-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white truncate">{user.name}</div>
                <div className="text-[11px] text-slate-400 truncate">{user.currentRole}</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-bold text-emerald-400">{user.careerReadiness}%</div>
                <div className="text-[9px] text-slate-500">Ready</div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
