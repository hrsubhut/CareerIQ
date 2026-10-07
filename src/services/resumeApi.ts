import { API_BASE_URL } from './api';

export interface ExtractedProfile {
  name: string | null;
  email: string | null;
  phone: string | null;
  skills: string[];
  experience_years: number;
  education: string[];
  current_role: string | null;
  location: string | null;
}

export interface ResumeParseResponse {
  profile: ExtractedProfile;
  filename: string;
}

export const resumeApi = {
  parseResume: async (file: File): Promise<ResumeParseResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE_URL}/api/v1/resume/parse`, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Resume extraction failed: ${errText}`);
    }

    return res.json();
  }
};
