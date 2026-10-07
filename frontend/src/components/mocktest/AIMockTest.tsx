import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Brain, Clock, ChevronLeft, ChevronRight, ChevronDown, Flag, CheckCircle2,
  Circle, AlertTriangle, BarChart2, Loader2, RotateCcw, Zap,
  BookOpen, ArrowRight, X, TrendingUp, AlertCircle, Star,
} from 'lucide-react';
import {
  aiService, MCQQuestion, MockTestResult, LearningPathItem,
} from '../../services/aiService';

// ─── Job role config ──────────────────────────────────────────────────────────

const JOB_ROLES: Record<string, string[]> = {
  'Data Scientist': ['Python', 'SQL', 'Statistics', 'Machine Learning', 'Data Science'],
  'Data Analyst': ['SQL', 'Python', 'Excel', 'Data Visualization', 'Statistics'],
  'ML Engineer': ['Python', 'Machine Learning', 'Deep Learning', 'MLOps', 'System Design'],
  'Data Engineer': ['SQL', 'Python', 'ETL', 'Data Pipelines', 'Cloud'],
  'AI Engineer': ['Python', 'Deep Learning', 'NLP', 'LLMs', 'System Design'],
  'Software Engineer': ['Data Structures', 'Algorithms', 'System Design', 'Python', 'Databases'],
  'Business Analyst': ['SQL', 'Excel', 'Business Intelligence', 'Data Analysis', 'Stakeholder Management'],
};

interface AIMockTestProps {
  defaultRole?: string;
  onClose?: () => void;
  onComplete?: (result: MockTestResult) => void;
}

type TestPhase = 'setup' | 'generating' | 'in-progress' | 'results' | 'skill-detail' | 'learning-path';

// ─── Main Component ───────────────────────────────────────────────────────────

export const AIMockTest: React.FC<AIMockTestProps> = ({ defaultRole, onClose, onComplete }) => {
  const [phase, setPhase] = useState<TestPhase>('setup');
  const [selectedRole, setSelectedRole] = useState(defaultRole || 'Data Scientist');
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [result, setResult] = useState<MockTestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(45 * 60); // 45 min
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [learningPath, setLearningPath] = useState<LearningPathItem[]>([]);
  const [loadingPath, setLoadingPath] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer
  useEffect(() => {
    if (phase === 'in-progress') {
      timerRef.current = setInterval(() => {
        setTimer(t => {
          if (t <= 1) {
            handleSubmit();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const startTest = async () => {
    setError(null);
    setPhase('generating');
    try {
      const qs = await aiService.generateMockTest(selectedRole, selectedSkill ? [selectedSkill] : (JOB_ROLES[selectedRole] || ['General']));
      if (!qs || qs.length < 10) throw new Error('Received too few questions from AI.');
      setQuestions(qs);
      setAnswers({});
      setMarked(new Set());
      setCurrentQ(0);
      setTimer(45 * 60);
      setPhase('in-progress');
    } catch (e: any) {
      setError(e.message || 'Failed to generate test. Please retry.');
      setPhase('setup');
    }
  };

  const handleSubmit = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const res = await aiService.evaluateMockTest(selectedRole, questions, answers);
    setResult(res);
    setPhase('results');
    if (onComplete) onComplete(res);
  }, [selectedRole, questions, answers, onComplete]);

  const loadLearningPath = async (skill: string) => {
    setSelectedSkill(skill);
    setLoadingPath(true);
    setPhase('learning-path');
    try {
      const path = await aiService.generateLearningPath(selectedRole, skill);
      setLearningPath(path);
    } catch {
      setLearningPath([]);
    } finally {
      setLoadingPath(false);
    }
  };

  // ── Phase: Setup ─────────────────────────────────────────────────────────────
  if (phase === 'setup') {
    const availableDomains = JOB_ROLES[selectedRole] || [];

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in-up">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">CareerIQ</span>
              </div>
              {onClose && (
                <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <h1 className="text-2xl font-bold">AI Mock Test</h1>
            <p className="text-indigo-200 text-sm mt-1">Test your knowledge for your target career.</p>
          </div>

          <div className="p-6 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Target Job Role</label>
              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={e => {
                    setSelectedRole(e.target.value);
                    setSelectedSkill(null); // Reset domain on role change
                  }}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  {Object.keys(JOB_ROLES).map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </div>
            </div>

            {availableDomains.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Domain</label>
                <div className="relative">
                  <select
                    value={selectedSkill || ''}
                    onChange={e => setSelectedSkill(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="" disabled>Select Domain</option>
                    {availableDomains.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 text-center pt-2">
              {[
                { label: 'Basic', count: '10', color: 'text-emerald-600' },
                { label: 'Medium', count: '10', color: 'text-amber-600' },
                { label: 'Hard', count: '10', color: 'text-indigo-600' },
              ].map(d => (
                <div key={d.label} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <p className={`text-lg font-bold ${d.color}`}>{d.count}</p>
                  <p className="text-xs text-gray-500">{d.label}</p>
                </div>
              ))}
            </div>

            <button
              onClick={startTest}
              disabled={!selectedSkill}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Zap className="w-4 h-4" />
              Start Mock Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Phase: Generating ─────────────────────────────────────────────────────────
  if (phase === 'generating') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center justify-center mx-auto">
            <Loader2 className="w-7 h-7 text-indigo-600 animate-spin" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Generating your {selectedRole} assessment...</h2>
          <p className="text-sm text-gray-500">AI is crafting 30 role-specific questions. This takes ~10 seconds.</p>
          <div className="flex gap-2 justify-center pt-2">
            {['Basic', 'Medium', 'Hard'].map((d, i) => (
              <span key={d} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs text-gray-600">
                10 {d} Questions
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Phase: In Progress ────────────────────────────────────────────────────────
  if (phase === 'in-progress' && questions.length > 0) {
    const q = questions[currentQ];
    const diffLabel = q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1);
    const diffColors: Record<string, string> = {
      basic: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      medium: 'text-amber-700 bg-amber-50 border-amber-200',
      hard: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    };
    const answered = Object.keys(answers).length;
    const isMarked = marked.has(currentQ);

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-xs font-bold text-gray-900">{selectedRole}</p>
                <p className="text-[11px] text-gray-500">Q{currentQ + 1} of {questions.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${diffColors[q.difficulty]}`}>
                {diffLabel}
              </span>
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono font-bold ${
                timer < 300 ? 'text-red-600 bg-red-50 border-red-200' : 'text-gray-700 bg-gray-50 border-gray-200'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                {formatTime(timer)}
              </div>
            </div>
          </div>
          {/* Progress bar */}
          <div className="max-w-3xl mx-auto mt-2">
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all"
                style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-4">
            {/* Skill badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                {q.skill}
              </span>
            </div>

            {/* Question card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <p className="text-sm font-semibold text-gray-900 leading-relaxed">{q.question}</p>
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {q.options.map((opt, idx) => {
                const selected = answers[currentQ] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setAnswers(prev => ({ ...prev, [currentQ]: idx }))}
                    className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition-all flex items-center gap-3 ${
                      selected
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-400'
                        : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${
                      selected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300 text-gray-500'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCurrentQ(q => Math.max(0, q - 1))}
                disabled={currentQ === 0}
                className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>

              <button
                onClick={() => setMarked(s => {
                  const next = new Set(s);
                  next.has(currentQ) ? next.delete(currentQ) : next.add(currentQ);
                  return next;
                })}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                  isMarked
                    ? 'bg-amber-50 border-amber-300 text-amber-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                {isMarked ? 'Marked' : 'Mark'}
              </button>

              {currentQ < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQ(q => q + 1)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Submit Test <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Q navigator */}
        <div className="bg-white border-t border-gray-200 px-4 py-2">
          <div className="max-w-3xl mx-auto">
            <p className="text-[10px] text-gray-500 mb-1.5 font-semibold uppercase tracking-wider">
              {answered}/{questions.length} answered
            </p>
            <div className="flex flex-wrap gap-1.5">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQ(i)}
                  className={`w-7 h-7 rounded-md text-[10px] font-bold transition-all ${
                    i === currentQ
                      ? 'bg-indigo-600 text-white'
                      : marked.has(i)
                      ? 'bg-amber-100 text-amber-700 border border-amber-300'
                      : answers[i] !== undefined
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Phase: Results ─────────────────────────────────────────────────────────────
  if (phase === 'results' && result) {
    const { totalScore, basicScore, mediumScore, hardScore, skillScores, weakSkills, strongSkills } = result;
    const pass = totalScore >= 80;

    return (
      <div className="min-h-screen bg-gray-50 py-6 px-4">
        <div className="max-w-2xl mx-auto space-y-5 animate-fade-in-up">
          {/* Header */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className={`p-6 ${pass ? 'bg-gradient-to-r from-emerald-600 to-emerald-700' : 'bg-gradient-to-r from-indigo-600 to-indigo-700'} text-white`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider opacity-75 mb-1">CareerIQ · Mock Test Result</p>
                  <h1 className="text-3xl font-bold">{totalScore}%</h1>
                  <p className={`text-sm mt-1 ${pass ? 'text-emerald-100' : 'text-indigo-200'}`}>
                    {pass ? '🎉 Career Knowledge Readiness: Strong' : '📚 More Practice Recommended'}
                  </p>
                </div>
                {onClose && (
                  <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-700 leading-relaxed">
                {pass
                  ? `Great performance on your ${selectedRole} assessment! You demonstrated strong knowledge across most areas. Continue refining your weaker topics to reach expert level.`
                  : `You scored ${totalScore}% on your ${selectedRole} assessment. Your foundation is developing, but there are specific skills that need focused practice before you're interview-ready.`}
              </p>
            </div>
          </div>

          {/* Score breakdown */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Basic', score: basicScore, color: 'text-emerald-600' },
              { label: 'Medium', score: mediumScore, color: 'text-amber-600' },
              { label: 'Hard', score: hardScore, color: 'text-indigo-600' },
            ].map(({ label, score, color }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm text-center">
                <p className={`text-2xl font-bold font-numeric ${color}`}>
                  {score.correct}/{score.total}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Skill breakdown */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-bold text-gray-900">Skill Performance</h2>
            <div className="space-y-3">
              {Object.entries(skillScores).map(([skill, { correct, total }]) => {
                const pct = Math.round((correct / total) * 100);
                const isWeak = pct < 60;
                return (
                  <div key={skill}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-800">{skill}</span>
                        {isWeak && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{correct}/{total}</span>
                        <span className={`text-xs font-bold font-numeric ${isWeak ? 'text-amber-600' : 'text-emerald-600'}`}>{pct}%</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isWeak ? 'bg-amber-400' : 'bg-emerald-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    {isWeak && (
                      <button
                        onClick={() => loadLearningPath(skill)}
                        className="mt-1.5 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                      >
                        <BookOpen className="w-3 h-3" /> Get Learning Path for {skill} →
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weak skills panel */}
          {weakSkills.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-bold text-amber-900">Areas Needing Practice</h2>
              </div>
              <div className="space-y-2">
                {weakSkills.map(skill => (
                  <div key={skill} className="flex items-center justify-between bg-white rounded-xl p-3 border border-amber-200">
                    <div>
                      <p className="text-xs font-bold text-gray-900">{skill}</p>
                      <p className="text-[11px] text-gray-500">
                        {Math.round((skillScores[skill]?.correct / skillScores[skill]?.total) * 100)}% accuracy — needs improvement
                      </p>
                    </div>
                    <button
                      onClick={() => loadLearningPath(skill)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      Learn →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review Questions */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-bold text-gray-900">Detailed Review</h2>
            <div className="space-y-4">
              {questions.map((q, i) => {
                const userAns = answers[i];
                const isCorrect = userAns === q.correctAnswer;
                return (
                  <div key={i} className={`p-4 rounded-xl border ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 mb-2">Q{i + 1}. {q.question}</p>
                        <div className="space-y-1.5 mb-3">
                          {q.options.map((opt, optIdx) => {
                            const isUserChoice = userAns === optIdx;
                            const isActualCorrect = q.correctAnswer === optIdx;
                            let style = 'text-gray-600';
                            let icon = null;
                            if (isActualCorrect) {
                              style = 'font-bold text-emerald-700 bg-emerald-100 rounded px-2 py-0.5';
                              icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline ml-1" />;
                            } else if (isUserChoice && !isActualCorrect) {
                              style = 'font-bold text-red-700 bg-red-100 rounded px-2 py-0.5 line-through';
                              icon = <X className="w-3.5 h-3.5 text-red-600 inline ml-1" />;
                            }
                            return (
                              <div key={optIdx} className={`text-xs ${style}`}>
                                {String.fromCharCode(65 + optIdx)}. {opt} {icon}
                              </div>
                            );
                          })}
                        </div>
                        <div className="text-xs text-gray-700 bg-white/50 p-2 rounded border border-gray-200">
                          <strong>Explanation:</strong> {q.explanation}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {strongSkills.length > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-emerald-900">Your Strengths</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {strongSkills.map(s => (
                  <span key={s} className="px-2.5 py-1 bg-white border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-lg">
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Retake */}
          <button
            onClick={() => { setPhase('setup'); setQuestions([]); setAnswers({}); setResult(null); }}
            className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Retake Test
          </button>
        </div>
      </div>
    );
  }

  // ── Phase: Learning Path ───────────────────────────────────────────────────────
  if (phase === 'learning-path') {
    return (
      <div className="min-h-screen bg-gray-50 py-6 px-4">
        <div className="max-w-2xl mx-auto space-y-5 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPhase('results')}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Results
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Personalized Learning Path</p>
                <h2 className="text-lg font-bold text-gray-900">{selectedSkill}</h2>
              </div>
            </div>

            {loadingPath ? (
              <div className="py-8 flex flex-col items-center gap-3">
                <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                <p className="text-sm text-gray-500">Generating your personalized learning path...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {learningPath.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 border border-indigo-300 flex items-center justify-center text-xs font-bold text-indigo-700 shrink-0">
                        {i + 1}
                      </div>
                      {i < learningPath.length - 1 && <div className="w-px flex-1 bg-indigo-100 mt-1" />}
                    </div>
                    <div className="pb-4 flex-1">
                      <div className="bg-gray-50 rounded-xl border border-gray-100 p-3.5">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-bold text-gray-900">{item.topic}</p>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            item.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-700' :
                            item.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-700' :
                            'bg-indigo-50 text-indigo-700'
                          }`}>
                            {item.difficulty}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{item.whyImportant}</p>
                        <p className="text-[11px] text-gray-400 mt-1">~{item.estimatedHours}h estimated</p>
                      </div>
                    </div>
                  </div>
                ))}
                {learningPath.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">Could not load learning path. Please retry.</p>
                )}
              </div>
            )}
          </div>

          {!loadingPath && learningPath.length > 0 && (
            <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
              <ArrowRight className="w-4 h-4" /> Add to Career Plan
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
};
