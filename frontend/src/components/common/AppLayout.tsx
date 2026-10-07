import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  GitBranch,
  Sliders,
  BookOpen,
  TrendingUp,
  Brain,
  ClipboardList,
  Mic,
  MessageSquare,
  FileText,
  Menu,
  X,
  Search,
  Bell,
  Briefcase,
  Sparkles,
  Activity,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { UserProfile } from '../../types';
import { MainNavTab } from './Navbar';

interface AppLayoutProps {
  currentTab: MainNavTab;
  onSelectTab: (tab: MainNavTab | 'assistant' | 'settings') => void;
  user: UserProfile | null;
  onNewProfile: () => void;
  children: React.ReactNode;
}

interface NavGroup {
  section: string;
  items: {
    key: any;
    label: string;
    icon: any;
    badge?: string;
    badgeColor?: string;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    section: 'CORE INTELLIGENCE',
    items: [
      { key: 'dashboard',      label: 'Dashboard',         icon: LayoutDashboard },
      { key: 'career-paths',   label: 'Career Pathways',   icon: GitBranch },
      { key: 'skill-gap',      label: 'Skill Gap Matrix',  icon: Sliders },
      { key: 'learning',       label: 'Learning Roadmap',  icon: BookOpen },
    ]
  },
  {
    section: 'MARKET & REQUISITIONS',
    items: [
      { key: 'job-market',     label: 'Job Market Stream', icon: TrendingUp, badge: 'LIVE', badgeColor: 'bg-emerald-500 text-white' },
      { key: 'skills',         label: 'Skills Intelligence', icon: Brain },
      { key: 'jobs',           label: 'Target Opportunities', icon: Briefcase },
    ]
  },
  {
    section: 'EVALUATION & PRACTICE',
    items: [
      { key: 'mock-test',      label: 'Technical Assessment', icon: ClipboardList },
      { key: 'mock-interview', label: 'AI Mock Interview',    icon: Mic, badge: 'AI', badgeColor: 'bg-purple-600 text-white' },
      { key: 'assistant',      label: 'CareerIQ Assistant',   icon: MessageSquare, badge: 'AI', badgeColor: 'bg-indigo-600 text-white' },
    ]
  },
  {
    section: 'PROFILE & ACCOUNT',
    items: [
      { key: 'profile',        label: 'Candidate Profile',  icon: FileText },
    ]
  }
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

export const AppLayout: React.FC<AppLayoutProps> = ({ currentTab, onSelectTab, user, onNewProfile, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelect = (key: any) => {
    onSelectTab(key);
    if (window.innerWidth < 768) {
      setIsMobileOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden text-slate-900">
      {/* ── Sidebar (Desktop) ── */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-slate-200/90 transition-all duration-300 z-30 shadow-xs ${
          isSidebarOpen ? 'w-68' : 'w-20'
        }`}
      >
        {/* Brand Header */}
        <div className="h-18 flex items-center px-5 shrink-0 border-b border-slate-200/80 justify-between">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-600/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 text-lg tracking-tight block leading-none">
                  Career<span className="text-indigo-600">IQ</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-1 block">
                  ML Intelligence v2.4
                </span>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center mx-auto shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Sidebar Nav with Section Headers */}
        <nav className="flex-1 overflow-y-auto py-5 px-3.5 space-y-6 scrollbar-hide">
          {NAV_GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1.5">
              {isSidebarOpen && (
                <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                  {group.section}
                </div>
              )}
              {group.items.map(item => {
                const active = currentTab === item.key;
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => handleSelect(item.key)}
                    className={`w-full flex items-center ${isSidebarOpen ? 'justify-start px-3.5' : 'justify-center px-0'} py-2.5 rounded-xl transition-all duration-200 group relative ${
                      active
                        ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/25'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
                    }`}
                    title={!isSidebarOpen ? item.label : undefined}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-white' : 'text-slate-500 group-hover:text-indigo-600'}`} />
                    {isSidebarOpen && (
                      <span className="ml-3 text-sm flex-1 text-left truncate">{item.label}</span>
                    )}
                    {isSidebarOpen && item.badge && (
                      <span className={`ml-2 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase leading-none shrink-0 ${item.badgeColor || 'bg-indigo-100 text-indigo-700'}`}>
                        {item.badge}
                      </span>
                    )}

                    {/* Collapsed Tooltip */}
                    {!isSidebarOpen && (
                      <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg">
                        {item.label}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Live Engine Status Pill in Sidebar */}
        {isSidebarOpen && (
          <div className="p-3 mx-3 mb-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <div className="text-[11px] leading-tight overflow-hidden">
              <span className="font-bold text-slate-800 block truncate">Models Online</span>
              <span className="text-slate-400 block truncate">RandomForest & XGBoost</span>
            </div>
          </div>
        )}

        {/* Sidebar Footer User Profile */}
        {user && isSidebarOpen && (
          <div className="p-4 border-t border-slate-200/80 shrink-0 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-sm">
                {getInitials(user.name)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-900 truncate leading-tight">{user.name}</p>
                <p className="text-xs text-slate-500 truncate mt-0.5">{user.targetRole || user.currentRole}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* ── Mobile Sidebar Drawer ── */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <aside className="relative w-76 max-w-[85%] bg-white h-full flex flex-col shadow-2xl animate-fade-in-right">
            <div className="h-16 flex items-center px-5 border-b border-slate-200 shrink-0 justify-between">
              <span className="font-extrabold text-slate-900 text-lg tracking-tight">
                Career<span className="text-indigo-600">IQ</span>
              </span>
              <button onClick={() => setIsMobileOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-4 px-3.5 space-y-5">
              {NAV_GROUPS.map((group, gIdx) => (
                <div key={gIdx} className="space-y-1">
                  <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                    {group.section}
                  </div>
                  {group.items.map(item => {
                    const active = currentTab === item.key;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.key}
                        onClick={() => handleSelect(item.key)}
                        className={`w-full flex items-center justify-start px-3.5 py-3 rounded-xl transition-all ${
                          active
                            ? 'bg-indigo-600 text-white font-bold shadow-md'
                            : 'text-slate-600 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-white' : 'text-slate-500'}`} />
                        <span className="ml-3 text-sm flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <span className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-indigo-100 text-indigo-700'}`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>

            {user && (
              <div className="p-4 border-t border-slate-200 shrink-0 bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {getInitials(user.name)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.currentRole}</p>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Top Header */}
        <header className="h-18 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shrink-0 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-20 shadow-xs">
          {/* Left: Hamburger & Page Title Hint */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (window.innerWidth < 768) setIsMobileOpen(true);
                else setIsSidebarOpen(!isSidebarOpen);
              }}
              className="p-2 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Live Model Badge in Top Bar */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Real-Time ML Engine Active</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Search */}
            <div className="hidden md:flex relative items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input 
                type="text" 
                placeholder="Search skills, roles, benchmarks..." 
                className="pl-10 pr-4 py-2 bg-slate-100/80 border border-transparent rounded-xl text-sm text-slate-900 focus:bg-white focus:border-indigo-400 focus:ring-3 focus:ring-indigo-100 outline-none w-72 transition-all font-medium"
              />
            </div>

            <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>

            {user && (
              <div className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-extrabold text-slate-900 leading-tight">{user.name}</p>
                  <p className="text-xs font-semibold text-indigo-600">{user.targetRole || user.currentRole}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 text-white flex items-center justify-center text-sm font-black shadow-md shadow-indigo-600/20 ring-2 ring-indigo-100">
                  {getInitials(user.name)}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Main Canvas */}
        <main className="flex-1 overflow-y-auto w-full bg-slate-50/70 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
};
