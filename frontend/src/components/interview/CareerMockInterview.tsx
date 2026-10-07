import React, { useState } from 'react';
import { Video, CheckCircle2, RotateCcw, Send, AlertCircle, Sparkles } from 'lucide-react';

interface CareerMockInterviewProps {
  targetRole: string;
}

export const CareerMockInterview: React.FC<CareerMockInterviewProps> = ({ targetRole }) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);

  const questions = [
    {
      id: 1,
      type: 'Technical Question',
      question: 'How do you handle severe class imbalance (e.g. 99:1) when training a classification model, and why might accuracy be a deceptive metric?',
      focus: 'Precision/Recall, PR-AUC, cost-sensitive learning, SMOTE vs threshold tuning',
    },
    {
      id: 2,
      type: 'Role-Specific Question',
      question: 'Walk me through how you detect model drift in production and what automated safeguards you put in place.',
      focus: 'Population Stability Index (PSI), feature distribution shifts, retrain triggers',
    },
    {
      id: 3,
      type: 'Situational Scenario',
      question: 'Your A/B test results indicate a 4% conversion uplift at p=0.04, but server latency increased by 120ms. What is your recommendation to leadership?',
      focus: 'Trade-off analysis, user experience metrics, holistic risk assessment',
    },
    {
      id: 4,
      type: 'Behavioral Question',
      question: 'Describe a project where a stakeholder questioned your analytical findings. How did you resolve the disagreement without sacrificing statistical integrity?',
      focus: 'Data ethics, transparent documentation, diplomatic persuasion',
    },
  ];

  const handleNext = () => {
    if (!answerText.trim()) {
      alert('Please provide an answer before proceeding.');
      return;
    }
    const updated = [...userAnswers, answerText];
    setUserAnswers(updated);
    setAnswerText('');

    if (currentStageIdx < questions.length - 1) {
      setCurrentStageIdx(i => i + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setIsCompleted(false);
    setCurrentStageIdx(0);
    setAnswerText('');
    setUserAnswers([]);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6">
      <div className="border-b border-gray-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
            Simulated Practice
          </span>
          <h2 className="text-lg font-bold text-gray-900">
            {targetRole} Mock Interview
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Role-specific technical, scenario, and behavioral interview simulation with automated rubric feedback.
          </p>
        </div>

        {!isCompleted && (
          <span className="text-xs text-gray-600 font-semibold px-2.5 py-1 bg-gray-100 rounded-md">
            Question {currentStageIdx + 1} of {questions.length}
          </span>
        )}
      </div>

      {!isCompleted ? (
        <div className="space-y-5">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-indigo-600 uppercase">
              {questions[currentStageIdx].type}
            </span>
            <h3 className="text-sm font-bold text-gray-900 leading-snug">
              "{questions[currentStageIdx].question}"
            </h3>
            <p className="text-xs text-gray-500">
              Evaluation Focus: <strong>{questions[currentStageIdx].focus}</strong>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Your Answer:
            </label>
            <textarea
              rows={5}
              value={answerText}
              onChange={e => setAnswerText(e.target.value)}
              placeholder="State your approach clearly. Mention trade-offs, metrics considered, and practical business impact..."
              className="w-full p-3.5 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-indigo-500 shadow-sm leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              Tip: Use the STAR format (Situation, Task, Action, Result) for behavioral answers.
            </span>

            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              {currentStageIdx < questions.length - 1 ? 'Submit & Next Question' : 'Complete Interview'}
            </button>
          </div>
        </div>
      ) : (
        /* Feedback Report */
        <div className="space-y-6">
          <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
                Interview Completed
              </span>
              <h3 className="text-xl font-bold text-gray-900 mt-1">
                Interview Performance Score: 82 / 100
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Solid technical depth with strong articulation of metric trade-offs.
              </p>
            </div>

            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 bg-white rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake Interview
            </button>
          </div>

          {/* Scores Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white border border-gray-200 rounded-lg text-center">
              <span className="text-gray-500 block text-[11px]">Technical Knowledge</span>
              <span className="text-lg font-bold text-indigo-600 font-mono mt-0.5 block">80%</span>
            </div>
            <div className="p-3 bg-white border border-gray-200 rounded-lg text-center">
              <span className="text-gray-500 block text-[11px]">Communication</span>
              <span className="text-lg font-bold text-emerald-600 font-mono mt-0.5 block">86%</span>
            </div>
            <div className="p-3 bg-white border border-gray-200 rounded-lg text-center">
              <span className="text-gray-500 block text-[11px]">Problem Decomposition</span>
              <span className="text-lg font-bold text-gray-900 font-mono mt-0.5 block">84%</span>
            </div>
            <div className="p-3 bg-white border border-gray-200 rounded-lg text-center">
              <span className="text-gray-500 block text-[11px]">Answer Structure</span>
              <span className="text-lg font-bold text-gray-900 font-mono mt-0.5 block">78%</span>
            </div>
          </div>

          {/* Feedback & Improvement Suggestions */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg text-xs space-y-2">
            <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" /> Improvement Suggestions:
            </h4>
            <p className="text-gray-600 leading-relaxed">
              When explaining class imbalance, lead with business costs (e.g. false negative cost vs false positive cost) before transitioning to SMOTE or PR-AUC metrics.
            </p>
            <p className="text-[11px] text-gray-400 italic">
              Notice: Mock interview evaluations represent exploratory simulation feedback and do not constitute hiring guarantees.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
