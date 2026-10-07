import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Download,
  Share2,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { Badge } from '../common/Badge';

export const ResumePage: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'enhanced' | 'baseline'>('enhanced');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
              EVIDENCE-BACKED CREDENTIALING
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">Target Role: <strong className="text-white">{user.targetRole}</strong></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Evidence-Backed Resume & Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Transform unsubstantiated resume keyword lists into verifiable, project-proven skill claims.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Download Resume: Exported ATS-optimized PDF with verified evidence badges.')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" /> Download Resume
          </button>
          <button
            onClick={() => alert('Share Profile: Public portfolio link copied to clipboard.')}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition-colors flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" /> Share Profile
          </button>
        </div>
      </div>

      {/* Verified Skills Evidence Notice */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-300">Verification Governance:</strong> Only skills backed by completed platform diagnostic challenges or code repository commit validation receive verified marks. Self-reported skills remain transparently indicated as unverified.
        </div>
      </div>

      {/* Comparison Toggle */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800 w-fit text-xs font-semibold">
        <button
          onClick={() => setActiveTab('enhanced')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'enhanced'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" /> AI-Enhanced Evidence Resume
        </button>
        <button
          onClick={() => setActiveTab('baseline')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'baseline'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Original Baseline Resume
        </button>
      </div>

      {/* Resume Content View */}
      {activeTab === 'enhanced' ? (
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800 glow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">{user.name}</h2>
              <p className="text-xs text-indigo-400 font-mono mt-0.5">
                {user.currentRole} → Aspiring {user.targetRole}
              </p>
              <p className="text-xs text-slate-400 mt-1">{user.location} • {user.email}</p>
            </div>
            <div className="text-right">
              <Badge variant="green">Profile Strength: {user.profileStrength}%</Badge>
            </div>
          </div>

          {/* Section: Verified Skills & Platform Evidence */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3">
              Validated Technical Evidence
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-emerald-900/40">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-white text-xs">Python Programming</span>
                  <Badge variant="green" size="sm">Verified (Score: 92%)</Badge>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Demonstrated vectorized Pandas data manipulation, memory optimization, and algorithmic execution.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-emerald-900/40">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-white text-xs">SQL Query Optimization</span>
                  <Badge variant="green" size="sm">Verified (Score: 86%)</Badge>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Window functions, partitioning, indexed execution plan validation on 10M+ mock row datasets.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-white text-xs">Machine Learning (In Progress)</span>
                  <Badge variant="amber" size="sm">Self-Reported / Lab</Badge>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Currently building scikit-learn classification capstone. Verification pending diagnostic lab.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-white text-xs">Power BI & Visualization</span>
                  <Badge variant="blue" size="sm">Portfolio Audited</Badge>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Demonstrated executive KPIs, DAX data modeling, and Star Schema design.
                </p>
              </div>
            </div>
          </div>

          {/* Section: Project Portfolio Alignment */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3">
              Targeted Portfolio Project Proofs
            </h3>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white">E-Commerce User Conversion & Causal Inference Audit</h4>
                <span className="font-mono text-slate-400 text-[11px]">Python, SciPy, A/B Testing</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Formulated hypothesis test across 84,000 checkout journeys, discovering statistically significant (+3.8%) uplift in conversion with robust Bonferroni alpha correction.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* BASELINE UNENHANCED RESUME */
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
          <div className="pb-4 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white">{user.name}</h2>
            <p className="text-xs text-slate-400">{user.currentRole} • {user.yearsOfExperience} Years Experience</p>
          </div>

          <div className="space-y-2 text-xs">
            <h3 className="font-semibold text-slate-300">Listed Skills (Unverified text list):</h3>
            <p className="text-slate-400 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono">
              Python, SQL, Excel, Power BI, Data Visualization, Statistics, Machine Learning, Git
            </p>
            <p className="text-[11px] text-amber-400 pt-1">
              ⚠ Traditional resumes contain unverified keyword assertions with no diagnostic score backing.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
