import React, { useState } from 'react';
import { User, Upload, CheckCircle2, Plus, X } from 'lucide-react';
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

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in-up">
      <div className="pb-2 border-b border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          User Profile & Credentials
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1.5">
          Manage your verified credentials, technical proficiencies, and target career trajectory.
        </p>
      </div>

      <div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow space-y-6">
        {/* Top bar with quick resume import */}
        <div className="flex items-center justify-between pb-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
              DS
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">{formData.name}</h2>
              <p className="text-xs text-gray-500">{formData.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenUploadResume}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-600" />
            Upload New Resume
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-indigo-500 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-indigo-500 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Current Role</label>
              <input
                type="text"
                value={formData.currentRole}
                onChange={e => setFormData({ ...formData, currentRole: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-indigo-500 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Years of Experience</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={formData.yearsOfExperience}
                onChange={e => setFormData({ ...formData, yearsOfExperience: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-indigo-500 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Target Career Goal</label>
              <input
                type="text"
                value={formData.targetRole}
                onChange={e => setFormData({ ...formData, targetRole: e.target.value })}
                className="w-full px-3 py-2 border border-indigo-400 bg-indigo-50/20 rounded-lg text-xs text-indigo-900 font-bold focus:outline-none focus:border-indigo-600 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-indigo-500 shadow-sm"
              />
            </div>
          </div>

          {/* Current Skills list & Add skill */}
          <div className="pt-4 border-t border-gray-100">
            <label className="block text-xs font-semibold text-gray-700 mb-2">Verified & Current Skills</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.skills.map(s => (
                <span
                  key={s.name}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-gray-50 border border-gray-200 text-xs font-medium text-gray-800"
                >
                  {s.name} <span className="text-[11px] text-gray-500">({s.level})</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s.name)}
                    className="text-gray-400 hover:text-red-600 ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add skill row */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add skill (e.g. Scikit-Learn, PyTorch)"
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-indigo-500"
              />
              <select
                value={newLevel}
                onChange={e => setNewLevel(e.target.value as ProficiencyLevel)}
                className="px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-semibold"
              >
                Add
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 flex items-center justify-between">
            {isSaved ? (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
