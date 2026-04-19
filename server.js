import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// ── Middleware ──────────────────────────────────────────
app.use(express.json());

// Serve the built React app
app.use(express.static(join(__dirname, 'dist')));

// ── In-memory cache ────────────────────────────────────
const cache = new Map();
const CACHE_TTL_MS = 60_000; // 60 seconds

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

function setCache(key, value) {
  cache.set(key, { value, timestamp: Date.now() });
}

// ── POST /api/recommend ────────────────────────────────
app.post('/api/recommend', async (req, res) => {
  const { nodesData, path, startNode, endNode, surgeActive } = req.body;

  // Validate required fields
  if (!startNode || !endNode || !path) {
    return res.status(400).json({ error: 'Missing required fields: startNode, endNode, path' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'placeholder_replace_with_real_key') {
    return res.json({
      recommendation: 'AI recommendation is offline. Please configure your Gemini API key.',
    });
  }

  // ── Cache lookup ──
  const cacheKey = `${startNode}|${endNode}|${!!surgeActive}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return res.json({ recommendation: cached, cached: true });
  }

  // ── Build the prompt (server-side, never exposed to client) ──
  const densityContext = Object.entries(nodesData || {})
    .filter(([id]) => path.includes(id) || id === startNode || id === endNode)
    .map(([id, data]) => `${id} density is ${data.density}%`)
    .join(', ');

  const prompt = `You are an AI crowd navigation assistant for a stadium. 
The user wants to navigate from node ${startNode} to node ${endNode}.
The computed optimal path is: ${path.join(' -> ')}.
Current relevant crowd densities: ${densityContext}.
Based on this path and crowd density, provide a helpful and encouraging 2-sentence navigation recommendation. Be concise.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 100 },
        }),
      }
    );

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return res.json({
          recommendation:
            'Hold tight! The Gemini API rate limit has been reached. Please wait a moment before trying another route.',
        });
      }
      throw new Error(`Gemini API returned status: ${status}`);
    }

    const data = await response.json();
    const recommendation =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Path looks clear, enjoy the event!';

    // Store in cache
    setCache(cacheKey, recommendation);

    return res.json({ recommendation });
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    return res.json({
      recommendation:
        'Unable to generate AI recommendation at this time. Follow the blue route on your map.',
    });
  }
});

// ── SPA fallback — all other routes serve index.html ───
app.get('{*path}', (_req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// ── Start ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ AeroFlow server running on port ${PORT}`);
});
