import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import analyzeRouter from './routes/analyze.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    configured: Boolean(process.env.GEMINI_API_KEY),
    model: process.env.GEMINI_MODEL || 'gemma-4-26b-a4b-it',
    status: 'Snap2Solve backend is running.'
  });
});

app.use('/api/analyze', analyzeRouter);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Snap2Solve backend listening on http://localhost:${port}`);
});
