// Configuration for Backend API Gateway
export const API_CONFIG = {
  USE_MOCK_DATA: false,
  DEMO_MODE: false,
  BACKEND_URL: import.meta.env.VITE_API_GATEWAY_URL || 'http://127.0.0.1:8000',
  BASE_URL: (import.meta.env.VITE_API_GATEWAY_URL || 'http://127.0.0.1:8000') + '/api/v1',
  SIMULATED_LATENCY_MS: 50,
};

export const sleep = (ms: number = API_CONFIG.SIMULATED_LATENCY_MS) =>
  new Promise(resolve => setTimeout(resolve, ms));
