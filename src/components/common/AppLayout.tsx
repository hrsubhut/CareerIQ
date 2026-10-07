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
  Settings,
  Menu,
  X,
  Search,
  Bell,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { MainNavTab } from './Navbar'; // Keep type import for compatibility

interface AppLayoutProps {
  currentTab: MainNavTab;
  onSelectTab: (tab: MainNavTab | 'assistant' | 'settings') => void;
  user: UserProfile | null;
  onNewProfile: () => void;
  children: React.ReactNode;
}

const SIDEBAR_ITEMS = [
  { key: 'dashboard',      label: 'Dashboard',    icon: LayoutDashboard },
  { key: 'career-paths',   label: 'Career Paths', icon: GitBranch },
  { key: 'skill-gap',      label: 'Skill Gap',    icon: Sliders },
  { key: 'learning',       label: 'Learning',     icon: BookOpen },
  { key: 'job-market',     label: 'Job Market',   icon: TrendingUp },
  { key: 'skills',         label: 'Skills',       icon: Brain },
  { key: 'mock-test',      label: 'Assessment',   icon: ClipboardList },
  { key: 'mock-interview', label: 'AI Interview', icon: Mic, badge: 'AI' },
  { key: 'assistant',      label: 'CareerIQ Assistant', icon: MessageSquare, badge: 'AI' },
  { key: 'profile',        label: 'Resume / Profile', icon: FileText },
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

  // Close mobile sidebar on resize
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
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* ── Sidebar (Desktop) ── */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 z-20 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-4 shrink-0 border-b border-gray-200">
           {isSidebarOpen ? (
             <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <span className="font-bold text-gray-900 text-base tracking-tight">
                  Career<span className="text-indigo-600">IQ</span>
                </span>
             </div>
           ) : (
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center mx-auto">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                   <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                 </svg>
              </div>
           )}
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
          {SIDEBAR_ITEMS.map(item => {
            const active = currentTab === item.key;
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => handleSelect(item.key)}
                className={`w-full flex items-center ${isSidebarOpen ? 'justify-start px-3' : 'justify-center'} py-2.5 rounded-xl transition-all duration-200 group relative ${
                  active
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={!isSidebarOpen ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-indigo-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                {isSidebarOpen && (
                  <span className="ml-3 text-sm flex-1 text-left truncate">{item.label}</span>
                )}
                {isSidebarOpen && item.badge && (
                  <span className="ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 leading-none shrink-0">
                    {item.badge}
                  </span>
                )}
                
                {/* Tooltip for collapsed state */}
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer User Profile */}
        {user && isSidebarOpen && (
          <div className="p-4 border-t border-gray-200 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center text-sm font-bold shrink-0">
                {getInitials(user.name)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.currentRole}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* ── Mobile Sidebar Drawer ── */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <aside className="relative w-72 max-w-[80%] bg-white h-full flex flex-col shadow-xl animate-fade-in-right">
            <div className="h-16 flex items-center px-4 border-b border-gray-200 shrink-0">
              <span className="font-bold text-gray-900 text-lg tracking-tight">
                Career<span className="text-indigo-600">IQ</span>
              </span>
              <button onClick={() => setIsMobileOpen(false)} className="ml-auto p-2 text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {SIDEBAR_ITEMS.map(item => {
                const active = currentTab === item.key;
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => handleSelect(item.key)}
                    className={`w-full flex items-center justify-start px-3 py-3 rounded-xl transition-all duration-200 ${
                      active
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-indigo-600' : 'text-gray-500'}`} />
                    <span className="ml-3 text-sm flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 leading-none">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {user && (
              <div className="p-4 border-t border-gray-200 shrink-0 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {getInitials(user.name)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.currentRole}</p>
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
        <header className="h-16 bg-white border-b border-gray-200 shrink-0 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 shadow-sm">
          {/* Left: Hamburger */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (window.innerWidth < 768) setIsMobileOpen(true);
                else setIsSidebarOpen(!isSidebarOpen);
              }}
              className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Center/Right: Search, Notifications, Profile */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Search (Placeholder) */}
            <div className="hidden sm:flex relative items-center">
              <Search className="w-4 h-4 text-gray-400 absolute left-3" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-1.5 bg-gray-100 border-transparent rounded-lg text-sm text-gray-900 focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none w-64 transition-all"
              />
            </div>

            <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>

            {user && (
              <div className="hidden sm:flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 leading-tight">{user.name}</p>
                  <p className="text-[11px] text-gray-500">{user.currentRole}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                  {getInitials(user.name)}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Main */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
