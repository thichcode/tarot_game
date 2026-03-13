/**
 * Vercel Serverless Function
 * GET /api/openrouter-models
 * Returns: { models: string[] }
 *
 * Fetches OpenRouter models list server-side and returns only free models.
 * If OPENROUTER_API_KEY is set, attaches it to improve reliability.
 */

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return send(res, 405, { error: { message: 'Method Not Allowed' } });
  }

  try {
    const headers = { 'Content-Type': 'application/json' };
    const key = process.env.OPENROUTER_API_KEY;
    if (key) headers.Authorization = `Bearer ${key}`;

    const upstream = await fetch('https://openrouter.ai/api/v1/models', { headers });
    if (!upstream.ok) {
      return send(res, upstream.status, { error: { message: await upstream.text() } });
    }
    const data = await upstream.json();
    const models = Array.isArray(data?.data) ? data.data : [];

    const freeModels = models
      .map(m => m?.id)
      .filter(Boolean)
      .filter(id => id.endsWith(':free'))
      .sort((a, b) => a.localeCompare(b));

    // Cache a bit on CDN for performance.
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
    return send(res, 200, { models: freeModels });
  } catch (e) {
    return send(res, 500, { error: { message: e?.message || 'Server error' } });
  }
};
