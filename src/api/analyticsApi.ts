import { API_CONFIG, sleep } from './config';
import { JdsModelResult, SdsWorkStyleResult } from '../types';
import mockResults from '../mock/modelResults.json';

class AnalyticsApi {
  async getJdsOutcomeAnalysis(): Promise<JdsModelResult> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await sleep();
      return mockResults.jdsModel as JdsModelResult;
    }
    const res = await fetch(`${API_CONFIG.BASE_URL}/models/jds/predict`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to fetch JDS outcome analysis');
    return res.json();
  }

  async getSdsWorkStyleAnalysis(): Promise<SdsWorkStyleResult> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await sleep();
      return mockResults.sdsModel as SdsWorkStyleResult;
    }
    const res = await fetch(`${API_CONFIG.BASE_URL}/models/sds/insights`);
    if (!res.ok) throw new Error('Failed to fetch SDS work style analysis');
    return res.json();
  }
}

export const analyticsApi = new AnalyticsApi();
