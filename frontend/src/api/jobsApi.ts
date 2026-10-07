import { API_CONFIG, sleep } from './config';
import { ApplicationTrackerItem } from '../types';
import mockJobs from '../mock/jobs.json';

class JobsApi {
  async getTrackedApplications(): Promise<ApplicationTrackerItem[]> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await sleep();
      return mockJobs as ApplicationTrackerItem[];
    }
    const res = await fetch(`${API_CONFIG.BASE_URL}/jobs/tracker`);
    if (!res.ok) throw new Error('Failed to fetch tracked applications');
    return res.json();
  }

  async updateStage(jobId: string, stage: ApplicationTrackerItem['stage']): Promise<void> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await sleep(150);
      return;
    }
    await fetch(`${API_CONFIG.BASE_URL}/jobs/tracker/${jobId}/stage`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage }),
    });
  }
}

export const jobsApi = new JobsApi();
