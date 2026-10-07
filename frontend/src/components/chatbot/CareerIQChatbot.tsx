import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare, X, Send, Loader2, Brain, ChevronDown,
  Zap, BarChart2, Target, Mic, MapPin, Briefcase, BookOpen,
} from 'lucide-react';
import { aiService, ChatMessage } from '../../services/aiService';
import { UserProfile } from '../../types';

interface CareerIQChatbotProps {
  user: UserProfile | null;
  testResult?: { totalScore: number; weakSkills: string[] } | null;
  interviewResult?: { overallScore: number; weaknesses: string[] } | null;
  isOpenOverride?: boolean;
  onToggleOverride?: (val: boolean) => void;
}

const QUICK_ACTIONS = [
  { icon: Zap, label: 'What should I improve?', query: 'Based on my profile and results, what should I focus on improving first?' },
  { icon: Brain, label: 'My weak skills', query: 'What are my weakest skills and why do they matter for my target role?' },
  { icon: BarChart2, label: 'My test result', query: 'Analyze my mock test performance and explain what it means for my career readiness.' },
  { icon: Mic, label: 'My interview score', query: 'Explain my mock interview results and what I should practice next.' },
  { icon: Target, label: 'My career path', query: 'What career path makes most sense for my background and target role?' },
  { icon: MapPin, label: 'Best location', query: 'Which location offers the best opportunities for my target role given my current skills?' },
  { icon: Briefcase, label: 'Job matches', query: 'Which jobs match my current profile and which ones should I target first?' },
  { icon: BookOpen, label: 'What to learn next', query: 'Give me a specific learning plan for this week to improve my career readiness.' },
];

export const CareerIQChatbot: React.FC<CareerIQChatbotProps> = ({ user, testResult, interviewResult, isOpenOverride, onToggleOverride }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = isOpenOverride !== undefined ? isOpenOverride : internalIsOpen;
  
  const toggleOpen = (val?: boolean) => {
    const nextVal = val !== undefined ? val : !isOpen;
    if (onToggleOverride) onToggleOverride(nextVal);
    else setInternalIsOpen(nextVal);
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, messages]);

  const buildUserContext = () => ({
    name: user?.name ?? 'User',
    currentRole: user?.currentRole ?? 'Not set',
    targetRole: user?.targetRole ?? 'Not set',
    skills: user?.skills.map(s => s.name) ?? [],
    careerReadiness: user?.careerReadiness ?? 0,
    criticalSkillGapsCount: user?.criticalSkillGapsCount ?? 0,
    testResult: testResult ?? null,
    interviewResult: interviewResult ?? null,
  });

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setError(null);

    const userMsg: ChatMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const reply = await aiService.careerChat(updatedMessages, buildUserContext());
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (e: any) {
      setError('CareerIQ AI is temporarily unavailable. Please retry.');
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (query: string) => {
    sendMessage(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => toggleOpen()}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-2xl shadow-xl flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-slate-900 hover:bg-slate-800 ring-4 ring-indigo-200'
            : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-400/40 hover:scale-105'
        }`}
        aria-label="CareerIQ Assistant"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageSquare className="w-7 h-7 text-white" />
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-26 right-6 z-50 w-[420px] sm:w-[460px] max-w-[calc(100vw-32px)] bg-white rounded-3xl border border-gray-200 shadow-2xl flex flex-col overflow-hidden animate-fade-in-up"
          style={{ height: 'min(680px, calc(100vh - 130px))' }}>

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 px-5 py-4 flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shadow-inner">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-base font-bold text-white leading-tight">CareerIQ Assistant</p>
                <p className="text-xs text-indigo-200 font-medium">Empirical career advisor</p>
              </div>
            </div>
            <button
              onClick={() => toggleOpen(false)}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <ChevronDown className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0 bg-slate-50/50">
            {/* Welcome state */}
            {messages.length === 0 && (
              <div className="space-y-4">
                <div className="bg-indigo-50 border border-indigo-200/80 rounded-2xl p-4 shadow-2xs">
                  <p className="text-sm text-indigo-950 leading-relaxed font-medium">
                    Hi{user ? ` ${user.name.split(' ')[0]}` : ''}! 👋 I'm your CareerIQ Assistant. I can help you understand your career readiness, skill gaps, test results, and what to do next — using only your verified profile data.
                  </p>
                </div>

                {/* Quick action buttons */}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">Suggested Prompts</p>
                  <div className="grid grid-cols-2 gap-2">
                    {QUICK_ACTIONS.slice(0, 6).map(({ icon: Icon, label, query }) => (
                      <button
                        key={label}
                        onClick={() => handleQuickAction(query)}
                        className="flex items-center gap-2 p-2.5 text-left rounded-xl border border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/70 transition-all text-xs font-bold text-gray-700 shadow-2xs"
                      >
                        <Icon className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="line-clamp-1">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Message thread */}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 mr-2.5 mt-0.5 shadow-2xs">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-xs shadow-sm font-medium'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-xs shadow-2xs font-medium'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-xs px-4 py-3 flex items-center gap-2.5 shadow-2xs">
                  <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">Analyzing your CareerIQ profile...</span>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs sm:text-sm text-rose-700 font-medium">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-gray-200 p-4 bg-white shrink-0 space-y-2">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your skills, readiness, benchmarks..."
                className="flex-1 text-sm px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 placeholder:text-gray-400 font-medium"
                disabled={loading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="w-11 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-sm shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-gray-400 text-center font-medium">
              Powered by local CareerIQ models & real-time datasets
            </p>
          </div>
        </div>
      )}
    </>
  );
};
