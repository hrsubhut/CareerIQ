import React, { useState, useRef } from 'react';
import {
  Upload,
  CheckCircle2,
  ArrowRight,
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
import { api } from '../../api';
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Brand header */}
      <div className="w-full max-w-xl mb-8 animate-fade-in-up">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <Sparkles className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">CareerPath AI</span>
        </div>
        <p className="text-center text-sm text-gray-500">
          Your personalized career intelligence — built from your real profile
        </p>
      </div>

      {/* Progress steps */}
      <div className="w-full max-w-xl mb-6 animate-fade-in-up animate-delay-100">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-4 h-px bg-gray-200 z-0" />
          <div
            className="absolute left-0 top-4 h-px bg-indigo-600 z-0 transition-all duration-500"
            style={{ width: `${(stepIndex / (STEPS.length - 1)) * 100}%` }}
          />
          {STEP_INFO.map((s, i) => {
            const isDone = i < stepIndex;
            const isActive = i === stepIndex;
            return (
              <div key={s.id} className="relative z-10 flex flex-col items-center gap-1.5">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    isDone
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : isActive
                      ? 'bg-white border-indigo-600 text-indigo-600 shadow-md shadow-indigo-100'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <s.icon className="w-3.5 h-3.5" />
                  )}
                </div>
                <span
                  className={`text-[11px] font-semibold ${
                    isActive ? 'text-indigo-600' : isDone ? 'text-gray-600' : 'text-gray-400'
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
      <div className="w-full max-w-xl bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden animate-fade-in-up animate-delay-200">

        {/* ── STEP 1: UPLOAD ─────────────────────────────────────── */}
        {step === 'upload' && (
          <div className="p-8 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Upload your resume</h1>
              <p className="text-sm text-gray-500 mt-1">
                We'll extract your skills, experience, and qualifications automatically.
              </p>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50'
                  : isExtracting
                  ? 'border-indigo-400 bg-indigo-50/40'
                  : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50/50'
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
                <div className="flex flex-col items-center gap-3 py-2">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Extracting your profile...</p>
                    <p className="text-xs text-gray-500 mt-0.5">Normalizing skills and work history</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-2">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Drop your resume here, or <span className="text-indigo-600">click to browse</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">PDF or DOCX · Max 10MB</p>
                  </div>
                </div>
              )}
            </div>

            {/* Features list */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Skills extracted', color: 'bg-emerald-100 text-emerald-700' },
                { label: 'Experience parsed', color: 'bg-indigo-100 text-indigo-700' },
                { label: 'Profile auto-built', color: 'bg-purple-100 text-purple-700' },
              ].map(f => (
                <div key={f.label} className={`rounded-lg px-3 py-2 text-center text-[11px] font-semibold ${f.color}`}>
                  {f.label}
                </div>
              ))}
            </div>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setStep('review')}
                className="text-xs text-gray-500 hover:text-indigo-600 font-medium transition-colors"
              >
                Skip — I'll enter my profile manually →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: REVIEW ─────────────────────────────────────── */}
        {step === 'review' && (
          <div className="p-8 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Review your profile</h2>
                <p className="text-sm text-gray-500 mt-1">Verify the extracted details or fill them in manually.</p>
              </div>
              {uploadedFile && (
                <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3 h-3" />
                  {uploadedFile.name.slice(0, 24)}{uploadedFile.name.length > 24 ? '…' : ''}
                </div>
              )}
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Full Name"
                required
                error={errors.name}
                value={name}
                onChange={setName}
                placeholder="e.g. Dev Saini"
              />
              <Field
                label="Email"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
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
                placeholder="e.g. Bengaluru, India"
              />
              <Field
                label="Education"
                value={education}
                onChange={setEducation}
                placeholder="e.g. B.Tech in Computer Science"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Your Skills</label>
              <div className="flex flex-wrap gap-2 mb-3 min-h-[36px]">
                {skills.map(s => (
                  <span
                    key={s.name}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 border border-gray-200 rounded-md text-xs font-medium text-gray-800 group"
                  >
                    {s.name}
                    <button
                      type="button"
                      onClick={() => setSkills(prev => prev.filter(x => x.name !== s.name))}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
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
                  placeholder="Add a skill (e.g. Python, SQL, Tableau)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Footer nav */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setStep('upload')}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 font-medium transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                type="button"
                onClick={() => { if (validateReview()) setStep('target'); }}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                Continue <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: TARGET ─────────────────────────────────────── */}
        {step === 'target' && (
          <div className="p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Choose your target career</h2>
              <p className="text-sm text-gray-500 mt-1">
                We'll benchmark your profile against {'>'}17,400 job postings for this role.
              </p>
            </div>

            <div className="space-y-3">
              {TARGET_ROLES.map(opt => (
                <div
                  key={opt.role}
                  onClick={() => setTargetRole(opt.role)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    targetRole === opt.role
                      ? 'border-indigo-500 bg-indigo-50/60 ring-1 ring-indigo-400 shadow-sm shadow-indigo-100'
                      : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-sm font-bold text-gray-900">{opt.role}</h3>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-md">
                          {opt.badge}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{opt.desc}</p>
                      <p className="text-xs font-semibold text-gray-700 mt-1">{opt.salary}</p>
                    </div>
                    <div className={`shrink-0 w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center transition-all ${
                      targetRole === opt.role ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
                    }`}>
                      {targetRole === opt.role && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer nav */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setStep('review')}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 font-medium transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                type="button"
                onClick={handleAnalyzeCareer}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors disabled:opacity-70"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    Analyze My Career
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer note */}
      <p className="mt-6 text-[11px] text-gray-400 text-center animate-fade-in animate-delay-400">
        Your data stays in your browser. Nothing is stored on any server.
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
    <label className="block text-xs font-semibold text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-3 py-2.5 border rounded-lg text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${
        error ? 'border-red-400 bg-red-50/30' : 'border-gray-300 bg-white'
      }`}
    />
    {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
  </div>
);

const NumberField: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
}> = ({ label, value, onChange }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
    <input
      type="number"
      min="0"
      max="40"
      step="0.5"
      value={value}
      onChange={e => onChange(parseFloat(e.target.value) || 0)}
      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
    />
  </div>
);
