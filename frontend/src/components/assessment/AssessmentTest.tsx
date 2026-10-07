import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { getMockQuestions, AssessmentQuestion } from '../../lib/mock/questions/data';
import { evaluateAssessment, AssessmentResult } from '../../lib/assessment/scoring';

interface AssessmentTestProps {
  role: string;
  onClose: () => void;
  onComplete: (result: AssessmentResult) => void;
}

export const AssessmentTest: React.FC<AssessmentTestProps> = ({ role, onClose, onComplete }) => {
  const [phase, setPhase] = useState<'intro' | 'test' | 'results'>('intro');
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 mins
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    setQuestions(getMockQuestions(role));
  }, [role]);

  const startTest = () => {
    setPhase('test');
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const res = evaluateAssessment(questions, answers);
    setResult(res);
    setPhase('results');
    onComplete(res);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (phase === 'intro') {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 animate-fade-in-up">
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-900 flex items-center gap-2 mb-8 font-bold text-sm sm:text-base transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Intelligence Dashboard
        </button>

        <div className="bg-slate-900 text-white p-8 sm:p-12 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-1">
              Empirical Technical Benchmark
            </span>
            <h1 className="text-3xl sm:text-4xl font-black">Technical Assessment: {role}</h1>
          </div>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            This standardized evaluation contains exactly 30 multiple-choice questions curated directly for {role} competencies. You have 30 minutes to complete the test.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/80">
              <Clock className="w-7 h-7 text-indigo-400 mb-2" />
              <p className="text-sm font-bold text-white">30 Minutes Timed</p>
              <p className="text-xs text-slate-400 mt-1">Countdown begins immediately when test starts</p>
            </div>
            <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/80">
              <AlertCircle className="w-7 h-7 text-amber-400 mb-2" />
              <p className="text-sm font-bold text-white">Continuous Session</p>
              <p className="text-xs text-slate-400 mt-1">Answer questions at your own pace before timer expires</p>
            </div>
          </div>
          <button
            onClick={startTest}
            className="w-full py-4.5 bg-indigo-600 hover:bg-indigo-700 text-white text-base sm:text-lg font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl mt-4"
          >
            Start Technical Assessment
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'test' && questions.length > 0) {
    const q = questions[currentQ];
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg text-white">
          <div>
            <h2 className="font-bold text-base sm:text-lg">{role} Assessment</h2>
            <p className="text-xs text-slate-400">Question {currentQ + 1} of 30</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-indigo-400 font-numeric text-xl font-bold bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-700">
              <Clock className="w-5 h-5" />
              {formatTime(timeLeft)}
            </div>
            <button
              onClick={handleSubmit}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm sm:text-base font-bold rounded-xl transition-all shadow-sm"
            >
              Submit Test
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs sm:text-sm text-gray-500 font-semibold mb-2">
            <span>Overall Completion</span>
            <span>{Math.round(((currentQ + 1) / 30) * 100)}%</span>
          </div>
          <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${((currentQ + 1) / 30) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-200/90 shadow-sm space-y-8">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase rounded-lg border border-indigo-200">
              {q.skill}
            </span>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase rounded-lg">
              {q.difficulty}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-relaxed">
            {q.question}
          </h3>

          <div className="space-y-3.5">
            {q.options.map((opt, idx) => {
              const isSelected = answers[currentQ] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setAnswers(prev => ({ ...prev, [currentQ]: idx }))}
                  className={`w-full p-5 rounded-2xl border-2 text-base font-semibold text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-2 ring-indigo-400 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 text-slate-800 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug">{opt}</span>
                  </div>
                  {isSelected && <CheckCircle className="w-5 h-5 text-indigo-600 shrink-0 ml-3" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center pt-2">
          <button
            onClick={() => setCurrentQ(prev => Math.max(0, prev - 1))}
            disabled={currentQ === 0}
            className="px-6 py-3 rounded-xl border border-gray-300 font-bold text-sm sm:text-base text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors shadow-xs"
          >
            Previous
          </button>

          <div className="flex gap-1.5 overflow-x-auto max-w-[55%] px-3 hide-scrollbar">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQ(idx)}
                className={`w-9 h-9 shrink-0 rounded-xl text-xs font-black transition-all ${
                  currentQ === idx
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-300 ring-offset-1 scale-105 shadow-xs'
                    : answers[idx] !== undefined
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              if (currentQ === questions.length - 1) handleSubmit();
              else setCurrentQ(prev => prev + 1);
            }}
            className="px-7 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm sm:text-base hover:bg-indigo-700 transition-all shadow-md"
          >
            {currentQ === questions.length - 1 ? 'Submit Test' : 'Next'}
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'results' && result) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6 animate-fade-in-up">
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-900 flex items-center gap-2 font-bold text-sm sm:text-base transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Intelligence Dashboard
        </button>

        <div className="bg-slate-900 text-white p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-1">Assessment Complete</span>
            <h1 className="text-3xl sm:text-4xl font-black">Performance Breakdown: {role}</h1>
            <p className="text-slate-300 text-sm sm:text-base mt-1.5">
              Objective competency scoring mapped to verified industry hiring expectations.
            </p>
          </div>
          <div className="text-right flex items-center gap-8 shrink-0">
            <div className="text-center">
              <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Score</p>
              <p className="text-5xl font-black text-white font-numeric">{result.overallScore}%</p>
            </div>
            <div className="w-px h-14 bg-slate-700" />
            <div className="text-center">
              <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Correct</p>
              <p className="text-5xl font-black text-indigo-400 font-numeric">{result.correctAnswers}/{result.totalQuestions}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/90 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 uppercase tracking-wider mb-5">Skill Performance Breakdown</h3>
            <div className="space-y-4">
              {Object.entries(result.skillScores).map(([skill, score]) => (
                <div key={skill}>
                  <div className="flex justify-between text-sm font-bold mb-1.5">
                    <span className="text-gray-800">{skill}</span>
                    <span className={`font-numeric ${score >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{score}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${score >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 p-6 sm:p-7 rounded-3xl">
              <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">Strongest Competencies</h3>
              <p className="text-emerald-950 font-bold text-base sm:text-lg">
                {result.strongSkills.length > 0 ? result.strongSkills.join(', ') : 'Needs more practice across core fundamentals.'}
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 p-6 sm:p-7 rounded-3xl space-y-3">
              <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider">Priority Skill Gaps</h3>
              <p className="text-amber-950 font-bold text-base sm:text-lg">
                {result.weakSkills.length > 0 ? result.weakSkills.join(', ') : 'None! Exceptional performance.'}
              </p>
              {result.weakSkills.length > 0 && (
                <p className="text-sm text-amber-800 leading-relaxed font-medium">
                  Your {role} fundamentals are mostly solid, but <strong>{result.weakSkills[0]}</strong> is currently your largest skill deficit. Prioritize targeted practice in this area before interviewing.
                </p>
              )}
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 pt-4">Detailed Question Review</h3>
        <div className="space-y-4">
          {questions.map((q, idx) => {
            const isCorrect = answers[idx] === q.correctAnswer;
            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl border ${isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'}`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 shrink-0">
                    {isCorrect ? <CheckCircle className="w-6 h-6 text-emerald-600" /> : <AlertCircle className="w-6 h-6 text-rose-600" />}
                  </div>
                  <div className="space-y-2 flex-1">
                    <p className="text-base font-bold text-gray-900">Q{idx + 1}. {q.question}</p>
                    <p className="text-sm text-gray-700">
                      Your Answer: <span className="font-bold">{q.options[answers[idx]] || 'Not answered'}</span>
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-gray-900 bg-white p-3 rounded-xl border border-gray-200 shadow-2xs inline-block">
                        Correct Answer: <span className="font-bold text-emerald-700">{q.options[q.correctAnswer]}</span>
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-gray-600 bg-gray-100/90 p-3 rounded-xl leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};
