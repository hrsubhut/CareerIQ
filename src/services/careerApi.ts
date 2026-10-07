import { apiRequest } from './api';

export interface CareerAnalysisRequest {
  target_role: string;
  skills: string[];
  experience_years: number;
  location?: string;
  education?: string[];
}

export interface SalaryPrediction {
  predicted_salary: number;
  predicted_salary_lakhs: number;
  currency: string;
  formatted_salary: string;
  model: {
    name: string;
    version: string;
    algorithm?: string;
  };
  explainability?: Record<string, any>;
}

export interface LocationRecommendation {
  location: string;
  score: number;
  relative_demand?: string;
  market_share_prior?: number;
}

export interface SkillDetail {
  skill: string;
  importance: number;
  postings: number;
  status: 'Possessed' | 'Gap';
}

export interface SkillGapResult {
  target_role: string;
  matched_skills: string[];
  missing_critical_skills: string[];
  match_percentage: number;
  skill_details: SkillDetail[];
}

export interface CareerAnalysisResponse {
  status: string;
  career: {
    target_role: string;
    readiness_score: number;
  };
  profile: {
    experience_years: number;
    location: string;
    skills: string[];
    education?: string[];
  };
  salary: SalaryPrediction;
  locations: LocationRecommendation[];
  market: {
    total_postings: number;
    methodology: string;
  };
  skills: SkillGapResult;
  recommendations: string[];
}

export const careerApi = {
  /**
   * Orchestrates complete profile evaluation against trained ML models:
   * - RandomForest Salary Model
   * - XGBoost Location Recommendation Model
   * - Market Skill Engine
   */
  analyzeCareer: (payload: CareerAnalysisRequest): Promise<CareerAnalysisResponse> => {
    return apiRequest<CareerAnalysisResponse>('/api/v1/career/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },

  predictSalary: (job_title: string, experience_years: number, location: string = 'Bengaluru', skills: string[] = []): Promise<SalaryPrediction> => {
    return apiRequest<SalaryPrediction>('/api/v1/salary/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_title, experience_years, location, skills })
    });
  },

  recommendLocations: (job_title: string, skills: string[] = [], experience_years: number = 0, top_k: number = 5): Promise<{ recommendations: LocationRecommendation[] }> => {
    return apiRequest<{ recommendations: LocationRecommendation[] }>('/api/v1/location/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_title, skills, experience_years, top_k })
    });
  }
};
