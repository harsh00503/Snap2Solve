export type AnalysisMode = 'DEBUG' | 'UNDERSTAND' | 'ACT';

export interface AnalysisRequest {
  imageDataUrl: string;
  question: string;
  mode: AnalysisMode;
  fileName?: string;
}

export interface AnalysisResult {
  mode: AnalysisMode;
  answer: string;
  summary: string;
}
