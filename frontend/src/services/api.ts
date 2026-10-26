import type { AnalysisMode, AnalysisRequest, AnalysisResult } from '../types/analysis';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export interface ServiceHealth {
  ok: boolean;
  configured: boolean;
  model: string;
}

export async function analyzeImage(payload: AnalysisRequest): Promise<AnalysisResult> {
  const response = await fetch(`${API_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Unable to analyze the uploaded screenshot.');
  }

  return result as AnalysisResult;
}

export async function getServiceHealth(): Promise<ServiceHealth> {
  const response = await fetch(`${API_URL.replace(/\/api\/?$/, '')}/health`);
  if (!response.ok) {
    throw new Error('The AI service health check failed.');
  }

  return response.json() as Promise<ServiceHealth>;
}

export const modeMeta: Record<AnalysisMode, { label: string; description: string; prompt: string }> = {
  DEBUG: {
    label: 'Debug',
    description: 'Investigate programming errors and technical issues.',
    prompt: 'Analyze the visible error, explain the likely cause, and recommend a fix.'
  },
  UNDERSTAND: {
    label: 'Understand',
    description: 'Explain documents, interfaces, notices, and unfamiliar content.',
    prompt: 'Explain the important information in this image in simple, clear language.'
  },
  ACT: {
    label: 'Act',
    description: 'Turn visual information into a practical checklist.',
    prompt: 'Convert the information in this image into a practical checklist of actions to take next.'
  }
};
