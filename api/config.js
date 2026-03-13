export async function GET() {
  return new Response(JSON.stringify({
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
