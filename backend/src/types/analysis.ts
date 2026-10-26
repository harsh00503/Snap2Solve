export type AnalysisMode = 'DEBUG' | 'UNDERSTAND' | 'ACT';

export interface AnalyzeRequest {
  imageDataUrl: string;
  question: string;
  mode: AnalysisMode;
  fileName?: string;
}

export interface AnalyzeResponse {
  mode: AnalysisMode;
  answer: string;
  summary: string;
}
