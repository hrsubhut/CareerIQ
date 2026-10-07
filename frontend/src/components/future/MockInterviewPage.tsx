import React, { useState, useEffect } from 'react';
import {
  Video,
  Mic,
  MicOff,
  Clock,
  Sparkles,
  Send,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react';
import { MockInterviewStage } from '../../types';
import { Badge } from '../common/Badge';

export const MockInterviewPage: React.FC<{ targetRole: string }> = ({ targetRole }) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(180);
  const [isCompleted, setIsCompleted] = useState(false);

  const stages: MockInterviewStage[] = [
    {
      id: 1,
      name: 'Introduction',
      question: 'Can you walk us through an analytical project where your data insights directly altered a business or product decision?',
      focus: 'Communication, business acumen, project ownership',
    },
    {
      id: 2,
      name: 'Technical Deep Dive',
      question: 'How do you handle severe class imbalance (e.g. 99:1) when training a classification model, and why might accuracy be a deceptive metric?',
      focus: 'Precision/Recall, PR-AUC, cost-sensitive learning, SMOTE vs threshold tuning',
    },
    {
      id: 3,
      name: 'Situational Scenario',
      question: 'Your A/B test results indicate a 4% conversion uplift at p=0.04, but the infrastructure team points out server latency increased by 120ms. How do you advise leadership?',
      focus: 'Trade-off analysis, user experience metrics, risk management',
    },
    {
      id: 4,
      name: 'Behavioral',
      question: 'Tell me about a time when a stakeholder disagreed with your analytical findings. How did you resolve the difference without compromising data integrity?',
      focus: 'Data ethics, persuasion, stakeholder diplomacy',
    },
    {
      id: 5,
      name: 'Role-Specific Case',
      question: 'Design an end-to-end churn prediction pipeline: from raw database logs to live scoring and alerting. What failure modes do you monitor in production?',
      focus: 'Data pipelines, feature drift, model decay, production reliability',
    },
  ];

  const currentStage = stages[currentStageIdx];

  const handleNextStage = () => {
    if (currentStageIdx < stages.length - 1) {
      setCurrentStageIdx(prev => prev + 1);
      setAnswerText('');
      setTimerSeconds(180);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setIsCompleted(false);
    setCurrentStageIdx(0);
    setAnswerText('');
    setTimerSeconds(180);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
              AI COPILOT SIMULATOR
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">Target Role: <strong className="text-white">{targetRole}</strong></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Role-Specific Mock Interview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            5-stage simulated interview evaluating technical depth, situational trade-offs, and communication.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="blue">
            Stage {currentStageIdx + 1} of 5
          </Badge>
        </div>
      </div>

      {/* Stage Progression Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {stages.map((stg, i) => (
          <div
            key={stg.id}
            className={`p-3 rounded-xl border text-xs font-medium text-center transition-all ${
              i === currentStageIdx && !isCompleted
                ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold'
                : i < currentStageIdx || isCompleted
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-500'
            }`}
          >
            <span className="block text-[10px] uppercase font-mono opacity-75">Stage {i + 1}</span>
            <span className="truncate block mt-0.5">{stg.name}</span>
          </div>
        ))}
      </div>

      {!isCompleted ? (
        /* INTERVIEW ACTIVE STAGE */
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800 glow-card space-y-6">
          {/* Stage Prompt & Timer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">
                Stage {currentStage.id}: {currentStage.name}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-1 leading-snug">
                "{currentStage.question}"
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Evaluation Focus: <strong className="text-slate-300">{currentStage.focus}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-amber-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTimer(timerSeconds)}</span>
              </div>

              <button
                onClick={() => setIsVoiceMode(!isVoiceMode)}
                className={`p-2 rounded-xl border transition-colors ${
                  isVoiceMode
                    ? 'bg-rose-950/60 border-rose-700 text-rose-300'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
                title={isVoiceMode ? 'Voice Mode Active' : 'Switch to Voice Input'}
              >
                {isVoiceMode ? <Mic className="w-4 h-4 text-rose-400 animate-pulse" /> : <MicOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Answer Area */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              Your Articulated Response {isVoiceMode && '(Voice Transcribing Active)'}:
            </label>
            <textarea
              rows={6}
              value={answerText}
              onChange={e => setAnswerText(e.target.value)}
              placeholder="Structure your answer using the STAR framework (Situation, Task, Action, Result). State the trade-offs considered and quantifiable impact..."
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:border-indigo-500 outline-none leading-relaxed placeholder-slate-600 resize-none font-sans"
            />
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Tip: Highlight experimental rigor and metric trade-offs clearly.
            </span>

            <button
              onClick={handleNextStage}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Send className="w-4 h-4" />
              {currentStageIdx < stages.length - 1 ? 'Submit & Proceed' : 'Complete & Generate Evaluation'}
            </button>
          </div>
        </div>
      ) : (
        /* INTERVIEW EVALUATION REPORT */
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 glow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-xl font-bold text-white">Interview Assessment Feedback</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                AI Rubric Score across communication, domain accuracy, and problem decomposition.
              </p>
            </div>

            <button
              onClick={handleReset}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restart Simulation
            </button>
          </div>

          {/* Rubric Breakdown Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block mb-1">Communication</span>
              <span className="text-2xl font-bold text-white font-mono">84%</span>
            </div>
            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block mb-1">Technical Depth</span>
              <span className="text-2xl font-bold text-indigo-400 font-mono">76%</span>
            </div>
            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block mb-1">Problem Solving</span>
              <span className="text-2xl font-bold text-emerald-400 font-mono">88%</span>
            </div>
            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block mb-1">Answer Structure</span>
              <span className="text-2xl font-bold text-white font-mono">82%</span>
            </div>
            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-center col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-400 block mb-1">Role Readiness</span>
              <span className="text-2xl font-bold text-cyan-400 font-mono">80%</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Qualitative Feedback:
            </h4>
            <p>
              Your answers demonstrated strong commercial awareness and commendable understanding of trade-offs between precision and latency.
            </p>
            <p className="text-slate-400">
              <strong className="text-slate-200">Recommended Optimization:</strong> When asked about class imbalance, mention business cost matrix formulation before jumping into SMOTE techniques to showcase executive alignment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
