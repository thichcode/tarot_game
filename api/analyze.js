/**
 * Vercel Serverless Function
 * POST /api/analyze
 * Body: { provider: 'openai'|'google'|'openrouter', prompt: string, model?: string }
 *
 * Reads secrets from environment variables:
 * - OPENAI_API_KEY
 * - GEMINI_API_KEY
 * - OPENROUTER_API_KEY
 */

const PROVIDERS = {
  openai: {
    keyEnv: 'OPENAI_API_KEY',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    defaultModel: 'gpt-4o-mini'
  },
  google: {
    keyEnv: 'GEMINI_API_KEY',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite-preview-09-2025:generateContent'
  },
  openrouter: {
    keyEnv: 'OPENROUTER_API_KEY',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    defaultModel: 'google/gemma-2-9b-it:free'
  }
};

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

async function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { error: { message: 'Method Not Allowed' } });
  }

  try {
    const { provider, prompt, model } = await readJson(req);

    if (!provider || !PROVIDERS[provider]) {
      return send(res, 400, { error: { message: 'Invalid provider' } });
    }
    if (!prompt || typeof prompt !== 'string') {
      return send(res, 400, { error: { message: 'Missing prompt' } });
    }

    const cfg = PROVIDERS[provider];
    const apiKey = process.env[cfg.keyEnv];
    if (!apiKey) {
      return send(res, 500, {
        error: {
          message: `Missing server environment variable: ${cfg.keyEnv}`
        }
      });
    }

    // Provider-specific request
    let upstreamUrl = cfg.endpoint;
    let headers = { 'Content-Type': 'application/json' };
    let body;

    if (provider === 'openai') {
      headers.Authorization = `Bearer ${apiKey}`;
      body = {
        model: model || cfg.defaultModel,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000
      };
    } else if (provider === 'openrouter') {
      headers.Authorization = `Bearer ${apiKey}`;
      // Optional: identify app
      headers['HTTP-Referer'] = req.headers.origin || req.headers.referer || '';
      headers['X-Title'] = 'Tarot Game';
      body = {
        model: model || cfg.defaultModel,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000
      };
    } else if (provider === 'google') {
      upstreamUrl = `${cfg.endpoint}?key=${encodeURIComponent(apiKey)}`;
      body = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000
        }
      };
    }

    const upstream = await fetch(upstreamUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    const text = await upstream.text();
    let json;
    try {
      json = text ? JSON.parse(text) : {};
    } catch (_) {
      json = { raw: text };
    }

    if (!upstream.ok) {
      return send(res, upstream.status, {
        error: {
          message: json?.error?.message || json?.message || text || 'Upstream error'
        }
      });
    }

    // Normalize response to: { text: string }
    let outText = '';
    if (provider === 'openai' || provider === 'openrouter') {
      outText = json?.choices?.[0]?.message?.content || '';
    } else if (provider === 'google') {
      const parts = json?.candidates?.[0]?.content?.parts;
      outText = Array.isArray(parts)
        ? parts.map(p => p?.text).filter(Boolean).join('')
        : (json?.candidates?.[0]?.content?.text || json?.candidates?.[0]?.text || '');
    }

    if (!outText) {
      return send(res, 500, { error: { message: 'Empty response from AI provider' } });
    }

    return send(res, 200, { text: outText });
  } catch (e) {
    return send(res, 500, { error: { message: e?.message || 'Server error' } });
  }
};
