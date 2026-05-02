/**
 * Helper to translate legacy 'Freestyle Workout' strings for display.
 * Old data stored literal strings; this converts them to translated versions on the fly.
 * @param {string} name - The workout name or regimen name
 * @param {function} t - The translation function from useLanguage()
 * @returns {string} - The translated or original name
 */
export function displayWorkoutName(name, t) {
  if (!name || name === 'Freestyle Workout' || name === 'Freestyle' || name === 'Freestyle workout') {
    return t('workout.freestyle');
  }
  return name;
}