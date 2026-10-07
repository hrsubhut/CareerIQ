import { API_CONFIG, sleep } from './config';
import { AssessmentItem } from '../types';
import mockAssessments from '../mock/assessments.json';

class AssessmentApi {
  async getAssessments(): Promise<AssessmentItem[]> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await sleep();
      return mockAssessments as AssessmentItem[];
    }
    const res = await fetch(`${API_CONFIG.BASE_URL}/assessments`);
    if (!res.ok) throw new Error('Failed to fetch assessments');
    return res.json();
  }

  async submitAssessment(assessmentId: string, _answers: Record<number, string>): Promise<{ score: number; passed: boolean; feedback: AssessmentItem['feedback'] }> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await sleep(800);
      return {
        score: 88,
        passed: true,
        feedback: {
          score: 88,
          skillLevel: 'Verified Intermediate',
          strengths: ['Conceptual clarity', 'Corner case handling'],
          weaknesses: ['Performance complexity'],
          recommendedAction: 'Earn advanced badge by completing scenario test'
        }
      };
    }
    const res = await fetch(`${API_CONFIG.BASE_URL}/assessments/${assessmentId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: _answers }),
    });
    if (!res.ok) throw new Error('Failed to submit assessment');
    return res.json();
  }
}

export const assessmentApi = new AssessmentApi();
