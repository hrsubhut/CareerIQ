import React, { useState } from 'react';
import { X, Upload, CheckCircle2, ChevronRight, Loader2, Plus } from 'lucide-react';
import { UserProfile, ProficiencyLevel } from '../../types';
import { api } from '../../api';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile,
}) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<UserProfile>({ ...currentUser });
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<ProficiencyLevel>('Intermediate');
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);

  if (!isOpen) return null;

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    if (!formData.skills.some(s => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, { name: newSkillName.trim(), level: newSkillLevel }],
      }));
    }
    setNewSkillName('');
  };

  const handleRemoveSkill = (skillName: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.name !== skillName),
    }));
  };

  const handleResumeDrop = async (e: React.DragEvent | React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsParsingResume(true);
    try {
      const mockFile = new File(['mock content'], 'Dev_Saini_Resume.pdf', { type: 'application/pdf' });
      const parsed = await api.profile.parseResume(mockFile);
      setResumeUploaded(true);
      setFormData(prev => {
        const currentSkillNames = new Set(prev.skills.map(s => s.name.toLowerCase()));
        const additions = parsed.extractedSkills
          .filter(name => !currentSkillNames.has(name.toLowerCase()))
          .map(name => ({ name, level: 'Intermediate' as ProficiencyLevel }));
        return {
          ...prev,
          skills: [...prev.skills, ...additions],
          yearsOfExperience: parsed.experienceYears || prev.yearsOfExperience,
        };
      });
      setTimeout(() => setStep(2), 700);
    } catch (err) {
      console.error(err);
    } finally {
      setIsParsingResume(false);
    }
  };

  const handleComplete = () => {
    onSaveProfile(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white border border-gray-200 rounded-xl shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Step {step} of 3
            </span>
            <h2 className="text-base font-bold text-gray-900">
              {step === 1 ? 'Upload Resume (Optional)' : step === 2 ? 'Edit Skills & Background' : 'Select Target Career'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {step === 1 && (
            <div className="space-y-4 text-center">
              <div
                onDragOver={e => e.preventDefault()}
                onDrop={handleResumeDrop}
                className="border-2 border-dashed border-gray-300 hover:border-indigo-500 rounded-xl p-8 transition-colors flex flex-col items-center justify-center cursor-pointer relative"
              >
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleResumeDrop}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />

                {isParsingResume ? (
                  <div className="space-y-2 flex flex-col items-center py-4">
                    <Loader2 className="w-7 h-7 text-indigo-600 animate-spin" />
                    <p className="text-sm font-semibold text-gray-900">Extracting skills from resume...</p>
                  </div>
                ) : resumeUploaded ? (
                  <div className="space-y-1 py-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h3 className="text-sm font-bold text-gray-900">Resume Uploaded Successfully</h3>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="p-2.5 bg-gray-100 rounded-full w-fit mx-auto text-gray-600">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      Drag & drop your resume here or click to browse
                    </div>
                    <p className="text-xs text-gray-400">PDF or DOCX supported</p>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs font-semibold text-gray-600 hover:text-gray-900 underline"
              >
                Skip resume upload and enter manually →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Current Role</label>
                  <input
                    type="text"
                    value={formData.currentRole}
                    onChange={e => setFormData({ ...formData, currentRole: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Years of Experience</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.yearsOfExperience}
                    onChange={e => setFormData({ ...formData, yearsOfExperience: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">Current Skills</label>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {formData.skills.map(s => (
                    <span
                      key={s.name}
                      className="px-2.5 py-1 rounded bg-gray-100 border border-gray-200 text-gray-800 text-xs font-medium flex items-center gap-1"
                    >
                      {s.name}
                      <button onClick={() => handleRemoveSkill(s.name)} className="text-gray-400 hover:text-gray-600">
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add skill (e.g. Scikit-Learn)"
                    value={newSkillName}
                    onChange={e => setNewSkillName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                  />
                  <select
                    value={newSkillLevel}
                    onChange={e => setNewSkillLevel(e.target.value as ProficiencyLevel)}
                    className="px-2 py-1.5 border border-gray-300 rounded-lg text-xs"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-semibold"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Target Career Role</label>
                <input
                  type="text"
                  value={formData.targetRole}
                  onChange={e => setFormData({ ...formData, targetRole: e.target.value })}
                  placeholder="e.g. Data Scientist"
                  className="w-full px-3 py-2 border border-indigo-400 bg-indigo-50/20 text-indigo-900 font-bold rounded-lg text-sm"
                />
              </div>

              <div>
                <span className="text-gray-500 block mb-2">Recommended Targets:</span>
                <div className="flex flex-wrap gap-2">
                  {['Data Scientist', 'Senior Data Analyst', 'Business Intelligence Analyst', 'Machine Learning Engineer'].map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFormData({ ...formData, targetRole: r })}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                        formData.targetRole === r
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              className="text-xs font-semibold text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
          ) : <span />}

          {step < 3 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
            >
              Next Step →
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
            >
              Analyze & View Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
