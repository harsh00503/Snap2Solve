import { GoogleGenAI } from '@google/genai';
import type { AnalyzeRequest, AnalyzeResponse } from '../types/analysis.js';

const DEFAULT_MODEL = 'gemma-4-26b-a4b-it';

function parseDataUrl(dataUrl: string) {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/s.exec(dataUrl);
  if (!match) {
    throw new Error('The uploaded image must be a valid data URL.');
  }

  const mimeType = match[1];
  const data = match[2];

  if (!['image/png', 'image/jpeg', 'image/webp'].includes(mimeType)) {
    throw new Error('Unsupported image type. Please upload PNG, JPEG, or WebP.');
  }

  const sizeInBytes = Math.ceil((data.length * 3) / 4);
  if (sizeInBytes > 5 * 1024 * 1024) {
    throw new Error('Uploaded image exceeds the 5 MB size limit.');
  }

  return { mimeType, data };
}

function buildPrompt({ mode, question }: Pick<AnalyzeRequest, 'mode' | 'question'>) {
  const instructions = {
    DEBUG: 'Identify the likely root cause of the technical issue, explain the relevant error clues, and give a practical step-by-step fix.',
    UNDERSTAND: 'Explain the contents clearly and simply, including key details, context, and what matters most to a user.',
    ACT: 'Turn the visible information into a concise checklist of actions the user should take next.'
  };

  return `You are Snap2Solve AI. ${instructions[mode]}\n\nUser question: ${question}\n\nProvide a concise but useful answer with a short summary at the top and a clear step-by-step explanation below.`;
}

export async function analyzeImageWithGemma(request: AnalyzeRequest): Promise<AnalyzeResponse> {
  const { mimeType, data } = parseDataUrl(request.imageDataUrl);

  if (!process.env.GEMINI_API_KEY) {
    throw Object.assign(new Error('GEMINI_API_KEY is not configured. Add your Google AI Studio key to backend/.env.'), {
      statusCode: 400
    });
  }

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const response = await ai.models.generateContent({
    model,
    contents: [{
      role: 'user',
      parts: [
        { text: buildPrompt(request) },
        { inlineData: { mimeType, data } }
      ]
    }]
  });

  const text = response.text?.trim() || '';

  if (!text.trim()) {
    throw new Error('The AI did not return any usable content for this image.');
  }

  const parsed = text.trim();
  const summary = parsed.split(/\n+/).find((line) => line.trim().length > 0) || 'Visual analysis complete.';

  return {
    mode: request.mode,
    answer: parsed,
    summary: summary.slice(0, 180)
  };
}
