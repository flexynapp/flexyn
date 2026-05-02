/**
 * Returns the max realistic weight cap (lbs) for an exercise given the user's profile.
 * Based on body weight multipliers for top amateur / strong lifter territory.
 */
export function getMaxRealisticWeight(exerciseName = '', userProfile = {}) {
  const bodyWeight = Math.min(userProfile.weight_lbs || 180, 700); // hard cap body weight input at 700 lbs
  const gender = userProfile.gender || 'male';
  const genderMult = gender === 'female' ? 0.7 : 1.0;
  const name = exerciseName.toLowerCase();

  let bwMult;
  if (name.includes('deadlift')) bwMult = 3.5;
  else if (name.includes('squat')) bwMult = 3.0;
  else if (name.includes('bench press')) bwMult = 2.2;
  else if (name.includes('overhead press') || name.includes('press')) bwMult = 1.5;
  else if (name.includes('row')) bwMult = 2.0;
  else if (name.includes('curl') || name.includes('tricep')) bwMult = 1.0;
  else if (name.includes('lateral raise') || name.includes('fly')) bwMult = 0.4;
  else bwMult = 2.5;

  const cap = Math.round(bodyWeight * bwMult * genderMult);
  return Math.min(cap, 1100);
}

/**
 * Returns the max realistic reps for a given set, based on the weight being used
 * relative to the exercise's estimated 1RM ceiling.
 *
 * Uses inverse Epley: reps = (1RM / weight - 1) / 0.0333
 * We estimate the 1RM ceiling as getMaxRealisticWeight() for the exercise + profile.
 * The heavier the weight, the fewer reps are possible.
 *
 * For bodyweight/cardio exercises (push-ups, sit-ups, etc.) a flat high cap is used.
 * Minimum return value is always 1.
 * Maximum return value is 50 for weighted exercises, 200 for bodyweight.
 */
export function getMaxRealisticReps(exerciseName = '', weightUsed = 0, userProfile = {}) {
  const name = exerciseName.toLowerCase();

  // Bodyweight / calisthenics — no weight dependency, use flat caps
  const isBodyweight = (
    name.includes('push-up') ||
    name.includes('sit-up') ||
    name.includes('crunch') ||
    name.includes('plank') ||
    name.includes('pull-up') ||
    name.includes('chin-up') ||
    name.includes('dip') ||
    name.includes('jumping jack') ||
    name.includes('burpee') ||
    name.includes('mountain climber')
  );
  if (isBodyweight) return 200;

  // If no weight entered yet, allow a generous default so the field isn't blocked
  if (!weightUsed || weightUsed <= 0) return 50;

  // Estimate the 1RM ceiling for this exercise + user
  const oneRMCeiling = getMaxRealisticWeight(exerciseName, userProfile);

  // If weight exceeds the 1RM ceiling, only 1 rep is possible (and even that is flagged by the weight cap)
  if (weightUsed >= oneRMCeiling) return 1;

  // Inverse Epley: max reps = (1RM / weight - 1) / 0.0333
  const maxReps = Math.floor((oneRMCeiling / weightUsed - 1) / 0.0333);

  // Clamp: at least 1, at most 50 for weighted exercises
  return Math.max(1, Math.min(50, maxReps));
}

/**
 * Max realistic duration for a single exercise in minutes.
 */
export function getMaxRealisticDuration() {
  return 180;
}