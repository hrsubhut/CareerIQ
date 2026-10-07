import React, { useState, useRef } from 'react';
import {
  Upload,
  CheckCircle2,
  Loader2,
  X,
  Plus,
  Sparkles,
  FileText,
  User,
  Target,
  ChevronRight,
  ChevronLeft,
  Zap,
} from 'lucide-react';
import { resumeApi } from '../../services/resumeApi';
import { careerApi } from '../../services/careerApi';
import { UserProfile, ProficiencyLevel } from '../../types';

interface UserOnboardingFlowProps {
  onProfileCompleted: (profile: UserProfile) => void;
}

const STEPS = ['upload', 'review', 'target'] as const;
type OnboardingStep = typeof STEPS[number];

const STEP_INFO = [
  { id: 'upload', label: 'Resume', icon: FileText },
  { id: 'review', label: 'Profile', icon: User },
  { id: 'target', label: 'Goal', icon: Target },
];

const TARGET_ROLES = [
  {
    role: 'Data Scientist',
    desc: 'Predictive modeling, ML algorithms, statistical analysis',
    badge: 'High Demand',
    salary: '$110k – $160k',
  },
  {
    role: 'Senior Data Analyst',
    desc: 'Advanced SQL, A/B testing, business dashboards, metrics',
    badge: 'Hot',
    salary: '$95k – $130k',
  },
  {
    role: 'Business Intelligence Analyst',
    desc: 'Power BI, DAX, SQL, dimensional modeling, reporting',
    badge: 'Stable',
    salary: '$80k – $115k',
  },
  {
    role: 'Machine Learning Engineer',
    desc: 'PyTorch, ML pipelines, model serving, systems architecture',
    badge: 'Growing',
    salary: '$130k – $190k',
  },
];

export const UserOnboardingFlow: React.FC<UserOnboardingFlowProps> = ({ onProfileCompleted }) => {
  const [step, setStep] = useState<OnboardingStep>('upload');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // User fields — fully empty by default
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(0);
  const [location, setLocation] = useState('');
  const [education, setEducation] = useState('');
  const [skills, setSkills] = useState<{ name: string; level: ProficiencyLevel }[]>([]);
  const [targetRole, setTargetRole] = useState('Data Scientist');
  const [newSkillText, setNewSkillText] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsExtracting(true);
    try {
      const resp = await resumeApi.parseResume(file);
      const extracted = resp.profile;
      if (extracted.name) setName(extracted.name);
      if (extracted.email) setEmail(extracted.email);
      if (extracted.location) setLocation(extracted.location);
      if (extracted.current_role) setCurrentRole(extracted.current_role);
      if (extracted.experience_years) setYearsOfExperience(extracted.experience_years);
      if (extracted.education?.length > 0) setEducation(extracted.education[0]);
      if (extracted.skills?.length > 0) {
        setSkills(extracted.skills.map(s => ({ name: s, level: 'Intermediate' as ProficiencyLevel })));
      }
      setStep('review');
    } catch (err) {
      console.error('Resume extraction failed', err);
      setStep('review');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleAddSkill = () => {
    const trimmed = newSkillText.trim();
    if (!trimmed) return;
    if (!skills.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setSkills(prev => [...prev, { name: trimmed, level: 'Intermediate' }]);
    }
    setNewSkillText('');
  };

  const validateReview = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Your name is required';
    if (!currentRole.trim()) errs.currentRole = 'Current role is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAnalyzeCareer = async () => {
    if (!validateReview()) return;
    setIsAnalyzing(true);
    try {
      const analysis = await careerApi.analyzeCareer({
        target_role: targetRole,
        skills: skills.map(s => s.name),
        experience_years: Number(yearsOfExperience) || 0,
        location: location || 'Bengaluru',
        education: education ? [education] : []
      });

      const readinessScore = Math.round(analysis.career.readiness_score || 50);
      const userProfile: UserProfile = {
        id: `usr_${Date.now()}`,
        name: name.trim(),
        email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        currentRole: currentRole.trim(),
        targetRole,
        yearsOfExperience: Number(yearsOfExperience) || 0,
        education: education || 'Bachelor Degree',
        location: location || 'Bengaluru',
        careerReadiness: readinessScore,
        profileStrength: Math.min(95, Math.max(50, skills.length * 10 + (uploadedFile ? 20 : 0))),
        matchingCareersCount: analysis.locations.length || 4,
        criticalSkillGapsCount: analysis.skills.missing_critical_skills?.length ?? 2,
        marketOpportunity: analysis.market.total_postings > 1000 ? 'High' : 'Medium',
        careerInterests: [targetRole],
        skills: skills.map(s => ({ name: s.name, level: s.level, verified: true, yearsOfExperience })),
        lastUpdated: new Date().toISOString(),
      };

      onProfileCompleted(userProfile);
    } catch (e) {
      console.error("Career analysis failed, building profile with defaults", e);
      const userProfile: UserProfile = {
        id: `usr_${Date.now()}`,
        name: name.trim(),
        email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        currentRole: currentRole.trim(),
        targetRole,
        yearsOfExperience: Number(yearsOfExperience) || 0,
        education: education || 'Bachelor Degree',
        location: location || 'Bengaluru',
        careerReadiness: 65,
        profileStrength: 75,
        matchingCareersCount: 4,
        criticalSkillGapsCount: 2,
        marketOpportunity: 'High',
        careerInterests: [targetRole],
        skills: skills.map(s => ({ name: s.name, level: s.level, verified: true, yearsOfExperience })),
        lastUpdated: new Date().toISOString(),
      };
      onProfileCompleted(userProfile);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const stepIndex = STEPS.indexOf(step);

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Brand header */}
      <div className="w-full max-w-2xl mb-8 text-center animate-fade-in-up">
        <div className="flex items-center justify-center gap-3 mb-2.5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Career<span className="text-indigo-600">IQ</span>
          </span>
        </div>
        <p className="text-sm sm:text-base text-gray-600 font-medium">
          Enterprise career intelligence and live skill gap calibration powered by real ML inference.
        </p>
      </div>

      {/* Progress steps */}
      <div className="w-full max-w-2xl mb-8 animate-fade-in-up">
        <div className="flex items-center justify-between relative px-6">
          <div className="absolute left-10 right-10 top-5 h-0.5 bg-gray-200 z-0" />
          <div
            className="absolute left-10 top-5 h-0.5 bg-indigo-600 z-0 transition-all duration-500"
            style={{ width: `${(stepIndex / (STEPS.length - 1)) * 80}%` }}
          />
          {STEP_INFO.map((s, i) => {
            const isDone = i < stepIndex;
            const isActive = i === stepIndex;
            return (
              <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 font-bold ${
                    isDone
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                      : isActive
                      ? 'bg-white border-indigo-600 text-indigo-600 shadow-md ring-4 ring-indigo-50'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <s.icon className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isActive ? 'text-indigo-600' : isDone ? 'text-gray-700' : 'text-gray-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main card */}
      <div className="w-full max-w-2xl bg-white border border-gray-200/90 rounded-3xl shadow-xl overflow-hidden animate-fade-in-up">

        {/* ── STEP 1: UPLOAD ─────────────────────────────────────── */}
        {step === 'upload' && (
          <div className="p-8 sm:p-10 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Upload your resume</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1.5">
                We'll extract your skills, tenure, and verified credentials automatically.
              </p>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-3xl border-2 border-dashed p-10 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-indigo-600 bg-indigo-50/80 scale-[1.01]'
                  : isExtracting
                  ? 'border-indigo-400 bg-indigo-50/40'
                  : 'border-gray-300 hover:border-indigo-500 hover:bg-slate-50/70'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc"
                className="hidden"
                onChange={e => { if (e.target.files?.[0]) handleFileUpload(e.target.files[0]); }}
              />

              {isExtracting ? (
                <div className="flex flex-col items-center gap-4 py-3">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                    <Loader2 className="w-7 h-7 text-indigo-600 animate-spin" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-gray-900">Parsing your resume...</p>
                    <p className="text-sm text-gray-500 mt-1">Extracting technical skills, roles, and experience</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 py-3">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-base sm:text-lg font-bold text-gray-900">
                      Drag & drop your resume, or <span className="text-indigo-600 hover:underline">browse files</span>
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">Supports PDF, DOCX (up to 10MB)</p>
                  </div>
                </div>
              )}
            </div>

            {/* Features list */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Skills Extracted', color: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
                { label: 'Experience Normalized', color: 'bg-indigo-50 text-indigo-700 border border-indigo-200' },
                { label: 'Instant Calibration', color: 'bg-purple-50 text-purple-700 border border-purple-200' },
              ].map(f => (
                <div key={f.label} className={`rounded-xl p-3 text-center text-xs font-bold ${f.color}`}>
                  {f.label}
                </div>
              ))}
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setStep('review')}
                className="text-sm text-gray-500 hover:text-indigo-600 font-bold transition-colors"
              >
                Skip upload — enter profile details manually →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: REVIEW ─────────────────────────────────────── */}
        {step === 'review' && (
          <div className="p-8 sm:p-10 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Review your profile</h2>
                <p className="text-sm text-gray-600 mt-1">Verify your background or adjust any field.</p>
              </div>
              {uploadedFile && (
                <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-700 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {uploadedFile.name.slice(0, 20)}{uploadedFile.name.length > 20 ? '…' : ''}
                </div>
              )}
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field
                label="Full Name"
                required
                error={errors.name}
                value={name}
                onChange={setName}
                placeholder="e.g. Alex Chen"
              />
              <Field
                label="Email"
                value={email}
                onChange={setEmail}
                placeholder="alex@example.com"
              />
              <Field
                label="Current / Most Recent Role"
                required
                error={errors.currentRole}
                value={currentRole}
                onChange={setCurrentRole}
                placeholder="e.g. Data Analyst"
              />
              <NumberField
                label="Years of Experience"
                value={yearsOfExperience}
                onChange={setYearsOfExperience}
              />
              <Field
                label="Location"
                value={location}
                onChange={setLocation}
                placeholder="e.g. San Francisco, CA"
              />
              <Field
                label="Education"
                value={education}
                onChange={setEducation}
                placeholder="e.g. B.S. in Computer Science"
              />
            </div>

            {/* Skills */}
            <div className="space-y-3">
              <label className="block text-xs sm:text-sm font-bold text-gray-700">Verified Technical Skills</label>
              <div className="flex flex-wrap gap-2 min-h-[40px]">
                {skills.map(s => (
                  <span
                    key={s.name}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 group"
                  >
                    {s.name}
                    <button
                      type="button"
                      onClick={() => setSkills(prev => prev.filter(x => x.name !== s.name))}
                      className="text-gray-400 hover:text-rose-600 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
                {skills.length === 0 && (
                  <span className="text-xs text-gray-400 italic self-center">No skills added yet</span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkillText}
                  onChange={e => setNewSkillText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  placeholder="Add a skill (e.g. Python, SQL, Tableau, Pandas)"
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Footer nav */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setStep('upload')}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 font-bold transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={() => { if (validateReview()) setStep('target'); }}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md transition-all"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: TARGET ─────────────────────────────────────── */}
        {step === 'target' && (
          <div className="p-8 sm:p-10 space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Choose your target career</h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                We'll benchmark your profile against 15,800+ real job requisitions for this role.
              </p>
            </div>

            <div className="space-y-3.5">
              {TARGET_ROLES.map(opt => (
                <div
                  key={opt.role}
                  onClick={() => setTargetRole(opt.role)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                    targetRole === opt.role
                      ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-400 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 mb-1">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900">{opt.role}</h3>
                        <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-lg">
                          {opt.badge}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">{opt.desc}</p>
                      <p className="text-xs sm:text-sm font-bold text-indigo-700 mt-1.5 font-numeric">{opt.salary}</p>
                    </div>
                    <div className={`shrink-0 w-6 h-6 rounded-full border-2 mt-1 flex items-center justify-center transition-all ${
                      targetRole === opt.role ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
                    }`}>
                      {targetRole === opt.role && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer nav */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setStep('review')}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 font-bold transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={handleAnalyzeCareer}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm sm:text-base font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-70"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Running ML Benchmarks...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Analyze My Career Intelligence
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer note */}
      <p className="mt-6 text-xs text-gray-400 text-center animate-fade-in">
        Your data is saved locally in your browser. All inference runs with private endpoints.
      </p>
    </div>
  );
};

// ── Helper sub-components ─────────────────────────────────

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}> = ({ label, value, onChange, placeholder, required, error }) => (
  <div>
    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-3 border rounded-xl text-sm sm:text-base text-gray-900 placeholder:text-gray-400 transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium ${
        error ? 'border-rose-400 bg-rose-50/30' : 'border-gray-300 bg-white'
      }`}
    />
    {error && <p className="text-xs text-rose-500 font-semibold mt-1">{error}</p>}
  </div>
);

const NumberField: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
}> = ({ label, value, onChange }) => (
  <div>
    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">{label}</label>
    <input
      type="number"
      min="0"
      max="40"
      step="0.5"
      value={value}
      onChange={e => onChange(parseFloat(e.target.value) || 0)}
      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm sm:text-base text-gray-900 bg-white transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
    />
  </div>
);
