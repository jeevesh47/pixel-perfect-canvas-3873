/**
 * Simple NLP / pattern-matching engine for the Student Query Chatbot.
 *
 * Pipeline:
 *   User Question -> Text Preprocessing -> Keyword/Pattern Matching
 *                 -> Intent Detection -> Predefined Response
 *
 * Everything runs locally in the browser. No external AI service is used.
 */

import { FALLBACK_RESPONSE, INTENTS, type Intent } from "./chatbot-data";

/** Very common words that carry no intent information. */
const STOP_WORDS = new Set([
  "a", "an", "the", "is", "are", "am", "was", "were", "do", "does", "did",
  "i", "me", "my", "you", "your", "we", "us", "it", "its", "of", "for", "to",
  "in", "on", "at", "and", "or", "about", "please", "tell", "give", "can",
  "could", "would", "want", "know", "there", "any", "some", "with", "that",
  "this", "what", "which", "whats",
]);

export type Analysis = {
  /** Text after lowercasing and punctuation removal */
  cleaned: string;
  /** All tokens after splitting on whitespace */
  tokens: string[];
  /** Tokens left after stop-word removal */
  keywords: string[];
  /** Winning intent, or null when nothing matched well enough */
  intent: Intent | null;
  /** Match score of the winning intent (0 - 1) */
  confidence: number;
  /** Keywords that actually triggered the match */
  matchedKeywords: string[];
  /** The answer to display */
  response: string;
};

/** Step 1 + 2: lowercase, strip punctuation, collapse whitespace. */
export function preprocess(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Step 3: tokenize and drop stop words to keep the important keywords. */
export function extractKeywords(cleaned: string): { tokens: string[]; keywords: string[] } {
  const tokens = cleaned ? cleaned.split(" ") : [];
  const keywords = tokens.filter((t) => t.length > 1 && !STOP_WORDS.has(t));
  return { tokens, keywords };
}

/** Score one intent against the cleaned text and its keywords. */
function scoreIntent(
  intent: Intent,
  cleaned: string,
  keywords: string[],
): { score: number; matched: string[] } {
  const matched: string[] = [];
  let score = 0;

  for (const raw of intent.keywords) {
    const kw = preprocess(raw);
    if (!kw) continue;

    if (kw.includes(" ")) {
      // multi-word pattern: look for the phrase in the cleaned sentence
      if (cleaned.includes(kw)) {
        score += 2;
        matched.push(kw);
      }
      continue;
    }

    // exact token match is strongest, prefix match handles simple plurals
    if (keywords.includes(kw)) {
      score += 2;
      matched.push(kw);
    } else if (keywords.some((k) => k.startsWith(kw) || kw.startsWith(k))) {
      score += 1;
      matched.push(kw);
    }
  }

  // small bonus when the phrasing closely resembles a stored example question
  for (const example of intent.examples) {
    const ex = preprocess(example);
    if (!ex) continue;
    if (cleaned === ex) {
      score += 4;
    } else if (ex.length > 6 && (cleaned.includes(ex) || ex.includes(cleaned))) {
      score += 2;
    }
  }

  return { score, matched };
}

/** Steps 4 + 5: pick the best intent and return its predefined response. */
export function analyze(input: string): Analysis {
  const cleaned = preprocess(input);
  const { tokens, keywords } = extractKeywords(cleaned);

  let best: Intent | null = null;
  let bestScore = 0;
  let bestMatched: string[] = [];

  for (const intent of INTENTS) {
    const { score, matched } = scoreIntent(intent, cleaned, keywords);
    if (score > bestScore) {
      best = intent;
      bestScore = score;
      bestMatched = matched;
    }
  }

  // Require a minimum score so random text falls back instead of guessing.
  const matchedIntent = bestScore >= 2 ? best : null;
  const confidence = matchedIntent ? Math.min(0.99, 0.55 + bestScore * 0.09) : 0;

  return {
    cleaned,
    tokens,
    keywords,
    intent: matchedIntent,
    confidence,
    matchedKeywords: matchedIntent ? Array.from(new Set(bestMatched)).slice(0, 5) : [],
    response: matchedIntent ? matchedIntent.response : FALLBACK_RESPONSE,
  };
}
