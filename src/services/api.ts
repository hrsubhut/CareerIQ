/**
 * CareerIQ Base API Configuration
 * 
 * Strict Architecture Rule:
 * The frontend communicates ONLY with the API Gateway (port 8000).
 * No direct calls to individual microservices or external third-party AI APIs.
 */

export const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8000';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Accept': 'application/json',
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    let errorDetail = 'API request failed';
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail?.message || errJson.detail || JSON.stringify(errJson);
    } catch {
      errorDetail = await response.text();
    }
    throw new Error(`[${response.status}] ${errorDetail}`);
  }

  return response.json();
}
