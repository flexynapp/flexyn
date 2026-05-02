export const KM_PER_MILE = 1.609344;

export function metersTo(unit, meters) {
  if (meters == null || isNaN(meters)) return 0;
  if (unit === 'km') return meters / 1000;
  return meters / 1609.344;
}

export function toMeters(unit, value) {
  if (value == null || isNaN(value)) return 0;
  if (unit === 'km') return value * 1000;
  return value * 1609.344;
}

export function formatDistance(meters, unit, fractionDigits = 2) {
  const v = metersTo(unit, meters);
  return `${v.toFixed(fractionDigits)} ${unit}`;
}

export function formatPace(secondsPerKm, unit) {
  if (!secondsPerKm || !isFinite(secondsPerKm) || secondsPerKm <= 0) return '—';
  const secPerUnit = unit === 'km' ? secondsPerKm : secondsPerKm * KM_PER_MILE;
  const m = Math.floor(secPerUnit / 60);
  const s = Math.round(secPerUnit % 60).toString().padStart(2, '0');
  return `${m}:${s} /${unit}`;
}

export function formatDuration(seconds) {
  if (!seconds || seconds < 0) return '0:00';
  const total = Math.floor(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  return `${m}:${s.toString().padStart(2,'0')}`;
}

export function speedKmhFrom(distanceMeters, durationSeconds) {
  if (!durationSeconds || durationSeconds <= 0) return 0;
  return (distanceMeters / 1000) / (durationSeconds / 3600);
}

export function paceSecPerKmFrom(distanceMeters, durationSeconds) {
  if (!distanceMeters || distanceMeters <= 0) return null;
  return durationSeconds / (distanceMeters / 1000);
}