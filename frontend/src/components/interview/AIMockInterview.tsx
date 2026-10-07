import React, { useState, useRef, useEffect } from 'react';
import {
  Mic, MicOff, Type, ChevronRight, Loader2, X, CheckCircle2,
  AlertTriangle, Star, BookOpen, ArrowRight,
  RotateCcw, ChevronLeft, Zap, User,
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
    setDomain(DOMAINS[role]?.[0] || '');
  }, [role]);

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
      <div className="min-h-screen bg-slate-50/70 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-3xl bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden animate-fade-in-up">
          <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-indigo-800 p-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <Mic className="w-6 h-6" />
                <span className="text-xs font-black uppercase tracking-wider opacity-90">CareerIQ Simulator</span>
              </div>
              {onClose && (
                <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors"><X className="w-5 h-5" /></button>
              )}
            </div>
            <h1 className="text-3xl font-black">AI Technical Mock Interview</h1>
            <p className="text-purple-100 text-sm sm:text-base mt-2">
              Practice a realistic technical interview tailored to your target role and resume credentials.
            </p>
          </div>

          <div className="p-8 space-y-6">
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 flex items-start gap-2.5 font-medium">
                <AlertTriangle className="w-5 h-5 shrink-0" /> {error}
              </div>
            )}

            {/* Role */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">Target Job Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm sm:text-base font-semibold text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-xs"
              >
                {JOB_ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>

            {/* Domain */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">Interview Domain</label>
              <div className="flex flex-wrap gap-2.5">
                {domains.map(d => (
                  <button
                    key={d}
                    onClick={() => setDomain(d)}
                    className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                      domain === d
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-400 shadow-xs'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Interview type + difficulty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">Interview Type</label>
                <div className="space-y-2">
                  {(['Technical', 'Behavioral', 'Mixed'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setInterviewType(t)}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold text-left transition-all ${
                        interviewType === t
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-400'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">Difficulty</label>
                <div className="space-y-2">
                  {(['Basic', 'Intermediate', 'Advanced'] as const).map(d => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold text-left transition-all ${
                        difficulty === d
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-400'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
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
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-bold text-gray-700">
                  Number of Questions
                </label>
                <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200">
                  {numQuestions} Questions
                </span>
              </div>
              <input
                type="range" min={5} max={15} value={numQuestions}
                onChange={e => setNumQuestions(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer h-2 bg-gray-200 rounded-lg"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>5 (Quick)</span><span>10 (Standard)</span><span>15 (Deep)</span>
              </div>
            </div>

            {user && (
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs sm:text-sm text-indigo-800 flex items-start gap-3">
                <User className="w-4 h-4 shrink-0 mt-0.5 text-indigo-600" />
                <span>
                  Resume context detected — questions will reference your verified background as <strong>{user.currentRole}</strong>.
                </span>
              </div>
            )}

            <button
              onClick={startInterview}
              disabled={!domain}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all"
            >
              <Zap className="w-5 h-5" /> Start Live Interview Simulation
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Phase: Generating ─────────────────────────────────────────────────────────
  if (phase === 'generating') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl max-w-lg w-full text-center space-y-5 animate-fade-in-up">
          <div className="w-20 h-20 rounded-3xl bg-indigo-50 border border-indigo-200 flex items-center justify-center mx-auto shadow-inner">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Preparing your {domain} interview...</h2>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
            AI is analyzing {role} market benchmarks and generating {numQuestions} customized technical evaluation challenges.
          </p>
        </div>
      </div>
    );
  }

  // ── Phase: Interview ──────────────────────────────────────────────────────────
  if (phase === 'interview' && questions.length > 0) {
    const q = questions[currentIdx];
    const answered = answers.length;

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20 shadow-2xs">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center">
                <Mic className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{role} · {domain}</p>
                <p className="text-xs text-gray-500 font-medium">Question {currentIdx + 1} of {questions.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold px-3 py-1 rounded-lg border border-purple-200 bg-purple-50 text-purple-700">
                {difficulty}
              </span>
              {onClose && (
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          <div className="max-w-4xl mx-auto mt-3">
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-300" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-6">
            {/* Question card */}
            <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm p-6 sm:p-8">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="text-xs font-black text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-lg uppercase tracking-wider">
                  Question {currentIdx + 1}
                </span>
                <span className="text-xs font-semibold text-gray-500">{q.domain}</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 leading-relaxed">{q.question}</p>
            </div>

            {/* Answer mode switch */}
            <div className="flex gap-3">
              <button
                onClick={() => setAnswerMode('text')}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-bold transition-all ${
                  answerMode === 'text'
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                    : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'
                }`}
              >
                <Type className="w-4 h-4" /> Type Answer
              </button>
              <button
                onClick={() => setAnswerMode('voice')}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-bold transition-all ${
                  answerMode === 'voice'
                    ? 'bg-purple-600 border-purple-600 text-white shadow-sm'
                    : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'
                }`}
              >
                <Mic className="w-4 h-4" /> Speak Answer
              </button>
            </div>

            {/* Text mode */}
            {answerMode === 'text' && (
              <textarea
                value={currentAnswer}
                onChange={e => setCurrentAnswer(e.target.value)}
                placeholder="Explain your approach, tradeoffs, and key concepts thoroughly..."
                rows={7}
                className="w-full p-5 border border-gray-300 rounded-2xl text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/20 resize-none font-medium shadow-xs"
              />
            )}

            {/* Voice mode */}
            {answerMode === 'voice' && (
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 space-y-6">
                <div className="flex flex-col items-center gap-4">
                  <button
                    onClick={isListening ? stopListening : startListening}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${
                      isListening
                        ? 'bg-rose-500 hover:bg-rose-600 animate-pulse ring-4 ring-rose-200'
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    {isListening ? <MicOff className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
                  </button>
                  <p className="text-sm font-bold text-gray-700">
                    {isListening ? '🔴 Recording speech... (tap button to finish)' : 'Tap microphone to speak your answer'}
                  </p>
                </div>

                {transcript && (
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Transcribed Answer:</p>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-base text-gray-800 leading-relaxed font-medium">
                      {transcript}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => { setTranscript(''); setCurrentAnswer(''); }}
                        className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50"
                      >
                        Clear & Re-record
                      </button>
                      <button
                        onClick={() => setAnswerMode('text')}
                        className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50"
                      >
                        Edit in Text Mode
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Submit & Next Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  if (currentIdx > 0) setCurrentIdx(i => i - 1);
                }}
                disabled={currentIdx === 0}
                className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setCurrentAnswer('');
                    setTranscript('');
                    if (currentIdx < questions.length - 1) setCurrentIdx(i => i + 1);
                    else finishInterview(answers);
                  }}
                  className="px-5 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 shadow-xs"
                >
                  Skip Question
                </button>
                <button
                  onClick={submitAnswer}
                  disabled={!currentAnswer.trim()}
                  className={`flex items-center gap-2 px-7 py-3 rounded-xl text-sm sm:text-base font-bold text-white transition-all shadow-md disabled:opacity-40 ${
                    currentIdx < questions.length - 1
                      ? 'bg-indigo-600 hover:bg-indigo-700'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {currentIdx < questions.length - 1 ? (
                    <><ChevronRight className="w-4 h-4" /> Save & Next</>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4" /> Finish & Evaluate</>
                  )}
                </button>
              </div>
            </div>

            {answered > 0 && (
              <p className="text-center text-xs sm:text-sm text-gray-500 font-medium">{answered} of {questions.length} responses recorded</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Phase: Evaluating ─────────────────────────────────────────────────────────
  if (phase === 'evaluating') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl max-w-lg w-full text-center space-y-5 animate-fade-in-up">
          <div className="w-20 h-20 rounded-3xl bg-indigo-50 border border-indigo-200 flex items-center justify-center mx-auto shadow-inner">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Evaluating your interview responses...</h2>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
            AI is scoring technical depth, communication clarity, and problem-solving reasoning against industry rubric benchmarks.
          </p>
        </div>
      </div>
    );
  }

  // ── Phase: Results ─────────────────────────────────────────────────────────────
  if (phase === 'results') {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in-up">
          {/* Hero */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-indigo-900 p-8 sm:p-10 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-2">CareerIQ Evaluation Report</p>
                  <h1 className="text-5xl sm:text-6xl font-black font-numeric">
                    {evaluation?.overallScore ?? '—'}
                    <span className="text-2xl sm:text-3xl opacity-70 font-bold">/100</span>
                  </h1>
                  <p className="text-purple-100 text-base sm:text-lg mt-2 font-medium">{role} · {domain} Interview</p>
                </div>
                {onClose && (
                  <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors"><X className="w-5 h-5" /></button>
                )}
              </div>
            </div>

            {evaluation && (
              <div className="p-6 sm:p-8 space-y-6">
                {/* Score grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Technical Accuracy', value: evaluation.technicalScore },
                    { label: 'Communication Clarity', value: evaluation.communicationScore },
                    { label: 'Problem Solving Depth', value: evaluation.problemSolvingScore },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-center">
                      <p className="text-3xl font-black text-slate-900 font-numeric">{value}%</p>
                      <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Detailed feedback */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-6 text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                  {evaluation.detailedFeedback}
                </div>
              </div>
            )}
          </div>

          {evaluation && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
                  <Star className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-lg font-bold text-gray-900">What You Did Well</h2>
                </div>
                <div className="space-y-3">
                  {evaluation.strengths.map((s, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weaknesses */}
              <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h2 className="text-lg font-bold text-gray-900">Where to Improve</h2>
                </div>
                <div className="space-y-3">
                  {evaluation.weaknesses.map((w, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill scores */}
              {Object.keys(evaluation.skillScores).length > 0 && (
                <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm p-6 sm:p-8 space-y-4 md:col-span-2">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">Technical Competency Breakdown</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {Object.entries(evaluation.skillScores).map(([skill, score]) => (
                      <div key={skill} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-bold text-gray-800">{skill}</span>
                          <span className={`text-sm font-black font-numeric ${score < 60 ? 'text-amber-600' : 'text-emerald-600'}`}>{score}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
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
                <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm p-6 sm:p-8 space-y-5 md:col-span-2">
                  <h2 className="text-lg font-bold text-gray-900">Targeted Mastery Progression</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {evaluation.improvementPlan.map((plan, i) => (
                      <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                        <p className="text-sm font-bold text-indigo-700 mb-2.5">{plan.skill}</p>
                        <div className="space-y-2 pl-3 border-l-2 border-indigo-300">
                          {plan.steps.map((step, j) => (
                            <div key={j} className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 font-medium">
                              <ArrowRight className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Retake */}
          <button
            onClick={() => { setPhase('setup'); setQuestions([]); setAnswers([]); setEvaluation(null); }}
            className="w-full py-4 bg-white border border-gray-300 text-gray-800 rounded-2xl text-base font-bold hover:bg-gray-50 flex items-center justify-center gap-2.5 shadow-sm transition-all"
          >
            <RotateCcw className="w-5 h-5 text-indigo-600" /> Start Another Interview Simulation
          </button>
        </div>
      </div>
    );
  }

  return null;
};
