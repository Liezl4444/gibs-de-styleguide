/* ============================================================
   GIBS Style Guide — Toolkit
   1. UK/SA spelling troubleshooter
   2. UDL/WCAG interactive idea generator
   Runs fully client-side. No network.
   ============================================================ */
(function () {
  "use strict";

  /* ==========================================================
     1 · UK / SA SPELLING TROUBLESHOOTER
     ========================================================== */

  // Explicit US -> UK/SA dictionary (most reliable). Lowercase keys.
  var DICT = {
    // -ize / -ise family
    organize:"organise", organized:"organised", organizing:"organising", organization:"organisation", organizations:"organisations", organizational:"organisational",
    realize:"realise", realized:"realised", realizing:"realising", realization:"realisation",
    recognize:"recognise", recognized:"recognised", recognizing:"recognising",
    emphasize:"emphasise", emphasized:"emphasised", emphasizing:"emphasising",
    prioritize:"prioritise", prioritized:"prioritised", prioritizing:"prioritising",
    summarize:"summarise", summarized:"summarised", summarizing:"summarising",
    maximize:"maximise", minimize:"minimise", optimize:"optimise", optimized:"optimised", optimizing:"optimising",
    specialize:"specialise", specialized:"specialised", customize:"customise", customized:"customised",
    standardize:"standardise", standardized:"standardised", categorize:"categorise", categorized:"categorised",
    characterize:"characterise", apologize:"apologise", criticize:"criticise", criticized:"criticised",
    finalize:"finalise", finalized:"finalised", finalizing:"finalising",
    formalize:"formalise", normalize:"normalise", capitalize:"capitalise", capitalized:"capitalised",
    modernize:"modernise", theorize:"theorise", hypothesize:"hypothesise", mobilize:"mobilise",
    stabilize:"stabilise", visualize:"visualise", visualized:"visualised", synthesize:"synthesise",
    memorize:"memorise", familiarize:"familiarise", civilize:"civilise", utilize:"utilise", utilized:"utilised",
    // -yze
    analyze:"analyse", analyzed:"analysed", analyzing:"analysing", analyzes:"analyses",
    paralyze:"paralyse", catalyze:"catalyse",
    // -or -> -our
    color:"colour", colored:"coloured", coloring:"colouring", colors:"colours",
    behavior:"behaviour", behaviors:"behaviours", behavioral:"behavioural",
    favor:"favour", favored:"favoured", favorite:"favourite", favorites:"favourites", favorable:"favourable",
    honor:"honour", honored:"honoured", honorable:"honourable",
    labor:"labour", labored:"laboured", neighbor:"neighbour", neighbors:"neighbours", neighborhood:"neighbourhood",
    flavor:"flavour", flavored:"flavoured", humor:"humour", humorous:"humorous",
    rumor:"rumour", vapor:"vapour", harbor:"harbour", savor:"savour", endeavor:"endeavour",
    vigor:"vigour", rigor:"rigour", odor:"odour", valor:"valour", splendor:"splendour",
    demeanor:"demeanour", parlor:"parlour", savior:"saviour", tumor:"tumour",
    // -er -> -re
    center:"centre", centered:"centred", centers:"centres", centering:"centring",
    theater:"theatre", meter:"metre", meters:"metres", liter:"litre", liters:"litres",
    fiber:"fibre", caliber:"calibre", somber:"sombre", specter:"spectre", meager:"meagre",
    maneuver:"manoeuvre",
    // -se -> -ce
    defense:"defence", offense:"offence", pretense:"pretence",
    // -og -> -ogue
    catalog:"catalogue", catalogs:"catalogues", dialog:"dialogue", analog:"analogue",
    monolog:"monologue", prolog:"prologue", epilog:"epilogue",
    // double consonant (UK doubles before -ed/-ing/-er)
    traveling:"travelling", traveled:"travelled", traveler:"traveller", travelers:"travellers",
    canceled:"cancelled", canceling:"cancelling", modeling:"modelling", modeled:"modelled",
    labeled:"labelled", labeling:"labelling", labels:"labels", fueled:"fuelled", fueling:"fuelling",
    signaling:"signalling", signaled:"signalled", counseling:"counselling", counselor:"counsellor",
    counselors:"counsellors", jeweler:"jeweller", marvelous:"marvellous", totaled:"totalled",
    // single l at word end / -ll words
    enrollment:"enrolment", enroll:"enrol", enrolled:"enrolled", fulfill:"fulfil", fulfillment:"fulfilment",
    installment:"instalment", skillful:"skilful", willful:"wilful", distill:"distil", instill:"instil",
    // misc common
    program:"programme", programs:"programmes", gray:"grey", grayer:"greyer",
    mold:"mould", molded:"moulded", smolder:"smoulder", plow:"plough",
    aluminum:"aluminium", sulfur:"sulphur", donut:"doughnut", cozy:"cosy",
    check:"cheque", tire:"tyre", curb:"kerb", mustache:"moustache", pajamas:"pyjamas",
    jewelry:"jewellery", math:"maths", acknowledgment:"acknowledgement", licorice:"liquorice",
    practiced:"practised", practicing:"practising"
  };

  // Notes attached to specific corrections
  var NOTE = {
    program:"UK 'programme' — keep 'program' only for computer code",
    programs:"UK 'programmes' — keep 'program' only for computer code",
    check:"as a bank cheque; 'check' is fine for verifying",
    practiced:"verb takes -ise; the noun stays 'practice'",
    practicing:"verb takes -ise; the noun stays 'practice'",
    utilize:"valid as 'utilise' — but prefer plain 'use'",
    utilized:"valid as 'utilised' — but prefer plain 'use'"
  };

  // Words that look like -ize/-ise verbs but are NOT (don't suffix-convert)
  var IZE_SAFE = {size:1,sizes:1,sized:1,sizing:1,prize:1,prizes:1,prized:1,seize:1,seizes:1,
    seized:1,seizing:1,maize:1,capsize:1,downsize:1,downsized:1,oversize:1,resize:1,resized:1,
    midsize:1,upsize:1,baize:1};

  // Light jargon / AI-tell watch (single words). value = suggested fix.
  var JARGON = {
    delve:"look at / examine", leverage:"use", leveraging:"using", leveraged:"used",
    utilize:"use", utilise:"use", utilized:"used", utilised:"used",
    elevate:"raise / improve", unlock:"open up / enable", harness:"use",
    synergy:"combined effect", synergies:"shared gains", robust:"strong / reliable",
    seamless:"smooth", holistic:"whole / rounded", paradigm:"model", myriad:"many",
    plethora:"plenty of", showcase:"show", spearhead:"lead", utilization:"use"
  };

  function matchCase(suggestion, original) {
    if (original.length > 1 && original === original.toUpperCase())
      return suggestion.toUpperCase();
    if (original[0] === original[0].toUpperCase())
      return suggestion.charAt(0).toUpperCase() + suggestion.slice(1);
    return suggestion;
  }

  // Returns {to, note} for a US spelling, or null.
  function spellingFix(lower) {
    if (DICT.hasOwnProperty(lower)) return { to: DICT[lower], note: NOTE[lower] || "" };
    if (IZE_SAFE[lower]) return null;
    // suffix fallbacks
    if (/yze$/.test(lower))   return { to: lower.replace(/yze$/, "yse"), note: "" };
    if (/yzed$/.test(lower))  return { to: lower.replace(/yzed$/, "ysed"), note: "" };
    if (/yzing$/.test(lower)) return { to: lower.replace(/yzing$/, "ysing"), note: "" };
    if (/ization$/.test(lower)) return { to: lower.replace(/ization$/, "isation"), note: "" };
    if (/ize$/.test(lower))   return { to: lower.replace(/ize$/, "ise"), note: "" };
    if (/ized$/.test(lower))  return { to: lower.replace(/ized$/, "ised"), note: "" };
    if (/izing$/.test(lower)) return { to: lower.replace(/izing$/, "ising"), note: "" };
    if (/izes$/.test(lower))  return { to: lower.replace(/izes$/, "ises"), note: "" };
    return null;
  }

  var spIn = document.getElementById("sp-in");
  var spResult = document.getElementById("sp-result");

  function runSpellCheck() {
    var text = (spIn.value || "").trim();
    if (!text) {
      spResult.innerHTML = '<div class="verdict warn"><span class="vic">!</span><div>Type or paste some text first.</div></div>';
      return;
    }
    var spell = [];   // {from,to,note}
    var style = [];   // {from,to}
    var house = [];   // {from,to,note}  GIBS approved-word preferences
    var seenSpell = {}, seenStyle = {}, seenHouse = {};

    // GIBS approved-word (house style) scan — phrases and words, case-insensitive
    APPROVED.forEach(function (a) {
      if (!a.avoid) return;
      var re = new RegExp("\\b" + escapeRegex(a.avoid) + "\\b", "i");
      if (re.test(text)) {
        var key = a.avoid.toLowerCase();
        if (!seenHouse[key]) { house.push({ from: a.avoid, to: a.pref, note: a.note || "" }); seenHouse[key] = 1; }
      }
    });

    var html = escapeHtml(text).replace(/[A-Za-z][A-Za-z'\u2019-]*/g, function (word) {
      var lower = word.toLowerCase().replace(/[\u2019']/g, "'");
      var fix = spellingFix(lower.replace(/'/g, ""));
      if (fix && fix.to !== lower.replace(/'/g, "")) {
        var to = matchCase(fix.to, word);
        var key = word.toLowerCase();
        if (!seenSpell[key]) { spell.push({ from: word, to: to, note: fix.note }); seenSpell[key] = 1; }
        return '<mark class="sp-flag" title="UK/SA: ' + to + '">' + word + "</mark>";
      }
      var jbase = lower.replace(/'/g, "");
      if (JARGON.hasOwnProperty(jbase)) {
        var jk = jbase;
        if (!seenStyle[jk]) { style.push({ from: word, to: JARGON[jbase] }); seenStyle[jk] = 1; }
        return '<mark class="sp-style" title="Plainer: ' + JARGON[jbase] + '">' + word + "</mark>";
      }
      return word;
    });

    var out = "";
    if (spell.length === 0) {
      out += '<div class="verdict ok"><span class="vic">\u2713</span><div><b>No US spellings found.</b> Nothing tripped our UK/SA rules. Remember this is a quick pass, not a full proofread.</div></div>';
    } else {
      out += '<div class="verdict warn"><span class="vic">\u2715</span><div><b>' + spell.length +
        (spell.length === 1 ? " spelling to fix." : " spellings to fix.") +
        '</b> Swap the US forms for the GIBS UK/SA spelling.</div></div>';
    }

    out += '<div class="sp-output">' + html.replace(/\n/g, "<br>") + "</div>";

    if (spell.length) {
      out += '<ul class="fixlist">';
      spell.forEach(function (f) {
        out += "<li><span class=\"from\">" + escapeHtml(f.from) + "</span><span class=\"arrow\">\u2192</span><span class=\"to\">" +
          escapeHtml(f.to) + "</span>" + (f.note ? '<span class="why">' + escapeHtml(f.note) + "</span>" : "") + "</li>";
      });
      out += "</ul>";
    }
    if (style.length) {
      out += '<p class="field-label" style="margin-top:20px">Also worth a look — jargon &amp; AI-tells</p>';
      out += '<ul class="fixlist style">';
      style.forEach(function (f) {
        out += "<li><span class=\"from\">" + escapeHtml(f.from) + "</span><span class=\"arrow\">\u2192</span><span class=\"to\">" +
          escapeHtml(f.to) + '</span><span class="why">plainer, warmer</span></li>';
      });
      out += "</ul>";
    }
    if (house.length) {
      out += '<p class="field-label" style="margin-top:20px">GIBS house style — use the approved form</p>';
      out += '<ul class="fixlist house">';
      house.forEach(function (f) {
        out += "<li><span class=\"from\">" + escapeHtml(f.from) + "</span><span class=\"arrow\">\u2192</span><span class=\"to\">" +
          escapeHtml(f.to) + "</span>" + (f.note ? '<span class="why">' + escapeHtml(f.note) + "</span>" : '<span class="why">GIBS approved</span>') + "</li>";
      });
      out += "</ul>";
    }
    if (spell.length || style.length || house.length) {
      out += '<div class="legend"><span><i style="background:#fbe3e3;border:1px solid #9E191D"></i> US spelling</span>' +
        '<span><i style="background:#fbeed6;border:1px solid #C9632F"></i> jargon / AI-tell</span>' +
        '<span><i style="background:#e4ecf8;border:1px solid #2A6FDB"></i> GIBS house style</span></div>';
    }
    spResult.innerHTML = out;
  }

  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  if (spIn) {
    document.getElementById("sp-go").addEventListener("click", runSpellCheck);
    document.getElementById("sp-clear").addEventListener("click", function () {
      spIn.value = ""; spResult.innerHTML = ""; spIn.focus();
    });
    spIn.addEventListener("keydown", function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") runSpellCheck();
    });
    document.querySelectorAll(".chip-btn").forEach(function (c) {
      c.addEventListener("click", function () { spIn.value = c.getAttribute("data-try"); runSpellCheck(); });
    });
  }

  /* ==========================================================
     1b · GIBS APPROVED-WORD REGISTER (house style)
     ========================================================== */
  var AW_KEY = "gibs-approved-words";
  var AW_DEFAULTS = [
    { pref: "self-reflection", avoid: "self reflection", note: "hyphenated" },
    { pref: "decision-making", avoid: "decision making", note: "hyphenated as a modifier" },
    { pref: "email", avoid: "e-mail", note: "one word, no hyphen" },
    { pref: "workplace", avoid: "work place", note: "one word" },
    { pref: "online", avoid: "on-line", note: "one word" },
    { pref: "case study", avoid: "case-study", note: "two words as a noun" }
  ];
  var APPROVED = loadApproved();

  function loadApproved() {
    try { var s = localStorage.getItem(AW_KEY); if (s) return JSON.parse(s); } catch (e) {}
    return AW_DEFAULTS.slice();
  }
  function saveApproved() {
    try { localStorage.setItem(AW_KEY, JSON.stringify(APPROVED)); } catch (e) {}
  }

  var awBody = document.getElementById("aw-body");

  function renderApproved() {
    if (!awBody) return;
    if (!APPROVED.length) {
      awBody.innerHTML = '<tr><td colspan="4" style="color:var(--ink-soft)">No words yet. Add your first preferred spelling below.</td></tr>';
      return;
    }
    awBody.innerHTML = APPROVED.map(function (a, i) {
      return "<tr><td class=\"pref\">" + escapeHtml(a.pref) + "</td><td class=\"avoid\">" +
        escapeHtml(a.avoid || "—") + "</td><td>" + escapeHtml(a.note || "") +
        "</td><td><button class=\"aw-del\" data-i=\"" + i + "\" aria-label=\"Remove " + escapeHtml(a.pref) + "\">\u00d7</button></td></tr>";
    }).join("");
    awBody.querySelectorAll(".aw-del").forEach(function (b) {
      b.addEventListener("click", function () {
        APPROVED.splice(parseInt(b.getAttribute("data-i"), 10), 1);
        saveApproved(); renderApproved();
      });
    });
  }

  if (awBody) {
    renderApproved();
    document.getElementById("aw-add").addEventListener("click", function () {
      var pref = document.getElementById("aw-pref").value.trim();
      var avoid = document.getElementById("aw-avoid").value.trim();
      var note = document.getElementById("aw-note").value.trim();
      if (!pref) { document.getElementById("aw-pref").focus(); return; }
      APPROVED.push({ pref: pref, avoid: avoid, note: note });
      saveApproved(); renderApproved();
      document.getElementById("aw-pref").value = "";
      document.getElementById("aw-avoid").value = "";
      document.getElementById("aw-note").value = "";
      document.getElementById("aw-pref").focus();
    });
    document.getElementById("aw-export").addEventListener("click", function () {
      var blob = new Blob([JSON.stringify(APPROVED, null, 2)], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url; a.download = "gibs-approved-words.json";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
    document.getElementById("aw-import-btn").addEventListener("click", function () {
      document.getElementById("aw-import").click();
    });
    document.getElementById("aw-import").addEventListener("change", function (e) {
      var file = e.target.files[0]; if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var data = JSON.parse(reader.result);
          if (Array.isArray(data)) {
            APPROVED = data.filter(function (x) { return x && x.pref; }).map(function (x) {
              return { pref: String(x.pref), avoid: String(x.avoid || ""), note: String(x.note || "") };
            });
            saveApproved(); renderApproved();
          }
        } catch (err) {}
        e.target.value = "";
      };
      reader.readAsText(file);
    });
    document.getElementById("aw-reset").addEventListener("click", function () {
      APPROVED = AW_DEFAULTS.slice(); saveApproved(); renderApproved();
    });
  }

  /* ==========================================================
     1c · REWORD WITH AI  (calls /.netlify/functions/reword)
     ========================================================== */
  var rwIn = document.getElementById("rw-in");
  var rwResult = document.getElementById("rw-result");
  var rwMode = "active";

  function rwNotConnected() {
    return '<div class="verdict warn"><span class="vic">!</span><div><b>Reword isn\u2019t connected yet.</b> ' +
      'This feature needs the GIBS Netlify Function and the ANTHROPIC_API_KEY to be deployed. ' +
      'Until then, use the spelling and house-style tools above.</div></div>';
  }

  async function runReword() {
    var text = (rwIn.value || "").trim();
    if (!text) {
      rwResult.innerHTML = '<div class="verdict warn"><span class="vic">!</span><div>Paste some text first.</div></div>';
      return;
    }
    rwResult.innerHTML = '<div class="verdict ok"><span class="vic">\u2026</span><div>Rewording\u2026</div></div>';
    try {
      var res = await fetch("/.netlify/functions/reword", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: text, mode: rwMode })
      });
      if (res.status === 404) { rwResult.innerHTML = rwNotConnected(); return; }
      if (!res.ok) {
        var err = await res.json().catch(function () { return {}; });
        rwResult.innerHTML = '<div class="verdict warn"><span class="vic">!</span><div><b>Couldn\u2019t reword.</b> ' +
          escapeHtml(err.error || ("Error " + res.status)) + "</div></div>";
        return;
      }
      var data = await res.json();
      var out = data.result || "";
      rwResult.innerHTML =
        '<p class="field-label" style="margin-top:18px">Reworded</p>' +
        '<div class="sp-output" style="white-space:pre-wrap">' + escapeHtml(out) + "</div>" +
        '<div class="btn-row"><button class="btn btn-ghost btn-copy" id="rw-copy" data-label="Copy result">Copy result</button></div>';
      var cb = document.getElementById("rw-copy");
      cb.addEventListener("click", function () {
        var done = function () {
          cb.textContent = "Copied \u2713"; cb.classList.add("copied");
          setTimeout(function () { cb.textContent = "Copy result"; cb.classList.remove("copied"); }, 1800);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(out).then(done).catch(function () { fallbackCopy(out); done(); });
        } else { fallbackCopy(out); done(); }
      });
    } catch (e) {
      rwResult.innerHTML = rwNotConnected();
    }
  }

  if (rwIn) {
    var rwSeg = document.getElementById("rw-seg");
    rwSeg.querySelectorAll(".opt").forEach(function (b) {
      b.addEventListener("click", function () {
        rwSeg.querySelectorAll(".opt").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        rwMode = b.getAttribute("data-mode");
      });
    });
    document.getElementById("rw-go").addEventListener("click", runReword);
    document.getElementById("rw-clear").addEventListener("click", function () {
      rwIn.value = ""; rwResult.innerHTML = ""; rwIn.focus();
    });
  }

  /* ==========================================================
     2 · UDL / WCAG INTERACTIVE IDEA GENERATOR
     ========================================================== */

  // udl keys: rep = representation, eng = engagement, act = action & expression
  var PATTERNS = [
    { name:"Flip cards", intents:["recall"], udl:["rep","eng"],
      what:"Term on the front, definition on the back. Learners click or key to reveal — active recall in one tap.",
      wcag:["Operable by keyboard (Enter / Space), with a visible focus ring","Use aria-pressed so screen readers announce flipped state","Both faces meet 4.5:1 contrast","Never put required or sequential content behind the flip"],
      tip:"Best for term + definition or prompt + answer. Keep each face to one short idea." },
    { name:"Matching pairs", intents:["recall","check"], udl:["act","eng"],
      what:"Learners pair concepts with their definitions or examples by selecting, then connecting.",
      wcag:["Offer a click-to-select alternative to drag-and-drop","Announce correct / incorrect via an aria-live region, not colour alone","Give a clear instruction and a reset","Ensure pairs are reachable and operable by keyboard"],
      tip:"Great low-stakes warm-up. Cap it at 5–6 pairs so it stays scannable." },
    { name:"Click-to-reveal list", intents:["recall","explore"], udl:["rep"],
      what:"A list of prompts where each item expands to reveal detail on demand — learner controls the pace.",
      wcag:["Use real <button> semantics for each trigger","Revealed content sits next in the DOM and reading order","Manage focus so it lands on the new content","Don't convey state by icon colour alone"],
      tip:"Use when detail would otherwise create a wall of text. Pairs well with the accordion pattern." },
    { name:"Drag-to-categorise", intents:["apply","check"], udl:["act","eng"],
      what:"Learners sort items into buckets (e.g. risk vs opportunity), applying a concept to make judgements.",
      wcag:["Provide a keyboard path: select an item, then choose its category","Status and score via aria-live, never colour-only","State the rules up front and allow retry","Large hit targets (≥44px) for every draggable"],
      tip:"Strong for 'apply the framework' moments. Keep categories to 2–4." },
    { name:"Knowledge check (quiz)", intents:["check","recall"], udl:["eng"],
      what:"A short set of questions with immediate, explanatory feedback — not just right/wrong.",
      wcag:["Associate every option with a real <label>","Feedback uses words + icon, not colour alone","Announce results in an aria-live region","Fully keyboard-operable; no time limit, or make it adjustable"],
      tip:"Write feedback that teaches: explain why a distractor is wrong, not just that it is." },
    { name:"Tabbed views", intents:["compare","explore"], udl:["rep"],
      what:"Parallel, comparable content (e.g. theory / example / apply) split across tabs the learner switches between.",
      wcag:["Implement the ARIA tabs pattern: roving tabindex, arrow-key nav","Each panel labelled by its tab (aria-controls / aria-labelledby)","aria-selected reflects the active tab","Don't use tabs for one continuous narrative"],
      tip:"Ideal for comparing perspectives side-by-side. Three to four tabs is the sweet spot." },
    { name:"Comparison table", intents:["compare"], udl:["rep"],
      what:"A structured side-by-side of options against shared criteria — the clearest way to compare.",
      wcag:["Use <th scope> for row and column headers","Add a <caption> describing the table","Never encode meaning in cell colour alone","Keep it readable when zoomed and on narrow screens"],
      tip:"Resist decorative data. Every row and column should earn its place." },
    { name:"Before / after slider", intents:["compare","explore"], udl:["rep"],
      what:"A draggable divider reveals a 'before' and 'after' state of the same image or scenario.",
      wcag:["Expose it as role=slider with aria-valuenow / aria-valuetext","Move it with arrow keys, not just the pointer","Provide a text description of both states","Strong contrast on the handle and labels"],
      tip:"Powerful for change, growth, or design critique. Always caption what changed." },
    { name:"Branching scenario", intents:["apply"], udl:["eng","act"],
      what:"Learners make a decision, see the consequence, and continue — practising judgement in a safe space.",
      wcag:["Each choice is a real button or link, reachable by keyboard","Move focus to the new node and announce the change","Offer a way to go back or restart","Provide a text summary of the path for screen-reader users"],
      tip:"Anchor it in a realistic, ideally African, business situation. Keep branches to 2–3 deep." },
    { name:"Decision tree / flow", intents:["apply","sequence"], udl:["act","rep"],
      what:"An interactive 'if this, then that' guide learners walk through to reach a recommendation.",
      wcag:["Every node and choice operable by keyboard with visible focus","Provide an equivalent text or linear version of the logic","Don't rely on layout/colour alone to show the path","Announce each step as it appears"],
      tip:"Best when there's a real procedure or diagnostic to follow. Pair with a downloadable version." },
    { name:"Sequence / ordering", intents:["sequence","check"], udl:["act"],
      what:"Learners arrange steps, events, or priorities into the correct order to show process understanding.",
      wcag:["Provide move-up / move-down buttons as a keyboard alternative to dragging","Announce each item's new position via aria-live","Clear instructions and a reset","Adequate spacing and target size for each item"],
      tip:"Ideal for processes and methodologies. Give feedback on the logic, not just the order." },
    { name:"Interactive timeline", intents:["sequence","explore"], udl:["rep"],
      what:"A navigable timeline of events or phases, each opening to richer detail.",
      wcag:["Build on a semantic ordered list, not just absolute positioning","Keyboard-navigable points with visible focus","Provide a text alternative to any horizontal-scroll-only view","Don't lock meaning to position or colour alone"],
      tip:"Great for case histories and phased models. Keep nodes to a readable number (6–8)." },
    { name:"Image hotspots", intents:["explore","apply"], udl:["rep","eng"],
      what:"A labelled image where focusable markers reveal explanations — explore a diagram, workspace, or map.",
      wcag:["Each hotspot is a focusable button with a descriptive label","Trigger on click/focus, never hover alone","Meaningful alt text on the base image","Markers large enough to target and high-contrast"],
      tip:"Brilliant for 'spot the issue' or anatomy-of-a-thing content. Number the hotspots for order." },
    { name:"Annotated diagram", intents:["explore"], udl:["rep"],
      what:"A diagram with callouts that explain each part, building a mental model piece by piece.",
      wcag:["Give every annotation a text equivalent in logical reading order","Don't depend on spatial position to convey relationships","Sufficient contrast for lines, labels and fills","Scalable without breaking when zoomed to 200%"],
      tip:"Use for frameworks and models. Reveal annotations on demand to avoid overload." },
    { name:"Accordion", intents:["explore"], udl:["rep"],
      what:"Stacked, expandable panels for optional detail, FAQs, or deep-dives the learner can choose to open.",
      wcag:["Prefer native <details>/<summary> for free keyboard + SR support","Keep essential, sequential learning visible by default","Indicate state with text/icon plus colour","Logical heading levels inside each panel"],
      tip:"Perfect for 'want to go deeper?' content. Don't hide anything assessed inside it." },
    { name:"Reflection prompt + scale", intents:["reflect"], udl:["eng","act"],
      what:"An open prompt plus a confidence or agreement scale, inviting learners to self-assess and connect.",
      wcag:["Label the text area and the scale control clearly","Expose the scale as a slider with aria-valuetext","Save responses locally so reflections persist","Never require a response to progress — keep it low-pressure"],
      tip:"Anchor reflection to their own organisation. Store entries in localStorage so they aren't lost." },
    { name:"Self-assessment checklist", intents:["reflect","check"], udl:["eng"],
      what:"Learners rate themselves against the learning outcomes, surfacing what to revisit.",
      wcag:["Use real checkboxes with associated labels","Group with <fieldset> and a <legend>","Announce progress / score via aria-live","Operable and visible at every zoom level"],
      tip:"Tie each item directly to a learning outcome verb. End with a 'what next' nudge." },
    { name:"Scenario simulation", intents:["apply"], udl:["eng","act"],
      what:"A short role-play where inputs change the outcome — learners test decisions and see ripple effects.",
      wcag:["Every control keyboard-operable with visible focus","Provide a text transcript of states and outcomes","No reliance on fast reactions; make any timing adjustable","Announce outcome changes via aria-live"],
      tip:"High effort, high reward — reserve for your flagship 'apply it' moment per module." }
  ];

  var UDL_LABEL = { rep:"Multiple means of representation", eng:"Multiple means of engagement", act:"Multiple means of action & expression" };
  var UDL_CLASS = { rep:"rep", eng:"eng", act:"act" };
  var UDL_SHORT = { rep:"Representation", eng:"Engagement", act:"Action & Expression" };

  var currentIntent = "recall";
  var lastShown = null;
  var ideaOut = document.getElementById("idea-out");

  function generateIdea() {
    var filter = document.getElementById("udl-filter").value; // any|representation|engagement|action
    var fmap = { representation:"rep", engagement:"eng", action:"act" };
    var want = fmap[filter];

    var pool = PATTERNS.filter(function (p) { return p.intents.indexOf(currentIntent) !== -1; });
    if (want) {
      var narrowed = pool.filter(function (p) { return p.udl.indexOf(want) !== -1; });
      if (narrowed.length) pool = narrowed;
    }
    if (!pool.length) pool = PATTERNS.slice();
    // avoid immediate repeat
    var choices = pool.length > 1 ? pool.filter(function (p) { return p.name !== lastShown; }) : pool;
    var pick = choices[Math.floor(Math.random() * choices.length)];
    lastShown = pick.name;
    renderIdea(pick, pool.length);
  }

  function renderIdea(p, poolSize) {
    lastPattern = p;
    var udlTags = p.udl.map(function (u) {
      return '<span class="ut ' + UDL_CLASS[u] + '">' + UDL_SHORT[u] + "</span>";
    }).join("");
    var wcag = p.wcag.map(function (w) {
      return '<li><span class="bx">\u2713</span><span>' + w + "</span></li>";
    }).join("");

    ideaOut.innerHTML =
      '<div class="idea-card">' +
        '<div class="kicker">Suggested interaction</div>' +
        "<h4>" + p.name + "</h4>" +
        '<p class="what">' + p.what + "</p>" +
        '<div class="idea-sec"><div class="lab">Why it works — UDL</div><div class="udl-tags">' + udlTags + "</div></div>" +
        '<div class="idea-sec"><div class="lab">Make it accessible — WCAG 2.1 AA</div><ul class="wcag-list">' + wcag + "</ul></div>" +
        '<div class="idea-tip"><b>GIBS tip&nbsp;·</b> ' + p.tip + "</div>" +
        '<div class="btn-row">' +
          '<button class="btn idea-prompt-btn" id="idea-prompt">Get an AI build prompt &rarr;</button>' +
          '<button class="btn btn-ghost" id="idea-again">' + (poolSize > 1 ? "Another idea" : "Regenerate") + "</button>" +
        "</div>" +
      "</div>";
    var again = document.getElementById("idea-again");
    if (again) again.addEventListener("click", generateIdea);
    var promptBtn = document.getElementById("idea-prompt");
    if (promptBtn) promptBtn.addEventListener("click", function () { openPromptModal(p); });
  }

  /* ---------- AI build-prompt pop-out ---------- */
  var GIBS_STANDARDS =
    "BRAND & STANDARDS — apply all of these:\n" +
    "- Voice: warm, human, plain and credible. Write all learner-facing text in UK / South African English (organise, colour, programme, centre). No jargon or AI-tells (avoid \"delve\", \"leverage\", \"unlock\", \"seamless\", \"elevate\"). No emoji.\n" +
    "- Colour: primary GIBS Blue #002C77 on a warm off-white background #FAF7F1, white cards, dark text #20242C. Use ONE accent from the GIBS palette sparingly if needed (teal #007378, green #326430, orange #C9632F, purple #5C2F6F). All text must meet 4.5:1 contrast.\n" +
    "- Type: Arial stack (font-family: Arial, \"Helvetica Neue\", Helvetica, sans-serif) — the GIBS digital typeface. Headings bold, body regular and at least 16px. Capitalisation: Title Case for the page title; sentence case for in-page headings (Header, Subheader), body, buttons and labels. Never ALL CAPS — use bold for emphasis. Use heading levels in structural order (Title → Header → Subheader → Paragraph) without skipping.\n" +
    "- Build: ONE self-contained HTML file with inline CSS and vanilla JavaScript. No external libraries, fonts, frameworks or CDN links, so it runs offline inside the LMS. Make it responsive; touch/click targets at least 44x44px.\n" +
    "- Blackboard: if this will be pasted into Blackboard Ultra's HTML editor, use inline styles only (no <style>, <script> or class selectors) and avoid icon fonts or emoji — use a coloured bar and a bold text label instead, so meaning never depends on an icon or on colour alone.";

  function buildPrompt(p, tool) {
    var wcagBullets = p.wcag.map(function (w) { return "  - " + w; }).join("\n");
    var udlText = p.udl.map(function (u) { return UDL_LABEL[u]; }).join("; ");

    var opener, closer;
    if (tool === "claude-code") {
      opener = "I'm using Claude Code. Create a new file `interactive.html` and build the learning interaction described below. After writing it, open it and confirm it renders with no console errors, is fully keyboard-operable, and meets the accessibility checklist.";
      closer = "Deliver the finished, self-contained interactive.html.";
    } else if (tool === "editor") {
      opener = "I'm using an AI coding assistant in my editor. Generate the complete, self-contained HTML for the learning interaction described below, written into the open file.";
      closer = "Output the full HTML file, ready to save and open in a browser.";
    } else { // chat
      opener = "Please build the learning interaction described below and reply with ONE complete, copy-pasteable HTML file in a single code block.";
      closer = "Return only the finished HTML in one code block.";
    }

    return opener + "\n\n" +
      "WHAT TO BUILD\n" +
      "A \"" + p.name + "\" interaction for a GIBS online course module.\n" +
      "How it works: " + p.what + "\n" +
      "Design tip: " + p.tip + "\n" +
      "It should support these UDL principles: " + udlText + ".\n\n" +
      "FILL IN FOR YOUR COURSE (replace the brackets):\n" +
      "- Module / topic: [DESCRIBE YOUR TOPIC]\n" +
      "- Learning outcome it serves: [e.g. \"analyse … and recommend …\"]\n" +
      "- The content to use (items / steps / questions + answers / feedback): [LIST YOUR CONTENT HERE]\n\n" +
      GIBS_STANDARDS + "\n\n" +
      "ACCESSIBILITY CHECKLIST — the build must satisfy every point (WCAG 2.1 AA):\n" +
      wcagBullets + "\n" +
      "  - Provide meaningful text alternatives and a visible keyboard focus state throughout.\n\n" +
      closer;
  }

  var lastPattern = null;
  var currentTool = "claude-code";
  var promptTrigger = null;
  var modal = document.getElementById("prompt-modal");

  function refreshPromptText() {
    if (!lastPattern) return;
    document.getElementById("pm-text").value = buildPrompt(lastPattern, currentTool);
    document.getElementById("pm-sub").textContent = lastPattern.name + " — ready to paste";
  }

  function openPromptModal(p) {
    lastPattern = p;
    promptTrigger = document.activeElement;
    refreshPromptText();
    modal.hidden = false;
    document.getElementById("pm-close").focus();
    document.addEventListener("keydown", onModalKey);
  }
  function closePromptModal() {
    modal.hidden = true;
    document.removeEventListener("keydown", onModalKey);
    var copied = document.getElementById("pm-copied");
    if (copied) copied.classList.remove("show");
    if (promptTrigger && promptTrigger.focus) promptTrigger.focus();
  }
  function onModalKey(e) { if (e.key === "Escape") closePromptModal(); }

  if (modal) {
    document.getElementById("pm-close").addEventListener("click", closePromptModal);
    document.getElementById("pm-close2").addEventListener("click", closePromptModal);
    modal.addEventListener("click", function (e) { if (e.target === modal) closePromptModal(); });

    var toolSeg = document.getElementById("tool-seg");
    toolSeg.querySelectorAll(".opt").forEach(function (b) {
      b.addEventListener("click", function () {
        toolSeg.querySelectorAll(".opt").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        currentTool = b.getAttribute("data-tool");
        refreshPromptText();
      });
    });

    document.getElementById("pm-copy").addEventListener("click", function () {
      var ta = document.getElementById("pm-text");
      var done = function () {
        var c = document.getElementById("pm-copied");
        c.classList.add("show");
        setTimeout(function () { c.classList.remove("show"); }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(ta.value).then(done).catch(function () {
          ta.removeAttribute("readonly"); ta.select(); document.execCommand("copy"); ta.setAttribute("readonly", ""); done();
        });
      } else {
        ta.removeAttribute("readonly"); ta.select(); document.execCommand("copy"); ta.setAttribute("readonly", ""); done();
      }
    });
  }

  /* ---------- Copy-to-clipboard for code blocks ---------- */
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
  }
  document.querySelectorAll(".btn-copy").forEach(function (b) {
    b.addEventListener("click", function () {
      var el = document.getElementById(b.getAttribute("data-copy"));
      if (!el) return;
      var text = el.innerText;
      var orig = b.getAttribute("data-label") || "Copy";
      var done = function () {
        b.textContent = "Copied \u2713"; b.classList.add("copied");
        setTimeout(function () { b.textContent = orig; b.classList.remove("copied"); }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text); done(); });
      } else { fallbackCopy(text); done(); }
    });
  });

  var seg = document.getElementById("intent-seg");
  if (seg) {
    seg.querySelectorAll(".opt").forEach(function (b) {
      b.addEventListener("click", function () {
        seg.querySelectorAll(".opt").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        currentIntent = b.getAttribute("data-intent");
      });
    });
    document.getElementById("gen-go").addEventListener("click", generateIdea);
  }

  /* ==========================================================
     3 · TEAM NOTES (per-tab sticky notes via Netlify Blobs)
     ========================================================== */
  var fab = document.getElementById("notes-fab");
  var drawer = document.getElementById("notes-drawer");
  if (fab && drawer) {
    var notesList = document.getElementById("notes-list");
    var notesCount = document.getElementById("notes-count");
    var notesTabLabel = document.getElementById("notes-tab-label");
    var nameEl = document.getElementById("note-name");
    var passEl = document.getElementById("note-pass");
    var allNotes = [];

    function curTab() {
      var t = document.querySelector('.tab[aria-selected="true"]');
      if (!t) return { key: "p-overview", label: "Overview" };
      return { key: t.getAttribute("aria-controls") || "p-overview", label: t.textContent.replace(/^\s*\d+\s*/, "").trim() };
    }
    function fmtTime(ts) {
      var d = new Date(ts);
      return d.toLocaleDateString("en-ZA", { day: "numeric", month: "short" }) + " " +
        d.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
    }
    function notesForTab() { var k = curTab().key; return allNotes.filter(function (n) { return n.tab === k; }); }
    function updateCount() {
      var open = notesForTab().filter(function (n) { return !n.resolved; }).length;
      notesCount.hidden = open === 0; notesCount.textContent = open;
    }
    function getPass() { try { return localStorage.getItem("gibs-notes-pass") || ""; } catch (e) { return ""; } }
    function setPass(p) { try { localStorage.setItem("gibs-notes-pass", p); } catch (e) {} }

    function render() {
      var t = curTab();
      notesTabLabel.textContent = "On: " + t.label;
      var ns = notesForTab().slice().sort(function (a, b) { return b.ts - a.ts; });
      if (!ns.length) {
        notesList.innerHTML = '<div class="notes-empty">No notes on this page yet. Add a question or suggestion below — your colleagues will see it here.</div>';
      } else {
        notesList.innerHTML = ns.map(function (n) {
          var c = n.kind === "suggestion" ? "var(--green)" : "var(--blue)";
          return '<div class="note ' + (n.resolved ? "resolved" : "") + '" style="--c:' + c + '">' +
            '<div class="note-top"><span class="note-name">' + escapeHtml(n.name || "Anonymous") + "</span>" +
            '<span class="note-kind ' + n.kind + '">' + (n.kind === "suggestion" ? "Suggestion" : "Question") + "</span>" +
            '<span class="note-time">' + fmtTime(n.ts) + "</span></div>" +
            '<div class="note-text">' + escapeHtml(n.text) + "</div>" +
            '<div class="note-tools"><button data-act="resolve" data-id="' + n.id + '">' + (n.resolved ? "Reopen" : "Mark resolved") + "</button>" +
            '<button data-act="delete" data-id="' + n.id + '">Delete</button></div></div>';
        }).join("");
        notesList.querySelectorAll(".note-tools button").forEach(function (b) {
          b.addEventListener("click", function () { mutateNote(b.getAttribute("data-act"), b.getAttribute("data-id")); });
        });
      }
      updateCount();
    }

    async function loadNotes() {
      try {
        var res = await fetch("/.netlify/functions/notes");
        if (!res.ok) throw 0;
        var data = await res.json();
        allNotes = data.notes || [];
        fab.hidden = false;
        render();
      } catch (e) { fab.hidden = true; }
    }

    async function mutateNote(act, id) {
      var pass = getPass();
      if (!pass) { pass = prompt("Enter the team passcode to " + act + " this note:") || ""; if (!pass) return; }
      try {
        var res = await fetch("/.netlify/functions/notes", {
          method: "POST", headers: { "content-type": "application/json" },
          body: JSON.stringify({ action: act, id: id, passcode: pass })
        });
        if (res.status === 401) { setPass(""); alert("Wrong passcode."); return; }
        if (!res.ok) throw 0;
        setPass(pass); await loadNotes();
      } catch (e) {}
    }

    fab.addEventListener("click", function () {
      var opening = drawer.hidden;
      drawer.hidden = !opening;
      fab.setAttribute("aria-expanded", opening ? "true" : "false");
      if (opening) render();
    });
    document.getElementById("notes-close").addEventListener("click", function () {
      drawer.hidden = true; fab.setAttribute("aria-expanded", "false");
    });
    document.querySelectorAll(".tab").forEach(function (t) {
      t.addEventListener("click", function () {
        setTimeout(function () { if (!drawer.hidden) render(); else updateCount(); }, 10);
      });
    });

    try { var sn = localStorage.getItem("gibs-notes-name"); if (sn) nameEl.value = sn; } catch (e) {}
    passEl.value = getPass();

    document.getElementById("notes-form").addEventListener("submit", async function (e) {
      e.preventDefault();
      var msg = document.getElementById("note-msg"); msg.className = ""; msg.textContent = "";
      var text = document.getElementById("note-text").value.trim();
      var name = nameEl.value.trim() || "Anonymous";
      var kind = document.getElementById("note-kind").value;
      var pass = passEl.value.trim();
      if (!text) { msg.className = "err"; msg.textContent = "Write something first."; return; }
      if (!pass) { msg.className = "err"; msg.textContent = "Enter the team passcode."; return; }
      var t = curTab();
      try {
        var res = await fetch("/.netlify/functions/notes", {
          method: "POST", headers: { "content-type": "application/json" },
          body: JSON.stringify({ action: "add", tab: t.key, name: name, kind: kind, text: text, passcode: pass })
        });
        if (res.status === 401) { msg.className = "err"; msg.textContent = "Wrong passcode."; return; }
        if (!res.ok) { var er = await res.json().catch(function () { return {}; }); msg.className = "err"; msg.textContent = er.error || "Could not post."; return; }
        setPass(pass);
        try { localStorage.setItem("gibs-notes-name", name); } catch (e2) {}
        document.getElementById("note-text").value = "";
        msg.className = "ok"; msg.textContent = "Posted \u2713";
        await loadNotes();
      } catch (e3) { msg.className = "err"; msg.textContent = "Notes service unavailable."; }
    });

    loadNotes();
  }
})();
