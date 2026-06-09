// netlify/functions/reword.mjs
// GIBS Style Guide — AI reword endpoint.
// Calls the Anthropic Messages API server-side so the key is never exposed.
// Requires the env var ANTHROPIC_API_KEY (set in Netlify → Site settings → Environment variables).
// Optional env var CLAUDE_MODEL to override the model.

const MODEL = process.env.CLAUDE_MODEL || "claude-3-5-sonnet-latest";

const MODES = {
  active:  "Rewrite the text in the active voice. Keep the meaning, facts and figures exactly the same.",
  plain:   "Rewrite the text in plain language: short sentences, common words, one idea per sentence. Keep all facts.",
  concise: "Tighten the text: cut filler and redundancy while keeping every fact. Make it noticeably shorter.",
  gibs:    "Revise the text so it fully follows the GIBS house style below."
};

const GIBS = `GIBS house style:
- UK / South African English (organise, colour, programme, centre).
- Warm, human, plain and direct. Speak to one learner as "you".
- Active voice. Short sentences. One idea per paragraph.
- No jargon or AI-tells (no "delve", "leverage", "unlock", "elevate", "seamless", "in today's fast-paced world").
- Sentence case for in-page headings; Title Case only for course/module/page titles. Never ALL CAPS.
- Numbers: words for one to nine, numerals for 10 and above; numerals for marks, %, times, dates, steps and money. Rand uses a space as the thousands separator: R100 000, not R100,000.
- Do not invent facts. Preserve every data point, name and figure.`;

export default async (req) => {
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  let body;
  try { body = await req.json(); } catch { return json({ error: "Invalid JSON" }, 400); }

  const text = (body.text || "").toString().trim();
  const mode = MODES[body.mode] ? body.mode : "gibs";
  if (!text) return json({ error: "No text provided" }, 400);
  if (text.length > 8000) return json({ error: "Text too long (max 8000 characters)" }, 400);

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return json({ error: "Server not configured: ANTHROPIC_API_KEY is missing." }, 500);

  const system =
    `You are a careful editor for GIBS (Gordon Institute of Business Science) online courses. ${MODES[mode]}\n\n` +
    `Always apply this house style:\n${GIBS}\n\n` +
    `Return ONLY the revised text — no preamble, no commentary, no quotation marks around it.`;

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2048,
        system,
        messages: [{ role: "user", content: text }]
      })
    });

    if (!r.ok) {
      const detail = await r.text();
      return json({ error: "Anthropic API error " + r.status, detail: detail.slice(0, 300) }, 502);
    }

    const data = await r.json();
    const out = (data.content || []).map((b) => b.text || "").join("").trim();
    return json({ result: out });
  } catch (e) {
    return json({ error: "Request failed: " + e.message }, 500);
  }
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json" }
  });
}
