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
      <div className="max-w-3xl mx-auto py-12 px-6">
        <button onClick={onClose} className="text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <div className="bg-[#111827] text-white p-8 rounded-2xl border border-gray-800 shadow-2xl">
          <h1 className="text-3xl font-bold mb-4">Technical Assessment: {role}</h1>
          <p className="text-gray-400 mb-8">
            This assessment contains exactly 30 multiple-choice questions curated for your role. You have 30 minutes to complete it.
          </p>
          <div className="flex gap-4 mb-8">
            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 flex-1">
              <Clock className="w-6 h-6 text-indigo-400 mb-2" />
              <p className="text-sm text-gray-300">30 Minutes</p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 flex-1">
              <AlertCircle className="w-6 h-6 text-amber-400 mb-2" />
              <p className="text-sm text-gray-300">No pausing</p>
            </div>
          </div>
          <button onClick={startTest} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors">
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'test' && questions.length > 0) {
    const q = questions[currentQ];
    return (
      <div className="max-w-4xl mx-auto py-8 px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 bg-[#111827] p-4 rounded-xl border border-gray-800 shadow-lg text-white">
          <h2 className="font-bold text-lg">{role} Assessment</h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-indigo-400 font-numeric text-lg">
              <Clock className="w-5 h-5" />
              {formatTime(timeLeft)}
            </div>
            <button onClick={handleSubmit} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg transition-colors">
              Submit Test
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Question {currentQ + 1} of 30</span>
            <span>{Math.round(((currentQ + 1) / 30) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${((currentQ + 1) / 30) * 100}%` }} />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase rounded border border-indigo-100">{q.skill}</span>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded">{q.difficulty}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-8 leading-relaxed">{q.question}</h3>
          
          <div className="space-y-3">
            {q.options.map((opt, idx) => {
              const isSelected = answers[currentQ] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setAnswers(prev => ({ ...prev, [currentQ]: idx }))}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${
                    isSelected ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                  }`}
                >
                  <span className={`text-sm ${isSelected ? 'text-indigo-900 font-semibold' : 'text-gray-700'}`}>{opt}</span>
                  {isSelected && <CheckCircle className="w-5 h-5 text-indigo-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentQ(prev => Math.max(0, prev - 1))}
            disabled={currentQ === 0}
            className="px-6 py-2.5 rounded-lg border border-gray-300 font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          
          <div className="flex gap-1 overflow-x-auto max-w-[50%] px-4 hide-scrollbar">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQ(idx)}
                className={`w-8 h-8 shrink-0 rounded-full text-xs font-bold transition-colors ${
                  currentQ === idx ? 'bg-indigo-600 text-white ring-2 ring-indigo-200 ring-offset-1' :
                  answers[idx] !== undefined ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
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
            className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
          >
            {currentQ === questions.length - 1 ? 'Submit Test' : 'Next'}
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'results' && result) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-6 animate-fade-in-up">
        <button onClick={onClose} className="text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="bg-[#111827] text-white p-8 rounded-2xl border border-gray-800 shadow-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Assessment Complete</h1>
            <p className="text-gray-400">Here is your technical breakdown for {role}</p>
          </div>
          <div className="text-right flex items-center gap-6">
             <div className="text-center">
               <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Score</p>
               <p className="text-4xl font-bold text-white">{result.overallScore}%</p>
             </div>
             <div className="w-px h-12 bg-gray-700" />
             <div className="text-center">
               <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Correct</p>
               <p className="text-4xl font-bold text-indigo-400">{result.correctAnswers}/{result.totalQuestions}</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
           <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Skill Performance</h3>
              <div className="space-y-4">
                {Object.entries(result.skillScores).map(([skill, score]) => (
                  <div key={skill}>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-gray-700">{skill}</span>
                      <span className={score >= 80 ? 'text-emerald-600' : 'text-amber-600'}>{score}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full">
                      <div className={`h-full rounded-full ${score >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
           </div>

           <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl">
                <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">Strongest Skills</h3>
                <p className="text-emerald-900 font-medium">
                  {result.strongSkills.length > 0 ? result.strongSkills.join(', ') : 'Needs more practice overall.'}
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl">
                <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Priority Gaps</h3>
                <p className="text-amber-900 font-medium mb-3">
                  {result.weakSkills.length > 0 ? result.weakSkills.join(', ') : 'None! Great job.'}
                </p>
                {result.weakSkills.length > 0 && (
                  <p className="text-sm text-amber-700">
                    Your {role} fundamentals are mostly solid, but <strong>{result.weakSkills[0]}</strong> is currently your biggest skill gap. Focus on those fundamentals before retaking.
                  </p>
                )}
              </div>
           </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-4">Detailed Review</h3>
        <div className="space-y-4">
          {questions.map((q, idx) => {
            const isCorrect = answers[idx] === q.correctAnswer;
            return (
              <div key={idx} className={`p-5 rounded-xl border ${isCorrect ? 'bg-emerald-50/50 border-emerald-100' : 'bg-red-50/50 border-red-100'}`}>
                <div className="flex items-start gap-3">
                   <div className="mt-0.5">
                     {isCorrect ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
                   </div>
                   <div>
                     <p className="text-sm font-bold text-gray-900 mb-2">Q{idx + 1}. {q.question}</p>
                     <p className="text-xs text-gray-600 mb-2">
                       Your Answer: <span className="font-semibold">{q.options[answers[idx]] || 'Not answered'}</span>
                     </p>
                     {!isCorrect && (
                       <p className="text-xs text-gray-800 mb-2 bg-white p-2 rounded border border-gray-200 shadow-sm inline-block">
                         Correct Answer: <span className="font-semibold text-emerald-700">{q.options[q.correctAnswer]}</span>
                       </p>
                     )}
                     <p className="text-xs text-gray-500 mt-2 bg-gray-100/80 p-2 rounded">{q.explanation}</p>
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
