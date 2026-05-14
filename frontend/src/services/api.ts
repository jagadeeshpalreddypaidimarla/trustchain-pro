import axios from 'axios';
import { AnalysisResult } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function analyzeText(content: string, language?: string): Promise<AnalysisResult> {
  const response = await apiClient.post('/api/v1/analyze/text', {
    content,
    language,
  });
  return response.data;
}

export async function analyzeURL(url: string): Promise<AnalysisResult> {
  const response = await apiClient.post('/api/v1/analyze/url', { url });
  return response.data;
}

export async function checkHealth(): Promise<any> {
  const response = await apiClient.get('/health');
  return response.data;
}