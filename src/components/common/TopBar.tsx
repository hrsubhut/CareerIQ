import React from 'react';
import {
  Search,
  Bell,
  Menu,
  Database,
  User,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../../types';

interface TopBarProps {
  onOpenMobileMenu: () => void;
  onOpenDataTransparency: () => void;
  onOpenOnboarding: () => void;
  onToggleLanding: () => void;
  isLandingView: boolean;
  user: UserProfile | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenMobileMenu,
  onOpenDataTransparency,
  onOpenOnboarding,
  onToggleLanding,
  isLandingView,
  user,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0d1322]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left section: Hamburger (mobile) + Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search roles, required skills, market benchmarks..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 transition-all"
          />
        </div>
      </div>

      {/* Right section: Indicators, Actions, Avatar */}
      <div className="flex items-center gap-3">
        {/* Data Freshness Indicator */}
        <button
          onClick={onOpenDataTransparency}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs font-medium hover:bg-emerald-900/30 transition-colors"
          title="Click to view full dataset provenance and sample metrics"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[11px]">17.4k Postings (2024-25)</span>
          <Database className="w-3.5 h-3.5 opacity-70" />
        </button>

        {/* Landing preview toggle */}
        <button
          onClick={onToggleLanding}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-medium text-slate-200 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          {isLandingView ? 'Back to App' : 'Landing Page'}
        </button>

        {/* Edit Profile / Re-onboard */}
        <button
          onClick={onOpenOnboarding}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-semibold text-indigo-300 transition-colors"
        >
          <User className="w-3.5 h-3.5" />
          Onboard / Edit
        </button>

        {/* Notifications Icon */}
        <button
          onClick={() => alert('Notifications: Market alerts for Data Scientist roles updated (+21% volume in Q3).')}
          className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
        </button>

        {/* User Info & Profile Completion */}
        {user && (
          <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
            <div className="hidden xl:block text-right">
              <div className="text-xs font-semibold text-white leading-tight">{user.name}</div>
              <div className="text-[10px] text-slate-400">
                Strength: <span className="text-indigo-400 font-bold">{user.profileStrength}%</span>
              </div>
            </div>

            <div
              onClick={onOpenOnboarding}
              className="relative cursor-pointer group"
              title="Click to edit profile"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-700 ring-2 ring-indigo-500/30 flex items-center justify-center text-xs font-bold text-white shadow-md group-hover:ring-indigo-400 transition-all">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0d1322] flex items-center justify-center text-[7px] text-black font-extrabold">
                ✓
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
