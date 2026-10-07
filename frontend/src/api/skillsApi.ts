import { API_CONFIG, sleep } from './config';
import { SkillLeaderboardItem, SkillRoleMatrix, OpportunityScoreBreakdown } from '../types';
import mockSkills from '../mock/skills.json';

class SkillsApi {
  async getLeaderboard(): Promise<SkillLeaderboardItem[]> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await sleep();
      return mockSkills.leaderboard as SkillLeaderboardItem[];
    }
    const res = await fetch(`${API_CONFIG.BASE_URL}/market/skills`);
    if (!res.ok) throw new Error('Failed to fetch skills leaderboard');
    return res.json();
  }

  async getSkillRoleMatrix(): Promise<SkillRoleMatrix> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await sleep();
      return mockSkills.matrix as SkillRoleMatrix;
    }
    const res = await fetch(`${API_CONFIG.BASE_URL}/market/skills/matrix`);
    if (!res.ok) throw new Error('Failed to fetch skill-role matrix');
    return res.json();
  }

  async getOpportunityBreakdown(): Promise<OpportunityScoreBreakdown> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await sleep();
      return mockSkills.opportunityBreakdown as OpportunityScoreBreakdown;
    }
    const res = await fetch(`${API_CONFIG.BASE_URL}/career/opportunity-score`);
    if (!res.ok) throw new Error('Failed to fetch opportunity breakdown');
    return res.json();
  }
}

export const skillsApi = new SkillsApi();
