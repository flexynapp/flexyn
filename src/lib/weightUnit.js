export const WEIGHT_UNITS = {
  lbs: 'lbs',
  kg: 'kg',
  stone: 'stone',
};

/** Convert lbs (stored value) → display unit */
export function fromLbs(lbs, unit) {
  if (unit === 'kg') return lbs / 2.20462;
  if (unit === 'stone') return lbs / 14;
  return lbs;
}

/** Convert display unit → lbs (stored value) */
export function toLbs(value, unit) {
  if (unit === 'kg') return value * 2.20462;
  if (unit === 'stone') return value * 14;
  return value;
}

/** Format a lbs-stored weight for display in user's unit */
export function formatWeight(lbs, unit, decimals) {
  if (lbs == null || isNaN(lbs)) return '—';
  const converted = fromLbs(lbs, unit);
  const dp = decimals ?? (unit === 'kg' ? 1 : unit === 'stone' ? 2 : 0);
  return `${converted.toFixed(dp)} ${unit}`;
}

/** Same as formatWeight but returns just the number string (no unit suffix) */
export function formatWeightNumber(lbs, unit, decimals) {
  if (lbs == null || isNaN(lbs)) return '';
  const converted = fromLbs(lbs, unit);
  const dp = decimals ?? (unit === 'kg' ? 1 : unit === 'stone' ? 2 : 0);
  return converted.toFixed(dp);
}