import { API_CONFIG, sleep } from './config';
import { MockInterviewStage } from '../types';
import mockInterviewData from '../mock/interviews.json';

class InterviewApi {
  async getInterviewSession(role: string = 'Data Scientist'): Promise<{ stages: MockInterviewStage[]; targetRole: string }> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await sleep();
      return {
        targetRole: role,
        stages: mockInterviewData.stages,
      };
    }
    const res = await fetch(`${API_CONFIG.BASE_URL}/interviews/session?role=${encodeURIComponent(role)}`);
    if (!res.ok) throw new Error('Failed to fetch interview questions');
    return res.json();
  }

  async submitStageAnswer(_stageId: number, _answer: string): Promise<{ feedbackScore: number; feedbackNotes: string }> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await sleep(600);
      return {
        feedbackScore: 84,
        feedbackNotes: 'Clear structure with strong analytical reasoning. Consider highlighting trade-offs earlier.',
      };
    }
    const res = await fetch(`${API_CONFIG.BASE_URL}/interviews/stage/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stageId: _stageId, answer: _answer }),
    });
    if (!res.ok) throw new Error('Failed to evaluate stage answer');
    return res.json();
  }
}

export const interviewApi = new InterviewApi();
