import { apiRequest } from './api';
import { SkillGapResult } from './careerApi';

export interface RoleDemandItem {
  role: string;
  display_role: string;
  postings: number;
  market_share: number;
  median_experience: number;
  avg_experience: number;
  median_salary: number;
  avg_salary: number;
  demand_score: number;
}

export interface MarketOverview {
  total_postings: number;
  categorized_roles: number;
  top_role: string;
  top_skill: string;
  top_location: string;
  methodology: string;
  roles: RoleDemandItem[];
}

export interface SkillItem {
  skill: string;
  skill_postings: number;
  importance: number;
  lift: number;
}

export interface LocationDemandItem {
  location: string;
  total_postings: number;
  avg_demand_score: number;
  avg_salary_proxy: number;
}

export const marketApi = {
  getOverview: (): Promise<MarketOverview> => {
    return apiRequest<MarketOverview>('/api/v1/market/overview');
  },

  getRoles: (): Promise<{ roles: RoleDemandItem[] }> => {
    return apiRequest<{ roles: RoleDemandItem[] }>('/api/v1/market/roles');
  },

  getSkills: (): Promise<{ skills: SkillItem[] }> => {
    return apiRequest<{ skills: SkillItem[] }>('/api/v1/market/skills');
  },

  getLocations: (): Promise<{ locations: LocationDemandItem[] }> => {
    return apiRequest<{ locations: LocationDemandItem[] }>('/api/v1/market/locations');
  },

  getSkillGap: (target_role: string, skills: string[]): Promise<SkillGapResult> => {
    return apiRequest<SkillGapResult>('/api/v1/market/skill-gap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target_role, skills })
    });
  }
};
