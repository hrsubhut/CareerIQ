import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Clock,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { AssessmentItem } from '../../types';
import { Badge, BadgeVariant } from '../common/Badge';

interface AssessmentsPageProps {
  assessments: AssessmentItem[];
  onTakeAssessment?: (id: string) => void;
}

export const AssessmentsPage: React.FC<AssessmentsPageProps> = ({ assessments }) => {
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentItem>(assessments[0]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              SKILL PROOF PROTOCOL
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">Objective Performance Testing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Skill Assessments & Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Validate hands-on competencies through algorithmic code challenges and real-world analytical scenarios.
          </p>
        </div>

        <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400">
          Status: <strong className="text-emerald-400 font-mono">2 Verified Badges</strong>
        </div>
      </div>

      {/* Critical Legal / Terminology Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
        <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-300">Evidence Classification Notice:</strong> Assessment achievements represent <span className="text-indigo-300 font-semibold">platform assessment evidence</span> of problem-solving ability on standard benchmark data, and should not be construed as statutory degree accreditation or professional certification.
        </div>
      </div>

      {/* Assessment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assessments.map(asm => {
          const isSelected = selectedAssessment.id === asm.id;
          const isCompleted = asm.status === 'Completed';

          return (
            <div
              key={asm.id}
              onClick={() => setSelectedAssessment(asm)}
              className={`p-6 rounded-2xl border transition-all duration-200 cursor-pointer glow-card flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900/90 border-indigo-500 ring-1 ring-indigo-500/50 shadow-xl shadow-indigo-950/20'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">{asm.title}</h3>
                    <span className="text-xs text-slate-400 font-mono">Skill: {asm.skill}</span>
                  </div>
                  <Badge variant={isCompleted ? 'green' : 'gray'}>
                    {asm.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 mb-4 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Difficulty</span>
                    <span className="font-semibold text-white">{asm.difficulty}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Time</span>
                    <span className="font-semibold text-white">{asm.estimatedTimeMin} mins</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Best Score</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {asm.bestScore !== undefined ? `${asm.bestScore}%` : '—'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  {asm.attempts > 0 ? `${asm.attempts} attempt(s) recorded` : 'Unattempted'}
                </span>
                <button className="px-3.5 py-1.5 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white rounded-lg font-semibold transition-colors flex items-center gap-1">
                  {isCompleted ? 'Review Result' : 'Start Assessment'} <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* SELECTED ASSESSMENT DETAILED FEEDBACK REPORT */}
      {selectedAssessment.feedback && (
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 glow-card space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                Platform Assessment Evidence
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                Diagnostic Report: {selectedAssessment.title}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  {selectedAssessment.feedback.score}%
                </span>
                <span className="block text-[10px] text-slate-500">Verified Score</span>
              </div>
              <Badge variant="green" size="md">
                {selectedAssessment.feedback.skillLevel}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="font-semibold text-emerald-400 flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-4 h-4" /> Demonstrated Strengths:
              </span>
              <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                {selectedAssessment.feedback.strengths.map(str => (
                  <li key={str}>{str}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="font-semibold text-amber-400 flex items-center gap-1.5 mb-2">
                <AlertCircle className="w-4 h-4" /> Areas for Optimization:
              </span>
              <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                {selectedAssessment.feedback.weaknesses.map(w => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-xs text-indigo-300 flex items-start gap-2">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              <strong>Recommended Next Action:</strong> {selectedAssessment.feedback.recommendedAction}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
