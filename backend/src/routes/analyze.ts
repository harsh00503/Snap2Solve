import { Router } from 'express';
import { analyzeImageWithGemma } from '../services/gemma.js';
import type { AnalyzeRequest } from '../types/analysis.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const body = req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return res.status(400).json({ message: 'Request body must be a JSON object.' });
    }

    const { imageDataUrl, question, mode, fileName } = body as Partial<AnalyzeRequest>;

    if (typeof imageDataUrl !== 'string' || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ message: 'Please upload an image and provide a question.' });
    }

    if (mode !== 'DEBUG' && mode !== 'UNDERSTAND' && mode !== 'ACT') {
      return res.status(400).json({ message: 'Invalid analysis mode selected.' });
    }

    const result = await analyzeImageWithGemma({
      imageDataUrl,
      question: question.trim(),
      mode,
      fileName: typeof fileName === 'string' ? fileName : undefined
    });

    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

export default router;
