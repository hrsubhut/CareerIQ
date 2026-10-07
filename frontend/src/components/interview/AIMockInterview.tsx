import React, { useState, useRef, useEffect } from 'react';
import {
  Mic, MicOff, Type, ChevronRight, Loader2, X, CheckCircle2,
  AlertTriangle, Star, BarChart2, BookOpen, ArrowRight,
  RotateCcw, Volume2, ChevronLeft, Zap, User, Brain,
} from 'lucide-react';
import {
  aiService, InterviewQuestion, InterviewAnswer, InterviewEvaluation,
} from '../../services/aiService';
import { UserProfile } from '../../types';

// ─── Config ───────────────────────────────────────────────────────────────────

const JOB_ROLES = ['Data Scientist', 'Data Analyst', 'ML Engineer', 'Data Engineer', 'AI Engineer', 'Software Engineer', 'Business Analyst'];

const DOMAINS: Record<string, string[]> = {
  'Data Scientist': ['Machine Learning', 'Python', 'SQL', 'Statistics', 'Deep Learning', 'Behavioral'],
  'Data Analyst': ['SQL', 'Python', 'Excel', 'Data Visualization', 'Statistics', 'Behavioral'],
  'ML Engineer': ['Machine Learning', 'Python', 'System Design', 'MLOps', 'Deep Learning', 'Behavioral'],
  'Data Engineer': ['SQL', 'Python', 'ETL', 'Data Pipelines', 'Cloud', 'Behavioral'],
  'AI Engineer': ['LLMs', 'Python', 'Deep Learning', 'NLP', 'System Design', 'Behavioral'],
  'Software Engineer': ['Data Structures', 'Algorithms', 'System Design', 'Python', 'Databases', 'Behavioral'],
  'Business Analyst': ['SQL', 'Business Intelligence', 'Data Analysis', 'Communication', 'Stakeholder Management', 'Behavioral'],
};

type Phase = 'setup' | 'generating' | 'interview' | 'evaluating' | 'results';
type AnswerMode = 'text' | 'voice';

interface AIMockInterviewProps {
  defaultRole?: string;
  user?: UserProfile | null;
  onClose?: () => void;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export const AIMockInterview: React.FC<AIMockInterviewProps> = ({ defaultRole, user, onClose }) => {
  const [phase, setPhase] = useState<Phase>('setup');
  const [role, setRole] = useState(defaultRole || 'Data Scientist');
  const [domain, setDomain] = useState('');
  const [interviewType, setInterviewType] = useState<'Technical' | 'Behavioral' | 'Mixed'>('Technical');
  const [difficulty, setDifficulty] = useState<'Basic' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [numQuestions, setNumQuestions] = useState(8);

  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<InterviewAnswer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answerMode, setAnswerMode] = useState<AnswerMode>('text');
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Voice
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Set default domain when role changes
    setDomain(DOMAINS[role]?.[0] || '');
  }, [role]);

  // Build resume context from user profile
  const buildResumeContext = () => {
    if (!user) return undefined;
    const skillStr = user.skills.map(s => s.name).join(', ');
    return `Name: ${user.name}, Current Role: ${user.currentRole}, Experience: ${user.yearsOfExperience} years, Skills: ${skillStr}, Education: ${user.education}`;
  };

  const startInterview = async () => {
    setError(null);
    setPhase('generating');
    try {
      const qs = await aiService.generateInterviewQuestions(
        role, domain, difficulty, interviewType, numQuestions, buildResumeContext()
      );
      if (!qs || qs.length === 0) throw new Error('No questions generated. Please retry.');
      setQuestions(qs);
      setAnswers([]);
      setCurrentIdx(0);
      setCurrentAnswer('');
      setPhase('interview');
    } catch (e: any) {
      setError(e.message || 'Failed to generate interview. Please retry.');
      setPhase('setup');
    }
  };

  const submitAnswer = () => {
    if (!currentAnswer.trim()) return;
    const q = questions[currentIdx];
    const newAnswer: InterviewAnswer = {
      questionId: q.id,
      question: q.question,
      domain: q.domain,
      answer: currentAnswer.trim(),
    };
    const updatedAnswers = [...answers.filter(a => a.questionId !== q.id), newAnswer];
    setAnswers(updatedAnswers);
    setCurrentAnswer('');
    setTranscript('');

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      finishInterview(updatedAnswers);
    }
  };

  const finishInterview = async (finalAnswers: InterviewAnswer[]) => {
    setPhase('evaluating');
    try {
      const eval_ = await aiService.evaluateInterview(role, domain, finalAnswers);
      setEvaluation(eval_);
      setPhase('results');
    } catch (e: any) {
      setError('AI evaluation failed. Your answers are saved.');
      setPhase('results');
    }
  };

  // Voice recognition
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice recognition not supported in this browser. Please use Chrome.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    recognition.onresult = (e: any) => {
      let text = '';
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      setTranscript(text);
      setCurrentAnswer(text);
    };
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  // ── Phase: Setup ───────────────────────────────────────────────────────────────
  if (phase === 'setup') {
    const domains = DOMAINS[role] || [];
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-xl bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in-up">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">CareerIQ</span>
              </div>
              {onClose && (
                <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg"><X className="w-4 h-4" /></button>
              )}
            </div>
            <h1 className="text-2xl font-bold">AI Mock Interview</h1>
            <p className="text-purple-200 text-sm mt-1">Practice a realistic technical interview for your target role</p>
          </div>

          <div className="p-6 space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            {/* Role */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Target Job Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              >
                {JOB_ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>

            {/* Domain */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Interview Domain</label>
              <div className="flex flex-wrap gap-2">
                {domains.map(d => (
                  <button
                    key={d}
                    onClick={() => setDomain(d)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      domain === d
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-400'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Interview type + difficulty */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Interview Type</label>
                <div className="space-y-1.5">
                  {(['Technical', 'Behavioral', 'Mixed'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setInterviewType(t)}
                      className={`w-full px-3 py-2 rounded-lg border text-xs font-semibold text-left transition-all ${
                        interviewType === t
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Difficulty</label>
                <div className="space-y-1.5">
                  {(['Basic', 'Intermediate', 'Advanced'] as const).map(d => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`w-full px-3 py-2 rounded-lg border text-xs font-semibold text-left transition-all ${
                        difficulty === d
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Number of questions */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Number of Questions: <span className="text-indigo-600">{numQuestions}</span>
              </label>
              <input
                type="range" min={5} max={15} value={numQuestions}
                onChange={e => setNumQuestions(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                <span>5</span><span>15</span>
              </div>
            </div>

            {user && (
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-700 flex items-start gap-2">
                <User className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                Resume context detected — interview will reference your experience as <strong>{user.currentRole}</strong>
              </div>
            )}

            <button
              onClick={startInterview}
              disabled={!domain}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Zap className="w-4 h-4" /> Start Interview
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
          <div className="w-16 h-16 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center mx-auto">
            <Loader2 className="w-7 h-7 text-purple-600 animate-spin" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Preparing your {domain} interview...</h2>
          <p className="text-sm text-gray-500">AI is crafting {numQuestions} role-specific questions for {role}</p>
        </div>
      </div>
    );
  }

  // ── Phase: Interview ──────────────────────────────────────────────────────────
  if (phase === 'interview' && questions.length > 0) {
    const q = questions[currentIdx];
    const answered = answers.length;

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Mic className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-xs font-bold text-gray-900">{role} · {domain}</p>
                <p className="text-[11px] text-gray-500">Question {currentIdx + 1} of {questions.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-purple-200 bg-purple-50 text-purple-700">
                {difficulty}
              </span>
              {onClose && (
                <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
              )}
            </div>
          </div>
          <div className="max-w-2xl mx-auto mt-2">
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-600 rounded-full transition-all" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-4">
            {/* Question card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Question {currentIdx + 1}
                </span>
                <span className="text-[10px] text-gray-500">{q.domain}</span>
              </div>
              <p className="text-base font-semibold text-gray-900 leading-relaxed">{q.question}</p>
            </div>

            {/* Answer mode switch */}
            <div className="flex gap-2">
              <button
                onClick={() => setAnswerMode('text')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  answerMode === 'text'
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Type className="w-3.5 h-3.5" /> Type Answer
              </button>
              <button
                onClick={() => setAnswerMode('voice')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  answerMode === 'voice'
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Mic className="w-3.5 h-3.5" /> Speak Answer
              </button>
            </div>

            {/* Text mode */}
            {answerMode === 'text' && (
              <textarea
                value={currentAnswer}
                onChange={e => setCurrentAnswer(e.target.value)}
                placeholder="Explain your answer clearly and concisely..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none"
              />
            )}

            {/* Voice mode */}
            {answerMode === 'voice' && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
                <div className="flex flex-col items-center gap-4">
                  <button
                    onClick={isListening ? stopListening : startListening}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-md ${
                      isListening
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    {isListening ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
                  </button>
                  <p className="text-xs text-gray-500 font-medium">
                    {isListening ? '🔴 Listening... (tap to stop)' : 'Tap to start speaking'}
                  </p>
                </div>

                {transcript && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-700">Your answer:</p>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 leading-relaxed">
                      {transcript}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setTranscript(''); setCurrentAnswer(''); }}
                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50"
                      >
                        Re-record
                      </button>
                      <button
                        onClick={() => setAnswerMode('text')}
                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50"
                      >
                        Edit as text
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Submit */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  if (currentIdx > 0) setCurrentIdx(i => i - 1);
                }}
                disabled={currentIdx === 0}
                className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCurrentAnswer('');
                    setTranscript('');
                    if (currentIdx < questions.length - 1) setCurrentIdx(i => i + 1);
                    else finishInterview(answers);
                  }}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Skip
                </button>
                <button
                  onClick={submitAnswer}
                  disabled={!currentAnswer.trim()}
                  className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold text-white transition-colors disabled:opacity-40 ${
                    currentIdx < questions.length - 1
                      ? 'bg-indigo-600 hover:bg-indigo-700'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {currentIdx < questions.length - 1 ? (
                    <><ChevronRight className="w-3.5 h-3.5" /> Next Question</>
                  ) : (
                    <><CheckCircle2 className="w-3.5 h-3.5" /> Finish Interview</>
                  )}
                </button>
              </div>
            </div>

            {answered > 0 && (
              <p className="text-center text-xs text-gray-400">{answered} answer{answered > 1 ? 's' : ''} recorded</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Phase: Evaluating ─────────────────────────────────────────────────────────
  if (phase === 'evaluating') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center justify-center mx-auto">
            <Loader2 className="w-7 h-7 text-indigo-600 animate-spin" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Analyzing your responses...</h2>
          <p className="text-sm text-gray-500">AI is evaluating your answers across technical, communication, and problem-solving dimensions</p>
        </div>
      </div>
    );
  }

  // ── Phase: Results ─────────────────────────────────────────────────────────────
  if (phase === 'results') {
    return (
      <div className="min-h-screen bg-gray-50 py-6 px-4">
        <div className="max-w-2xl mx-auto space-y-5 animate-fade-in-up">
          {/* Hero */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider opacity-75 mb-1">CareerIQ · Interview Result</p>
                  <h1 className="text-4xl font-bold">{evaluation?.overallScore ?? '—'}<span className="text-2xl opacity-60">/100</span></h1>
                  <p className="text-purple-200 text-sm mt-1">{role} · {domain} Interview</p>
                </div>
                {onClose && (
                  <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg"><X className="w-4 h-4" /></button>
                )}
              </div>
            </div>

            {evaluation && (
              <div className="p-5">
                {/* Score grid */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: 'Technical', value: evaluation.technicalScore },
                    { label: 'Communication', value: evaluation.communicationScore },
                    { label: 'Problem Solving', value: evaluation.problemSolvingScore },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center">
                      <p className="text-xl font-bold text-gray-900 font-numeric">{value}%</p>
                      <p className="text-[11px] text-gray-500">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Detailed feedback */}
                <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 text-sm text-gray-700 leading-relaxed">
                  {evaluation.detailedFeedback}
                </div>
              </div>
            )}
          </div>

          {evaluation && (
            <>
              {/* Strengths */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-emerald-600" />
                  <h2 className="text-sm font-bold text-gray-900">What You Did Well</h2>
                </div>
                <div className="space-y-2">
                  {evaluation.strengths.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              {/* Weaknesses */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <h2 className="text-sm font-bold text-gray-900">Where to Improve</h2>
                </div>
                <div className="space-y-2">
                  {evaluation.weaknesses.map((w, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      {w}
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill scores */}
              {Object.keys(evaluation.skillScores).length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                  <h2 className="text-sm font-bold text-gray-900 mb-4">Skill Performance</h2>
                  <div className="space-y-3">
                    {Object.entries(evaluation.skillScores).map(([skill, score]) => (
                      <div key={skill}>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-semibold text-gray-800">{skill}</span>
                          <span className={`text-xs font-bold font-numeric ${score < 60 ? 'text-amber-600' : 'text-emerald-600'}`}>{score}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${score < 60 ? 'bg-amber-400' : 'bg-emerald-500'}`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Improvement plan */}
              {evaluation.improvementPlan?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                  <h2 className="text-sm font-bold text-gray-900 mb-4">Your Recommended Improvement Path</h2>
                  <div className="space-y-4">
                    {evaluation.improvementPlan.map((plan, i) => (
                      <div key={i}>
                        <p className="text-xs font-bold text-indigo-700 mb-2">{plan.skill}</p>
                        <div className="space-y-1.5 pl-3 border-l-2 border-indigo-200">
                          {plan.steps.map((step, j) => (
                            <div key={j} className="flex items-center gap-2 text-xs text-gray-700">
                              <ArrowRight className="w-3 h-3 text-indigo-400 shrink-0" />
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors">
                    <BookOpen className="w-3.5 h-3.5" /> Add to Career Plan
                  </button>
                </div>
              )}
            </>
          )}

          {/* Retake */}
          <button
            onClick={() => { setPhase('setup'); setQuestions([]); setAnswers([]); setEvaluation(null); }}
            className="w-full py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Start New Interview
          </button>
        </div>
      </div>
    );
  }

  return null;
};
