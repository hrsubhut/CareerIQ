import { API_CONFIG, sleep } from './config';
import { CareerRecommendation, SkillGapAnalysis } from '../types';
import mockCareers from '../mock/careers.json';
import mockSkillGap from '../mock/skillGap.json';

class CareerApi {
  async getRecommendations(): Promise<CareerRecommendation[]> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await sleep();
      return mockCareers as CareerRecommendation[];
    }
    const res = await fetch(`${API_CONFIG.BASE_URL}/career/recommend`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to fetch career recommendations');
    return res.json();
  }

  async getCareerDetail(roleName: string): Promise<CareerRecommendation | undefined> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await sleep();
      const match = (mockCareers as CareerRecommendation[]).find(
        c => c.role.toLowerCase() === roleName.toLowerCase() || c.id === roleName
      );
      return match || (mockCareers[2] as CareerRecommendation); // fallback to Data Scientist
    }
    const res = await fetch(`${API_CONFIG.BASE_URL}/career/${encodeURIComponent(roleName)}`);
    if (!res.ok) throw new Error('Failed to fetch career details');
    return res.json();
  }

  async getSkillGapAnalysis(targetRole: string = 'Data Scientist'): Promise<SkillGapAnalysis> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await sleep();
      return {
        ...(mockSkillGap as SkillGapAnalysis),
        targetRole,
      };
    }
    const res = await fetch(`${API_CONFIG.BASE_URL}/skill-gap/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target_role: targetRole }),
    });
    if (!res.ok) throw new Error('Failed to analyze skill gap');
    return res.json();
  }
}

export const careerApi = new CareerApi();
