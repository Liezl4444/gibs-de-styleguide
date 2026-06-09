// netlify/functions/notes.mjs
// GIBS Style Guide — per-tab team notes (questions & suggestions).
// Reading is open to everyone. Posting / resolving / deleting requires the
// shared team passcode in the env var NOTES_PASSCODE.
// Stored in Netlify Blobs (store "gibs-notes", key "notes").

import { getStore } from "@netlify/blobs";

const KEY = "notes";

export default async (req) => {
  let body = {};
  if (req.method === "POST") {
    try { body = await req.json(); } catch { return json({ error: "Invalid JSON" }, 400); }
  }
  const action = body.action || (req.method === "GET" ? "list" : "");
  const store = getStore("gibs-notes");

  // --- Open: list all notes ---
  if (action === "list") {
    const notes = (await store.get(KEY, { type: "json" })) || [];
    return json({ notes });
  }

  // --- Everything else needs the passcode ---
  const pass = process.env.NOTES_PASSCODE;
  if (!pass) return json({ error: "Server not configured: NOTES_PASSCODE is missing." }, 500);
  if ((body.passcode || "") !== pass) return json({ error: "Wrong passcode." }, 401);

  let notes = (await store.get(KEY, { type: "json" })) || [];

  if (action === "add") {
    const text = (body.text || "").toString().trim();
    if (!text) return json({ error: "No text provided." }, 400);
    if (text.length > 1000) return json({ error: "Note too long (max 1000 characters)." }, 400);
    const note = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      tab: (body.tab || "general").toString().slice(0, 40),
      name: (body.name || "Anonymous").toString().trim().slice(0, 60) || "Anonymous",
      kind: body.kind === "suggestion" ? "suggestion" : "question",
      text: text,
      ts: Date.now(),
      resolved: false
    };
    notes.push(note);
    await store.setJSON(KEY, notes);
    return json({ ok: true, note });
  }

  if (action === "resolve") {
    notes = notes.map((n) => (n.id === body.id ? { ...n, resolved: !n.resolved } : n));
    await store.setJSON(KEY, notes);
    return json({ ok: true });
  }

  if (action === "delete") {
    notes = notes.filter((n) => n.id !== body.id);
    await store.setJSON(KEY, notes);
    return json({ ok: true });
  }

  return json({ error: "Unknown action." }, 400);
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json" }
  });
}
