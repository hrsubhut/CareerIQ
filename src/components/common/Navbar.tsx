import React, { useState } from 'react';
import {
  LayoutDashboard,
  GitBranch,
  Sliders,
  BookOpen,
  TrendingUp,
  Brain,
  User,
  Upload,
  Menu,
  X,
  ClipboardList,
  Mic,
} from 'lucide-react';
import { UserProfile } from '../../types';

export type MainNavTab =
  | 'dashboard'
  | 'career-paths'
  | 'skill-gap'
  | 'learning'
  | 'job-market'
  | 'skills'
  | 'mock-test'
  | 'mock-interview'
  | 'profile';

interface NavbarProps {
  currentTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
  user: UserProfile | null;
  onNewProfile: () => void;
}

const NAV_ITEMS: { key: MainNavTab; label: string; icon: React.ElementType; badge?: string }[] = [
  { key: 'dashboard',      label: 'Dashboard',    icon: LayoutDashboard },
  { key: 'career-paths',   label: 'Career Paths', icon: GitBranch },
  { key: 'skill-gap',      label: 'Skill Gap',    icon: Sliders },
  { key: 'learning',       label: 'Learning',     icon: BookOpen },
  { key: 'job-market',     label: 'Job Market',   icon: TrendingUp },
  { key: 'skills',         label: 'Skills',       icon: Brain },
  { key: 'mock-test',      label: 'Mock Test',    icon: ClipboardList, badge: 'AI' },
  { key: 'mock-interview', label: 'Interview',    icon: Mic, badge: 'AI' },
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U';
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, user, onNewProfile }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelect = (tab: MainNavTab) => {
    onSelectTab(tab);
    setMobileOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Brand */}
            <button
              onClick={() => handleSelect('dashboard')}
              className="flex items-center gap-2.5 shrink-0 group"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200 group-hover:bg-indigo-700 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-gray-900 text-[15px] tracking-tight">
                  Career<span className="text-indigo-600">IQ</span>
                </span>
                <span className="text-[9px] text-gray-400 font-medium tracking-wide hidden sm:block">Know Your Skills. Navigate Your Career.</span>
              </div>
            </button>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map(item => {
                const active = currentTab === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => handleSelect(item.key)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center gap-1.5 ${
                      active
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                    {item.badge && (
                      <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-indigo-100 text-indigo-700 leading-none">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Upload resume btn */}
              <button
                onClick={onNewProfile}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <Upload className="w-3.5 h-3.5 text-indigo-600" />
                New Profile
              </button>

              {/* Profile avatar */}
              {user && (
                <button
                  onClick={() => handleSelect('profile')}
                  className="flex items-center gap-2 pl-2 border-l border-gray-200 hover:opacity-80 transition-opacity"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center text-xs font-bold shadow-sm shadow-indigo-200">
                    {getInitials(user.name)}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-semibold text-gray-900 leading-tight truncate max-w-[110px]">{user.name}</p>
                    <p className="text-[11px] text-gray-500 truncate max-w-[110px]">{user.currentRole}</p>
                  </div>
                </button>
              )}

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                onClick={() => setMobileOpen(v => !v)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/20 backdrop-blur-xs" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg animate-fade-in"
            onClick={e => e.stopPropagation()}
          >
            <nav className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map(item => {
                const active = currentTab === item.key;
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => handleSelect(item.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </button>
                );
              })}
              <div className="pt-2 pb-1 border-t border-gray-100">
                <button
                  onClick={() => { onNewProfile(); setMobileOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4 text-indigo-600 shrink-0" />
                  Upload New Resume
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
