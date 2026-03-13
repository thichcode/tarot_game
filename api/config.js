import { json } from '@vercel/json';

export function GET() {
  return json({
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
  });
}
