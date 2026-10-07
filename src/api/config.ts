// Configuration for Backend API & Extraction Server
export const API_CONFIG = {
  USE_MOCK_DATA: true,
  DEMO_MODE: false, // Strict: Never auto-load fake users
  BACKEND_URL: 'http://127.0.0.1:8000',
  BASE_URL: 'http://127.0.0.1:8000/api',
  SIMULATED_LATENCY_MS: 150,
};

export const sleep = (ms: number = API_CONFIG.SIMULATED_LATENCY_MS) =>
  new Promise(resolve => setTimeout(resolve, ms));
