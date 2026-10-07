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
      // Remove the user message on error so they can retry
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
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-gray-800 hover:bg-gray-700'
            : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-300/50'
        }`}
        aria-label="CareerIQ Assistant"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <MessageSquare className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-24px)] bg-white rounded-2xl border border-gray-200 shadow-2xl flex flex-col overflow-hidden animate-fade-in-up"
          style={{ maxHeight: 'min(620px, calc(100vh - 120px))' }}>

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">CareerIQ Assistant</p>
                <p className="text-[11px] text-indigo-200">Personalized career guidance</p>
              </div>
            </div>
            <button
              onClick={() => toggleOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronDown className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0">
            {/* Welcome state */}
            {messages.length === 0 && (
              <div className="space-y-3">
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                  <p className="text-xs text-indigo-900 leading-relaxed">
                    Hi{user ? ` ${user.name.split(' ')[0]}` : ''}! 👋 I'm your CareerIQ Assistant. I can help you understand your career readiness, skill gaps, test results, and what to do next — using only your actual CareerIQ data.
                  </p>
                </div>

                {/* Quick action buttons */}
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Quick Actions</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {QUICK_ACTIONS.slice(0, 6).map(({ icon: Icon, label, query }) => (
                      <button
                        key={label}
                        onClick={() => handleQuickAction(query)}
                        className="flex items-center gap-1.5 p-2 text-left rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-[11px] font-medium text-gray-700"
                      >
                        <Icon className="w-3 h-3 text-indigo-500 shrink-0" />
                        {label}
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
                  <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 mr-2 mt-0.5">
                    <Brain className="w-3 h-3 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-md'
                      : 'bg-gray-50 border border-gray-200 text-gray-800 rounded-bl-md'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                  <Brain className="w-3 h-3 text-white" />
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-2xl rounded-bl-md px-3 py-2.5 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
                  <span className="text-xs text-gray-500">Analyzing your CareerIQ profile...</span>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-700">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-gray-200 px-3 py-2.5 shrink-0">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your career, skills, results..."
                className="flex-1 text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 placeholder:text-gray-400"
                disabled={loading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 flex items-center justify-center transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-1.5">
              Powered by CareerIQ data · Not financial or hiring advice
            </p>
          </div>
        </div>
      )}
    </>
  );
};
