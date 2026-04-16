// One-off transformer:
//   1. Trim verbose reasoning from correct-answer options into the explanation,
//      so lengths are comparable across options.
//   2. Deterministically shuffle option letters per question, spreading the
//      correct answer roughly 25/25/25/25 across A/B/C/D.
//
// Reads the existing question-bank.js, writes a rebalanced replacement in place.
// Run with: node _rebalance.js

const fs = require("fs");
const path = require("path");

const BANK_PATH = path.join(__dirname, "question-bank.js");
const { QUESTION_BANK, DOMAIN_META, PLACEMENT_DISTRIBUTION, BANK_VERSION } =
  require(BANK_PATH);

// ---------- helpers ----------

function stripHtml(s) {
  return s.replace(/<[^>]+>/g, "").replace(/&[a-z]+;/g, " ");
}

function visLen(s) { return stripHtml(s).length; }

function hashString(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

function mulberry32(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleInPlace(arr, rand) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// ---------- step 1: length trim ----------
//
// For every question, if the correct answer is visibly longer than the mean of
// the distractors, try to split it at a natural boundary. Everything after the
// boundary moves to the front of the explanation, prefixed with context.
//
// Boundaries, in priority order:
//   1. em-dash "— " (and its HTML entity &mdash;)
//   2. " because "
//   3. " so "
//   4. " since "
//   5. " — " (ASCII approximation)
//   6. The first ". " that appears after > 40% of the option's length
//
// Only split if the resulting option length is within 1.3x of the longest
// distractor and the split is at least ~30 chars before the end (otherwise
// the trim is too trivial to bother).

const SPLIT_PATTERNS = [
  /\s+&mdash;\s+/,
  /\s+—\s+/,
  /\s+--\s+/,
  /\s+because\s+/i,
  /,\s+which\s+(means|is|provides|makes|gives|lets|forces|prevents|enables|causes|allows|removes|ensures|requires|keeps|breaks)\s+/i,
  /,\s+so\s+/i,
  /,\s+since\s+/i,
  /:\s+/,
  // More aggressive fallbacks, tried only after the above
  /\.\s+(This|That|Each|The pattern|The agent|The model|The coordinator|The rule|It)\s+/,
  /,\s+(letting|making|forcing|giving|putting|causing|enabling|preserving|keeping|preventing|matching)\s+/i,
  /\s+\(([^)]{20,})\)/,  // parenthetical of 20+ chars
  /,\s+and\s+(this|that|the)\s+/i,
];

function trySplit(text) {
  // Try each split pattern and return the first usable (head, tail) pair.
  for (const re of SPLIT_PATTERNS) {
    const m = text.match(re);
    if (!m) continue;
    const head = text.slice(0, m.index).trim();
    const tail = text.slice(m.index + m[0].length).trim();
    if (head.length < 20 || tail.length < 20) continue;
    return { head, tail, sep: m[0] };
  }
  // Fallback: first period after 40% of length
  const minIdx = Math.floor(text.length * 0.4);
  const dotIdx = text.indexOf(". ", minIdx);
  if (dotIdx > 0 && dotIdx < text.length - 20) {
    return {
      head: text.slice(0, dotIdx + 1).trim(),
      tail: text.slice(dotIdx + 2).trim(),
      sep: ". ",
    };
  }
  return null;
}

function trimCorrect(q) {
  const correctText = q.opts[q.a];
  const distractors = ["A", "B", "C", "D"].filter(l => l !== q.a).map(l => q.opts[l]);
  const maxOther = Math.max(...distractors.map(visLen));
  const curLen = visLen(correctText);

  // If already within 1.3x of the longest distractor, leave it alone.
  if (curLen <= maxOther * 1.3) return q;

  // Try progressive splits until we get under the budget.
  let text = correctText;
  let movedChunks = [];
  while (visLen(text) > maxOther * 1.3) {
    const split = trySplit(text);
    if (!split) break;
    text = split.head;
    movedChunks.push(split.tail);
  }

  if (movedChunks.length === 0) {
    // Correct answer is intrinsically long; leave text alone but still fall through
    // to distractor padding below.
    return padDistractors(q);
  }

  // Rebuild. Ensure the correct option ends with a period.
  if (!/[.!?]$/.test(text)) text = text + ".";
  q.opts = Object.assign({}, q.opts, { [q.a]: text });

  // Prepend moved reasoning to the explanation so the teaching content isn't lost.
  // If the explanation already starts with similar wording, don't duplicate.
  const movedText = movedChunks.join(" ").replace(/\s+/g, " ").trim();
  if (movedText && !q.exp.includes(movedText.slice(0, 40))) {
    const prefix = /[.!?]$/.test(movedText) ? movedText : movedText + ".";
    q.exp = prefix + " " + q.exp;
  }

  return padDistractors(q);
}

// ---------- distractor padding ----------
//
// For each distractor significantly shorter than the correct answer, append a
// generic-sounding justification so the tell-by-length is neutralized. The
// fillers read as an examinee-style elaboration, applicable to almost any
// plausible-but-wrong option.

const DISTRACTOR_FILLERS = [
  "It feels like the familiar lever, but it doesn't address the underlying structural issue.",
  "It's a commonly proposed patch that reduces the surface symptom without fixing the root cause.",
  "It works in the easy case and leaves the hard cases silently broken.",
  "It looks plausible at first glance but creates its own failure modes you'd later have to work around.",
  "It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
  "It's the tempting shortcut; works until you hit an edge case that makes the real failure visible.",
  "It sounds safe, but the guidance explicitly points elsewhere for this shape of problem.",
  "It buys short-term quiet at the cost of hiding a bug that will resurface under load.",
  "It is superficially attractive and ignores the layer where the actual control point lives.",
  "It feels rigorous but doesn't give the agent the information it needs to recover well.",
];

function pickFiller(seed) {
  const rand = mulberry32(seed);
  return DISTRACTOR_FILLERS[Math.floor(rand() * DISTRACTOR_FILLERS.length)];
}

function padDistractors(q) {
  const correctLen = visLen(q.opts[q.a]);
  for (const l of ["A", "B", "C", "D"]) {
    if (l === q.a) continue;
    const text = q.opts[l];
    const tlen = visLen(text);
    if (tlen >= correctLen * 0.75) continue;  // already in the same length class
    const filler = pickFiller(hashString(q.id + ":" + l));
    // Ensure punctuation at join point
    const glue = /[.!?]$/.test(text.trim()) ? " " : ". ";
    let padded = text.trim() + glue + filler;
    // If still notably short, add a second, different filler
    if (visLen(padded) < correctLen * 0.75) {
      const filler2 = pickFiller(hashString(q.id + ":" + l + ":2"));
      if (filler2 !== filler) padded = padded + " " + filler2;
    }
    q.opts[l] = padded;
  }
  return q;
}

// ---------- step 2: letter shuffle (forced-uniform) ----------
//
// Rather than random-shuffle per question (which, over only 200 items, can
// cluster), we force an exactly-uniform correct-letter distribution: 50 per
// letter across the bank. Within each domain the assignment is also balanced.
// Distractor slots are filled in a shuffled order so positions stay varied.

function assignTargetLetters(bank) {
  // For each domain, assign correct letters round-robin in a stable order.
  const letters = ["A", "B", "C", "D"];
  const byDomain = { 1: [], 2: [], 3: [], 4: [], 5: [] };
  for (const q of bank) byDomain[q.domain].push(q);
  const targets = new Map();
  for (const d of [1, 2, 3, 4, 5]) {
    // Deterministic permutation of the domain questions based on id
    const arr = byDomain[d].slice().sort((a, b) => a.id.localeCompare(b.id));
    // Start letter offset also hashed from domain, so not all domains start at A
    const startOffset = hashString("letter-target-v2:" + d) % 4;
    arr.forEach((q, i) => {
      targets.set(q.id, letters[(i + startOffset) % 4]);
    });
  }
  return targets;
}

function shuffleLetters(q, targetLetter) {
  const letters = ["A", "B", "C", "D"];
  const distractorLetters = letters.filter(l => l !== targetLetter);

  // Deterministic permutation of the 3 old-distractor letters
  const oldDistractors = letters.filter(l => l !== q.a);
  const rand = mulberry32(hashString("distractor-order-v2:" + q.id));
  const perm = oldDistractors.slice();
  shuffleInPlace(perm, rand);

  const newOpts = {};
  newOpts[targetLetter] = q.opts[q.a];
  for (let i = 0; i < 3; i++) {
    newOpts[distractorLetters[i]] = q.opts[perm[i]];
  }

  // Update any explicit "Answer: X" in the explanation
  const exp = q.exp.replace(
    new RegExp(`\\bAnswer:\\s*[ABCD]\\.`),
    `Answer: ${targetLetter}.`
  );

  return { ...q, opts: newOpts, a: targetLetter, exp };
}

// ---------- run transforms ----------

// ---------- dedup pass ----------
// Previous runs of an earlier (buggy) version of this script prepended moved
// reasoning to explanations twice for some questions, producing "PHRASE. PHRASE."
// leads. Strip those.

function dedupExp(exp) {
  // Try leading-duplication of lengths 30..240 chars
  const len = exp.length;
  for (let n = 240; n >= 30; n--) {
    if (n * 2 > len) continue;
    // Exact back-to-back duplicate: "ABCABC..."
    if (exp.slice(0, n) === exp.slice(n, 2 * n)) {
      return exp.slice(n);
    }
    // With ". " separator between copies: "ABC. ABC..."
    if (
      exp.length >= 2 * n + 2 &&
      exp.slice(0, n) === exp.slice(n + 2, 2 * n + 2) &&
      (exp.slice(n, n + 2) === ". " || exp.slice(n, n + 2) === " ")
    ) {
      return exp.slice(n + 2);
    }
  }
  return exp;
}

const targetLetters = assignTargetLetters(QUESTION_BANK);

const rebalanced = QUESTION_BANK.map(q => {
  let out = JSON.parse(JSON.stringify(q));
  out.exp = dedupExp(out.exp);
  out = trimCorrect(out);
  out = shuffleLetters(out, targetLetters.get(out.id));
  return out;
});

// ---------- validate ----------

function validate(bank) {
  const issues = [];
  for (const q of bank) {
    if (!q.opts || !q.opts[q.a]) issues.push(q.id + ": correct letter missing from opts");
    for (const l of ["A","B","C","D"]) {
      if (!q.opts[l]) issues.push(q.id + ": missing option " + l);
    }
    if (!q.q || !q.exp) issues.push(q.id + ": missing q or exp");
  }
  return issues;
}
const issues = validate(rebalanced);
if (issues.length) {
  console.error("Validation failed:", issues);
  process.exit(1);
}

// ---------- stats ----------

function stats(bank, label) {
  const byLetter = { A:0, B:0, C:0, D:0 };
  let ratioSum = 0, strongTells = 0, longestCorrect = 0;
  for (const q of bank) {
    byLetter[q.a]++;
    const lens = {};
    for (const l of ["A","B","C","D"]) lens[l] = visLen(q.opts[l]);
    const maxLen = Math.max(...Object.values(lens));
    const correctLen = lens[q.a];
    const avgOther = (["A","B","C","D"].filter(l=>l!==q.a).reduce((s,l)=>s+lens[l],0))/3;
    const ratio = correctLen / avgOther;
    ratioSum += ratio;
    if (ratio >= 1.5) strongTells++;
    if (correctLen === maxLen && Object.values(lens).filter(x=>x===maxLen).length === 1) longestCorrect++;
  }
  console.log(`\n${label}:`);
  console.log("  Letter distribution:", byLetter);
  console.log("  Mean length ratio:", (ratioSum / bank.length).toFixed(2));
  console.log("  Strong tells (>=1.5x):", strongTells);
  console.log("  Correct = unique longest:", longestCorrect);
}

stats(QUESTION_BANK, "BEFORE");
stats(rebalanced, "AFTER");

// ---------- emit new file ----------

function serializeOption(text) {
  // Preserve existing HTML and quoting. Must escape " and \.
  return JSON.stringify(text);
}

function serializeQ(q) {
  const tagsStr = q.tags && q.tags.length
    ? "[" + q.tags.map(t => JSON.stringify(t)).join(",") + "]"
    : "[]";
  const scenarioStr = q.scenario != null ? JSON.stringify(q.scenario) : "null";
  return (
    `  { id: ${JSON.stringify(q.id)}, domain: ${q.domain}, scenario: ${scenarioStr},\n` +
    `    q: ${serializeOption(q.q)},\n` +
    `    opts: {\n` +
    `      A: ${serializeOption(q.opts.A)},\n` +
    `      B: ${serializeOption(q.opts.B)},\n` +
    `      C: ${serializeOption(q.opts.C)},\n` +
    `      D: ${serializeOption(q.opts.D)}\n` +
    `    },\n` +
    `    a: ${JSON.stringify(q.a)},\n` +
    `    exp: ${serializeOption(q.exp)},\n` +
    `    tags: ${tagsStr} }`
  );
}

// Group by domain for readable output
const byDomain = { 1:[], 2:[], 3:[], 4:[], 5:[] };
for (const q of rebalanced) byDomain[q.domain].push(q);

let out = "";
out += "// question-bank.js\n";
out += "// 200-question bank for the adaptive Claude Certified Architect Foundations practice exam.\n";
out += "// Options and correct letters were rebalanced by _rebalance.js to neutralize\n";
out += "// length- and letter-based answer tells.\n\n";
out += `const BANK_VERSION = "${BANK_VERSION}-rebalanced";\n\n`;
out += "const DOMAIN_META = {\n";
for (const d of [1,2,3,4,5]) {
  const m = DOMAIN_META[d];
  out += `  ${d}: { name: ${JSON.stringify(m.name)}, weight: ${m.weight}, count: ${m.count}, short: ${JSON.stringify(m.short)} },\n`;
}
out += "};\n\n";
out += "const PLACEMENT_DISTRIBUTION = { 1: 6, 2: 4, 3: 4, 4: 4, 5: 2 };\n\n";
out += "const QUESTION_BANK = [\n\n";

for (const d of [1,2,3,4,5]) {
  out += `  // ==========================================================================\n`;
  out += `  // DOMAIN ${d} — ${DOMAIN_META[d].name} (${byDomain[d].length} questions)\n`;
  out += `  // ==========================================================================\n\n`;
  out += byDomain[d].map(serializeQ).join(",\n\n");
  if (d < 5) out += ",\n\n";
  else out += "\n\n";
}

out += "];\n\n";
out += `if (typeof module !== "undefined" && module.exports) {\n`;
out += `  module.exports = { QUESTION_BANK, DOMAIN_META, PLACEMENT_DISTRIBUTION, BANK_VERSION };\n`;
out += "}\n";

fs.writeFileSync(BANK_PATH, out);
console.log("\nWrote rebalanced bank to " + BANK_PATH);
