import { authApi } from './authApi';
import { profileApi } from './profileApi';
import { careerApi } from './careerApi';
import { marketApi } from './marketApi';
import { skillsApi } from './skillsApi';
import { analyticsApi } from './analyticsApi';
import { jobsApi } from './jobsApi';
import { assessmentApi } from './assessmentApi';
import { interviewApi } from './interviewApi';

export const api = {
  auth: authApi,
  profile: profileApi,
  career: careerApi,
  market: marketApi,
  skills: skillsApi,
  analytics: analyticsApi,
  jobs: jobsApi,
  assessment: assessmentApi,
  interview: interviewApi,
};

export default api;
export * from './config';
