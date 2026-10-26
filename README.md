# Snap2Solve AI

Snap2Solve AI is a multimodal screenshot understanding app built for hackathon demos. It lets users upload a screenshot, ask a natural-language question, and get a structured AI response using a Gemini-backed model route.

## Architecture

- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- AI: Google Gen AI SDK with a Gemma model routed through the Gemini API

## Quick start

1. Copy the environment examples and add your keys.
2. Install dependencies in both apps.
3. Run the backend and frontend servers.
4. Open the frontend in a browser and upload an image.

### Frontend setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

### Backend setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Environment variables

Frontend:

```env
VITE_API_URL=http://localhost:4000/api
```

Backend:

```env
PORT=4000
GEMINI_API_KEY=your_google_ai_studio_key
GEMINI_MODEL=gemma-4-26b-a4b-it
```

## Notes

- The app validates uploaded files in both the browser and the backend.
- The default model is configured as `gemma-3-27b-it`, which is a supported Gemma model exposed through the Gemini API. If Google updates the model ID, update `GEMINI_MODEL` in `backend/.env`.
- If no Gemini API key is configured, the backend returns a clear configuration error instead of silently mocking answers.
