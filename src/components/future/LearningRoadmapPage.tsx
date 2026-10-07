import React, { useState } from 'react';
import { ShieldAlert, Award, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const ROADMAP_STEPS = [
  {
    step: 1,
    skill: 'Applied Statistics & Probability',
    timeframe: '2–3 weeks',
    difficulty: 'Intermediate',
    why: 'Core for A/B testing, hypothesis testing, and quantifying experimental significance in data models.',
    course: { title: 'Khan Academy: College Statistics & Probability', url: 'https://www.khanacademy.org/math/statistics-probability', free: true },
    docs: 'SciPy stats documentation & Hypothesis Testing guides',
    project: 'Audit checkout conversion rates using 2-sample t-test & chi-square tests on real e-commerce data.',
    certification: {
      title: 'Stanford Statistics Specialization (Coursera)',
      skill: 'Statistical hypothesis formulation and inference',
      relevance: 'High',
    },
  },
  {
    step: 2,
    skill: 'Machine Learning with Scikit-Learn',
    timeframe: '4–6 weeks',
    difficulty: 'Advanced',
    why: 'Primary requirement in 74% of Data Scientist postings — the single highest-impact skill gap.',
    course: { title: 'Coursera: Machine Learning Specialization (Andrew Ng)', url: 'https://www.coursera.org/specializations/machine-learning-introduction', free: false },
    docs: 'Scikit-Learn User Guide & API Reference',
    project: 'Customer churn prediction with cross-validation, ROC-AUC tuning, and SHAP interpretation.',
    certification: {
      title: 'DeepLearning.AI: Machine Learning Certificate',
      skill: 'Supervised & unsupervised model training and validation',
      relevance: 'High',
    },
  },
  {
    step: 3,
    skill: 'Model Evaluation, Tuning & Feature Engineering',
    timeframe: '2–3 weeks',
    difficulty: 'Intermediate',
    why: 'Distinguishes junior practitioners from production-ready data scientists in hiring screens.',
    course: { title: 'Kaggle Learn: Feature Engineering & Model Explainability', url: 'https://www.kaggle.com/learn', free: true },
    docs: 'SHAP (SHapley Additive exPlanations) Documentation',
    project: 'Feature importance audit on loan default risk classification with hyperparameter grid search.',
    certification: {
      title: 'Kaggle Micro-Course Completion Certificates',
      skill: 'Interactive data preprocessing and hyperparameter optimization',
      relevance: 'High',
    },
  },
  {
    step: 4,
    skill: 'Big Data & Distributed SQL',
    timeframe: '2–4 weeks',
    difficulty: 'Intermediate',
    why: 'Essential when querying datasets exceeding memory limits — key for senior DS roles.',
    course: { title: 'Mode Analytics: Advanced SQL Interactive Tutorial', url: 'https://mode.com/sql-tutorial/', free: true },
    docs: 'PostgreSQL & BigQuery Partitioning Best Practices',
    project: 'Query optimization challenge — reduce execution time by 50% using window functions & partitioning.',
    certification: {
      title: 'Google Cloud: BigQuery Fundamentals Certificate',
      skill: 'Enterprise distributed data engineering and query optimization',
      relevance: 'Medium',
    },
  },
];

const DIFF_COLORS: Record<string, string> = {
  Beginner: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Intermediate: 'bg-amber-50 text-amber-700 border border-amber-200',
  Advanced: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
};

export const LearningRoadmapPage: React.FC<{ targetRole: string }> = ({ targetRole }) => {
  const [expanded, setExpanded] = useState<number>(1);

  return (
    <div className="w-full space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Learning Roadmap</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-4xl">
          Structured curriculum to close your skill gaps for <strong className="text-gray-900 font-bold">{targetRole}</strong>.
        </p>
      </div>

      {/* Timeline overview */}
      <div className="rounded-2xl border border-gray-200/90 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
        <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Estimated Timeline</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ROADMAP_STEPS.map(s => (
            <button
              key={s.step}
              onClick={() => setExpanded(s.step)}
              className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                expanded === s.step
                  ? 'border-indigo-400 bg-indigo-50/70 ring-2 ring-indigo-300 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Step {s.step}</p>
              <p className="text-sm sm:text-base font-bold text-gray-900 mt-1 leading-snug">{s.skill.split('&')[0].trim()}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">{s.timeframe}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Certification disclaimer */}
      <div className="rounded-2xl border border-gray-200 bg-gray-50/80 p-5 flex items-start gap-3.5 text-xs sm:text-sm text-gray-600 leading-relaxed">
        <ShieldAlert className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
        <p>
          <strong className="text-gray-900 font-bold">Certification note:</strong> Certifications demonstrate curriculum completion
          and theoretical understanding. They do not automatically guarantee professional competence or hiring outcomes.
          Portfolio projects carry equal or greater weight.
        </p>
      </div>

      {/* Step cards */}
      <div className="space-y-5">
        {ROADMAP_STEPS.map(item => {
          const isOpen = expanded === item.step;
          return (
            <div
              key={item.step}
              className={`rounded-2xl border bg-white shadow-sm overflow-hidden transition-all duration-200 ${
                isOpen ? 'border-indigo-300 ring-1 ring-indigo-200' : 'border-gray-200'
              }`}
            >
              {/* Step header — always visible */}
              <button
                className="w-full flex items-center justify-between p-6 sm:p-7 text-left hover:bg-slate-50/50 transition-colors"
                onClick={() => setExpanded(isOpen ? 0 : item.step)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${
                    isOpen ? 'bg-indigo-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {item.step}
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-900">{item.skill}</h2>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs sm:text-sm text-gray-500 font-medium">{item.timeframe}</span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${DIFF_COLORS[item.difficulty]}`}>
                        {item.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                )}
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div className="px-6 sm:px-7 pb-6 sm:pb-7 space-y-5 border-t border-gray-100 pt-5">
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    <strong className="text-gray-900 font-bold">Why this matters:</strong> {item.why}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <ResourceCard
                      title="Course"
                      content={item.course.title}
                      url={item.course.url}
                      badge={item.course.free ? 'Free' : 'Paid'}
                      badgeColor={item.course.free ? 'text-emerald-700 bg-emerald-50' : 'text-gray-600 bg-gray-100'}
                    />
                    <ResourceCard title="Documentation" content={item.docs} />
                    <ResourceCard title="Practice Project" content={item.project} highlight />
                  </div>

                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-5 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-indigo-600" />
                      <span className="font-bold text-gray-800">Relevant Certification</span>
                      <span className={`ml-auto text-xs font-bold px-2.5 py-0.5 rounded ${
                        item.certification.relevance === 'High'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {item.certification.relevance} Relevance
                      </span>
                    </div>
                    <p className="font-bold text-gray-900 text-sm sm:text-base">{item.certification.title}</p>
                    <p className="text-gray-500 mt-1">Demonstrates: {item.certification.skill}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ResourceCard: React.FC<{
  title: string;
  content: string;
  url?: string;
  badge?: string;
  badgeColor?: string;
  highlight?: boolean;
}> = ({ title, content, url, badge, badgeColor, highlight }) => (
  <div className={`rounded-xl p-4 sm:p-5 border text-xs sm:text-sm flex flex-col justify-between ${
    highlight ? 'bg-indigo-50/50 border-indigo-100' : 'bg-white border-gray-100'
  }`}>
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{title}</span>
        {badge && <span className={`text-xs font-bold px-2 py-0.5 rounded ${badgeColor}`}>{badge}</span>}
      </div>
      <p className={`leading-relaxed ${highlight ? 'text-indigo-950 font-semibold' : 'text-gray-700'}`}>{content}</p>
    </div>
    {url && (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={e => e.stopPropagation()}
        className="inline-flex items-center gap-1.5 mt-3 text-indigo-600 hover:text-indigo-700 font-bold text-xs sm:text-sm"
      >
        Open resource <ExternalLink className="w-3.5 h-3.5" />
      </a>
    )}
  </div>
);
