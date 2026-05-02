/**
 * i18n completeness check — runs only in development.
 *
 * Pass 1 — Missing keys:
 *   Logs every key present in English but absent from at least one other
 *   supported language. Missing English keys are the critical failure mode
 *   that causes raw keys to appear in the UI.
 *
 * Pass 2 — English-identical (untranslated) values:
 *   Flags keys where a non-English language carries the exact same byte
 *   sequence as the English value. This usually means someone copied the
 *   English string as a placeholder and forgot to translate it.
 *   Exceptions:
 *     • Keys in ALLOW_IDENTICAL — intentional proper nouns / codes.
 *     • Keys whose English value contains no letters (pure numbers,
 *       punctuation, template tokens, etc.).
 *     • English values that are, or contain only, the brand name "Flexyn"
 *       (brand names legitimately stay the same across languages).
 *
 * Import this file once in src/main.jsx (inside a DEV guard) to activate it.
 */
import { translations, SUPPORTED_LANGUAGES } from './i18n';

/**
 * Keys that are intentionally identical across all languages.
 * Add here when the value is a proper noun, brand name, code, or symbol
 * that should not differ by language.
 */
const ALLOW_IDENTICAL = new Set([
  'app.name',      // "Flexyn" — brand name
  'levelBar.level', // "Lv {n}" — widely understood abbreviation
]);

/** Returns true if the string contains at least one Unicode letter. */
function hasLetters(str) {
  return /\p{L}/u.test(str);
}

/** Returns true if the value is (or is exclusively) the brand name "Flexyn". */
function isBrandNameOnly(str) {
  return /^\s*Flexyn\s*$/i.test(str);
}

/**
 * Returns true if this English value should be silently skipped when
 * checking for English-identical translations.
 */
function shouldSkipIdenticalCheck(key, enValue) {
  if (ALLOW_IDENTICAL.has(key)) return true;
  if (!hasLetters(enValue)) return true;    // pure numbers / punctuation / tokens
  if (isBrandNameOnly(enValue)) return true; // brand name only
  return false;
}

export function checkI18nCompleteness() {
  if (!import.meta.env.DEV) return;

  const enDict = translations['en'] || {};
  const enKeys = new Set(Object.keys(enDict));

  // ── Pass 1: missing keys ──────────────────────────────────────────────────
  const missingIssues = [];
  for (const { code } of SUPPORTED_LANGUAGES) {
    if (code === 'en') continue;
    const langKeys = new Set(Object.keys(translations[code] || {}));
    for (const key of enKeys) {
      if (!langKeys.has(key)) {
        missingIssues.push(`[i18n-check] Missing in "${code}": '${key}'`);
      }
    }
  }

  if (missingIssues.length > 0) {
    console.group('[i18n-check] Translation gaps found:');
    missingIssues.forEach(i => console.warn(i));
    console.groupEnd();
  } else {
    console.info('[i18n-check] ✅ All languages complete (no missing keys).');
  }

  // ── Pass 2: English-identical (untranslated) values ───────────────────────
  const identicalIssues = [];
  for (const { code } of SUPPORTED_LANGUAGES) {
    if (code === 'en') continue;
    const langDict = translations[code] || {};
    for (const key of enKeys) {
      const enValue = enDict[key];
      if (shouldSkipIdenticalCheck(key, enValue)) continue;
      if (langDict[key] === enValue) {
        identicalIssues.push(`[i18n-check] Untranslated in "${code}": '${key}' = "${enValue}"`);
      }
    }
  }

  if (identicalIssues.length > 0) {
    console.group('[i18n-check] Untranslated (English-identical) values:');
    identicalIssues.forEach(i => console.warn(i));
    console.groupEnd();
  } else {
    console.info('[i18n-check] ✅ No English-identical values in other languages.');
  }
}