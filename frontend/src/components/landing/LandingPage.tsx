import React from 'react';
import { ArrowRight, Upload, Sparkles, CheckCircle2, TrendingUp, Sliders } from 'lucide-react';

interface LandingPageProps {
  onExploreCareer: () => void;
  onUploadResume: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onExploreCareer,
  onUploadResume,
}) => {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="h-16 border-b border-gray-200 px-6 sm:px-12 flex items-center justify-between bg-white sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
            C
          </div>
          <span className="font-bold text-lg text-gray-900 tracking-tight">CareerPath AI</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExploreCareer}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            Open Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 sm:px-12 pt-20 pb-20 max-w-4xl mx-auto w-full text-center flex flex-col items-center">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 mb-6">
          Personal Career Intelligence
        </span>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
          Know where your skills <br />
          <span className="text-indigo-600">can take you.</span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
          AI-powered career intelligence that connects your skills, market demand, and realistic career opportunities. Simple, transparent, and actionable.
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <button
            onClick={onUploadResume}
            className="px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4" /> Upload Resume & Explore
          </button>
          <button
            onClick={onExploreCareer}
            className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-sm transition-colors"
          >
            View Dev Saini's Dashboard
          </button>
        </div>

        {/* 3 Step Journey */}
        <div className="mt-16 w-full grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <span className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs mb-3">
              1
            </span>
            <h2 className="text-sm font-bold text-gray-900 mb-1">Upload Resume & Profile</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Import your existing skills and experience without tedious manual data entry.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <span className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs mb-3">
              2
            </span>
            <h2 className="text-sm font-bold text-gray-900 mb-1">Analyze Compatibility</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Compare your background against 17,400 active job postings across high-opportunity paths.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs mb-3">
              3
            </span>
            <h2 className="text-sm font-bold text-gray-900 mb-1">Bridge Skills & Progress</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Receive clear, week-by-week learning steps to reach your target role and salary bracket.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 py-6 px-6 text-center text-xs text-gray-400">
        © 2026 CareerPath AI — Simple, Actionable Career Intelligence
      </footer>
    </div>
  );
};
