import React, { useState } from 'react';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Plus,
  ChevronRight,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ApplicationTrackerItem } from '../../types';
import { Badge } from '../common/Badge';

interface ApplicationsTrackerPageProps {
  initialJobs: ApplicationTrackerItem[];
}

export const ApplicationsTrackerPage: React.FC<ApplicationsTrackerPageProps> = ({ initialJobs }) => {
  const [jobs, setJobs] = useState<ApplicationTrackerItem[]>(initialJobs);

  const stages: ApplicationTrackerItem['stage'][] = [
    'Recommended',
    'Saved',
    'Applied',
    'Interview',
    'Offer',
  ];

  const handleMoveStage = (jobId: string, direction: 'forward' | 'backward') => {
    setJobs(prev =>
      prev.map(j => {
        if (j.id !== jobId) return j;
        const currentIdx = stages.indexOf(j.stage);
        const newIdx = direction === 'forward' ? currentIdx + 1 : currentIdx - 1;
        if (newIdx >= 0 && newIdx < stages.length) {
          return { ...j, stage: stages[newIdx] };
        }
        return j;
      })
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
              APPLICATION COPILOT
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">Continuous Opportunity Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Applications Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track role applications and interviews filtered by your calculated compatibility scores.
          </p>
        </div>

        <button
          onClick={() => alert('Add Application: Manual role tracking entry created.')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" /> Add Application
        </button>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {stages.map(stg => {
          const stageJobs = jobs.filter(j => j.stage === stg);

          return (
            <div
              key={stg}
              className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-4 flex flex-col min-w-[240px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs">
                <span className="font-bold text-white tracking-wide">{stg}</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono text-[11px] font-semibold">
                  {stageJobs.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-3 flex-1">
                {stageJobs.map(job => (
                  <div
                    key={job.id}
                    className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl hover:border-slate-700 transition-all text-xs space-y-2 glow-card"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <h4 className="font-bold text-white text-xs leading-snug">{job.role}</h4>
                        <span className="text-slate-400 text-[11px] font-medium">{job.company}</span>
                      </div>
                      <span className="font-mono text-emerald-400 font-bold text-[11px] shrink-0">
                        {job.matchScore}%
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="font-mono text-slate-300">{job.salary}</span>
                      </div>
                    </div>

                    {/* Move controls */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      {stg !== 'Recommended' ? (
                        <button
                          onClick={() => handleMoveStage(job.id, 'backward')}
                          className="text-[10px] text-slate-500 hover:text-slate-300"
                        >
                          ← Prev
                        </button>
                      ) : <span />}

                      {stg !== 'Offer' && (
                        <button
                          onClick={() => handleMoveStage(job.id, 'forward')}
                          className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5 ml-auto"
                        >
                          Next →
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {stageJobs.length === 0 && (
                  <div className="py-8 text-center text-slate-600 text-xs italic">
                    No active roles
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
