import { API_CONFIG, sleep } from './config';

class AuthApi {
  async getSessionUser(): Promise<{ id: string; name: string; email: string; avatarUrl: string }> {
    if (API_CONFIG.USE_MOCK_DATA) {
      await sleep(100);
      return {
        id: 'usr_dev_saini',
        name: 'Dev Saini',
        email: 'dev.saini@careerpath.ai',
        avatarUrl: '',
      };
    }
    const res = await fetch(`${API_CONFIG.BASE_URL}/auth/session`);
    if (!res.ok) throw new Error('Session unauthorized');
    return res.json();
  }
}

export const authApi = new AuthApi();
