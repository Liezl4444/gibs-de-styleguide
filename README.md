# GIBS Brand &amp; Content Style Guide

A living, in-browser reference for the GIBS Instructional Design team — voice &amp; tone, writing rules, capitalisation, numbers &amp; currency, colour &amp; type, components, accessibility (UDL + WCAG), and a working Toolkit.

**Live:** https://gibs-de-styleguide.netlify.app

---

## What's in here

| Path | What it is |
|------|------------|
| `index.html` | The style guide — **this is the deployed site**. Edit this. |
| `assets/styles.css` | All styling (design tokens, type, components, tools). |
| `assets/guide.js` | Tab navigation, flip cards, accordions, mini-tabs. |
| `assets/tools.js` | Toolkit logic: spelling checker, approved-word register, reword, idea generator, AI build-prompt. |
| `standalone.html` | A self-contained single-file copy (everything inlined) — for **offline use / emailing**. Not needed for the website. |
| `netlify/functions/reword.mjs` | Serverless function that powers **Reword with AI**. |
| `netlify/functions/notes.mjs` | Serverless function for **per-tab team notes** (questions &amp; suggestions). |
| `package.json` | Declares the `@netlify/blobs` dependency used by the notes function. |
| `netlify.toml` | Netlify config (publish folder + functions directory). |

> **Editing tip:** `index.html` loads the three files in `assets/`. Make your changes there, commit, and push — Netlify redeploys automatically. No build step. (`standalone.html` is a snapshot; regenerate it only when you need a fresh offline copy.)

---

## The Toolkit (browser-only, no server needed)

- **UK/SA spelling troubleshooter** — flags US spellings, jargon and AI-tells.
- **GIBS approved words** — house-style register (e.g. *self-reflection*); feeds the spell-checker. Saved in the browser; Export/Import JSON to share one canonical list.
- **Reword with AI** — rewrites a paragraph to GIBS conventions *(requires the Netlify function — see below)*.
- **HTML interactive idea generator** — suggests a UDL/WCAG-aligned interaction, with a ready-to-paste AI build prompt.

---

## Deploying

The site is static. Netlify serves the repo root (`publish = "."` in `netlify.toml`) and runs functions from `netlify/functions/`.

**Continuous deployment:** connect this repo to Netlify (Site → Build &amp; deploy → Link repository). Leave the build command blank; publish directory is `.`. Every push to the main branch redeploys.

---

## Enabling "Reword with AI"

The reword tool calls `/.netlify/functions/reword`, which talks to the Anthropic API **server-side** so the key is never exposed in the page.

1. **Add the key** — Netlify → Site configuration → Environment variables → add:
   - `ANTHROPIC_API_KEY` = your Anthropic API key *(mark as Secret)*
   - *(optional)* `CLAUDE_MODEL` = a model id to override the default (`claude-3-5-sonnet-latest`)
2. **Deploy** — push to the repo (or Deploys → Trigger deploy).
3. **Test** — open the site → **Toolkit → Reword with AI** → paste a passive sentence → **Make active → Reword**.

Until the function and key are in place, the Reword tool shows a friendly "not connected yet" message and everything else keeps working.

---

## Enabling "Team notes" (per-tab questions &amp; suggestions)

The notes drawer lets your team leave questions and suggestions on each tab. **Reading is open to everyone; posting, resolving and deleting require a shared passcode.** Notes are stored in **Netlify Blobs** via `netlify/functions/notes.mjs`.

1. **Add the passcode** — Netlify → Site configuration → Environment variables → add:
   - `NOTES_PASSCODE` = your team passcode *(mark as Secret)*
2. **Blobs** — Netlify Blobs is enabled automatically; the `@netlify/blobs` package is declared in `package.json`, so Netlify installs it on deploy. No extra setup.
3. **Deploy**, then open the site — a **Notes** button appears bottom-right. Anyone can read; posting asks for the passcode (remembered on that device after the first correct entry).

Share the passcode with whoever should be able to post — including designers from other teams. Until the function and `NOTES_PASSCODE` are deployed, the Notes button stays hidden and the rest of the guide works normally.

### Local development (optional)

```bash
npm i -g netlify-cli
netlify dev
```

`netlify dev` serves the site and runs the function locally so you can test reword without burning deploys. Set `ANTHROPIC_API_KEY` in a local `.env` (do **not** commit it).

> `.env` and any secrets should be git-ignored. Never put the API key in `index.html` or any committed file.

---

## House conventions (summary)

- **Spelling:** UK / South African English (organise, programme, colour, centre).
- **Capitalisation:** Title Case for course/module/page titles; sentence case for in-page headings (Header, Subheader) and body. Never ALL CAPS.
- **Numbers:** words for one–nine, numerals for 10+; numerals for marks, %, times, dates, steps and money. Rand uses a space: **R100 000**, not R100,000.
- **Voice:** warm, human, plain, credible. No jargon or AI-tells.

Full detail lives in the guide itself.

---

## Notes

- Fonts: the guide uses the GIBS digital typeface **Arial** as the on-screen fallback for the licensed **Jubilat** (display) and **Metric** (body). To embed the licensed web fonts for all viewers, drop the `.woff2` files into `assets/fonts/` and add the `@font-face` rules described at the top of `assets/styles.css`.
- Accessibility is the baseline, not an extra: WCAG 2.1 AA contrast, alt text, keyboard operability, captions.
