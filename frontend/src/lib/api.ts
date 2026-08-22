import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// ── Types ──

export interface StartupData {
  name: string;
  revenue: number;
  burn: number;
  cash: number;
  ltv: number;
  cac: number;
  new_revenue_pm: number;
  growth_rate: number;
  employees: number;
  cogs?: number;
  opex?: number;
  churn?: number;
}

export interface Metrics {
  runway: number;
  risk: string;
  status: string;
  ebitda: number;
  ltv_cac: number;
  burn_multiple: number;
  magic_number: number;
  churn_rate: number;
  projection: ProjectionPoint[];
  arr: number;
  gross_margin: number;
}

export interface ProjectionPoint {
  month: string;
  cash: number;
  revenue: number;
  expenses: number;
}

export interface CalculateResponse {
  metrics: Metrics;
  startup_data: any;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface ChatRequest {
  session_id: string;
  messages: ChatMessage[];
  startup_data: StartupData;
}

export interface SessionSummary {
  id: string;
  title: string;
  last_updated: string;
  message_count: number;
}

// ── API Calls ──

export const calculateMetrics = async (data: StartupData): Promise<CalculateResponse> => {
  const response = await api.post('/calculate', data);
  return response.data;
};

export const askChat = async (request: ChatRequest): Promise<{ response: string; history: ChatMessage[] }> => {
  const response = await api.post('/chat', request);
  return response.data;
};

export const getSession = async (sessionId: string) => {
  const response = await api.get(`/session/${sessionId}`);
  return response.data;
};

export const clearSession = async (sessionId: string) => {
  const response = await api.delete(`/session/${sessionId}`);
  return response.data;
};

export const listSessions = async (): Promise<{ sessions: SessionSummary[] }> => {
  const response = await api.get('/sessions');
  return response.data;
};

export default api;
