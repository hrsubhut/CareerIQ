import React, { useState } from 'react';
import { Upload, CheckCircle2, Plus, X } from 'lucide-react';
import { UserProfile, ProficiencyLevel } from '../../types';

interface ProfilePageProps {
  user: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onOpenUploadResume: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  onUpdateProfile,
  onOpenUploadResume,
}) => {
  const [formData, setFormData] = useState<UserProfile>({ ...user });
  const [isSaved, setIsSaved] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newLevel, setNewLevel] = useState<ProficiencyLevel>('Intermediate');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (!formData.skills.some(s => s.name.toLowerCase() === newSkill.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, { name: newSkill.trim(), level: newLevel }],
      }));
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillName: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.name !== skillName),
    }));
  };

  const initials = formData.name ? formData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'ME';

  return (
    <div className="w-full space-y-8 animate-fade-in-up">
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          User Profile & Credentials
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-4xl">
          Manage your verified credentials, technical proficiencies, and target career trajectory.
        </p>
      </div>

      <div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow space-y-7">
        {/* Top bar with quick resume import */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white flex items-center justify-center font-black text-lg shadow-md shadow-indigo-600/20 ring-2 ring-indigo-100">
              {initials}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">{formData.name}</h2>
              <p className="text-sm text-gray-500 font-medium">{formData.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenUploadResume}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-2xs transition-all self-start sm:self-auto"
          >
            <Upload className="w-4 h-4 text-indigo-600" />
            Upload New Resume
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm sm:text-base text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm sm:text-base text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">Current Role</label>
              <input
                type="text"
                value={formData.currentRole}
                onChange={e => setFormData({ ...formData, currentRole: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm sm:text-base text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">Years of Experience</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={formData.yearsOfExperience}
                onChange={e => setFormData({ ...formData, yearsOfExperience: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm sm:text-base text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">Target Career Goal</label>
              <input
                type="text"
                value={formData.targetRole}
                onChange={e => setFormData({ ...formData, targetRole: e.target.value })}
                className="w-full px-4 py-3 border border-indigo-400 bg-indigo-50/20 rounded-xl text-sm sm:text-base text-indigo-900 font-bold focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm sm:text-base text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-xs font-medium"
              />
            </div>
          </div>

          {/* Current Skills list & Add skill */}
          <div className="pt-6 border-t border-gray-100 space-y-4">
            <label className="block text-xs sm:text-sm font-bold text-gray-700">Verified & Current Skills</label>
            <div className="flex flex-wrap gap-2.5">
              {formData.skills.map(s => (
                <span
                  key={s.name}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 shadow-2xs"
                >
                  {s.name} <span className="text-xs text-slate-500 font-normal">({s.level})</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s.name)}
                    className="text-gray-400 hover:text-rose-600 transition-colors ml-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add skill row */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="text"
                placeholder="Add skill (e.g. Scikit-Learn, PyTorch, SQL)"
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium"
              />
              <select
                value={newLevel}
                onChange={e => setNewLevel(e.target.value as ProficiencyLevel)}
                className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-800 font-semibold focus:outline-none focus:border-indigo-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-sm font-bold transition-colors"
              >
                Add Skill
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
            {isSaved ? (
              <span className="text-sm text-emerald-600 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5" /> Profile updated successfully!
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm sm:text-base font-bold shadow-md hover:shadow-lg transition-all"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
