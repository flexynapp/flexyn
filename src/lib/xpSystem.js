// XP System Configuration and Calculations

const LEVEL_CONFIG = {
  MAX_LEVEL: 100,
  baseXpPerLevel: 250,        // was 80 — roughly 3× harder baseline
  exponentialGrowth: 1.15,
};

// Steeper, more realistic tiered growth
function getLevelMultiplier(level) {
  if (level <= 10) return 1.10;
  if (level <= 30) return 1.13;
  if (level <= 60) return 1.16;
  return 1.20;
}

// Calculate total XP needed for a specific level
export function getTotalXpForLevel(level) {
  if (level <= 1) return 0;
  let totalXp = 0;
  for (let i = 1; i < level; i++) {
    totalXp += getXpForNextLevel(i);
  }
  return totalXp;
}

// Calculate XP needed to go from current level to next
export function getXpForNextLevel(currentLevel) {
  const nextLevel = currentLevel + 1;
  const multiplier = getLevelMultiplier(currentLevel);
  return Math.floor(
    LEVEL_CONFIG.baseXpPerLevel * Math.pow(multiplier, Math.max(0, currentLevel - 1))
  );
}

// Calculate level and progress from total XP
export function calculateLevelFromXp(totalXp) {
  let level = 1;
  let cumulativeXp = 0;

  for (let i = 1; i < LEVEL_CONFIG.MAX_LEVEL; i++) {
    const xpNeeded = getXpForNextLevel(i);
    if (cumulativeXp + xpNeeded > totalXp) {
      const currentLevelXp = totalXp - cumulativeXp;
      const progressPercent = (currentLevelXp / xpNeeded) * 100;
      return { level: i, xpInLevel: currentLevelXp, xpNeeded, progressPercent, totalXp };
    }
    cumulativeXp += xpNeeded;
    level = i + 1;
  }

  // Max level reached
  return { level: LEVEL_CONFIG.MAX_LEVEL, xpInLevel: 0, xpNeeded: 0, progressPercent: 100, totalXp };
}

// XP Rewards for different actions
export const XP_REWARDS = {
  // Workouts - based on volume
  workoutCompletion: (duration, sets, totalVolume) => {
    // Base: 10 XP per set
    const setXp = sets * 10;
    // Volume bonus: 1 XP per 100 lbs lifted
    const volumeXp = Math.floor(totalVolume / 100);
    // Duration bonus: 5 XP per 10 minutes
    const durationXp = Math.floor((duration || 0) / 10) * 5;
    return setXp + volumeXp + durationXp;
  },

  // Goals
  goalCompleted: 75,

  // Water intake
  waterGlass: 2,

  // Regimen creation
  regimenCreated: 50,
  fifth_regimen: 100,
  tenth_regimen: 200,

  // Workout milestones
  first_workout: 30,
  tenth_workout: 120,
  fiftieth_workout: 300,
  hundredth_workout: 600,

  // Achievements
  achievementUnlocked: (xpReward) => xpReward,
};

// Calculate XP from a workout based on exercises logged
// Weight-based multiplier: heavier lifts grant more XP
function getWeightMultiplier(weight) {
  if (weight < 50) return 0.8; // Light weight
  if (weight < 100) return 1.0; // Moderate weight
  if (weight < 150) return 1.3; // Intermediate weight
  if (weight < 200) return 1.6; // Heavy weight
  if (weight < 250) return 2.0; // Very heavy weight
  return 2.5; // Elite heavy weight
}

export function calculateWorkoutXp(workout) {
  if (!workout?.exercises || workout.exercises.length === 0) return 0;

  let totalXp = 0;
  let totalVolume = 0;

  // Calculate volume and XP from all exercises with weight-based multiplier
  workout.exercises.forEach((exercise) => {
    if (exercise.sets && Array.isArray(exercise.sets)) {
      exercise.sets.forEach((set) => {
        const weight = set.weight || 0;
        const reps = set.reps || 0;
        totalVolume += weight * reps;
        
        // Apply weight multiplier for impressive lifts
        if (weight > 0) {
          const multiplier = getWeightMultiplier(weight);
          totalXp += reps * multiplier * 0.6;
        }
      });
    }
  });

  const duration = workout.duration_minutes || 0;
  const setCount = workout.exercises.reduce((sum, ex) => sum + (ex.sets?.length || 0), 0);

  const baseSetXp = setCount * 8;
  const volumeXp = Math.floor(totalVolume / 500);
  const durationXp = Math.floor((duration || 0) / 10) * 3;

  const rawXp = baseSetXp + totalXp + volumeXp + durationXp;
  return Math.min(rawXp, MAX_WORKOUT_XP); // Hard cap: no single workout can exceed 2000 XP
}

export const MAX_WORKOUT_XP = 600;

// Cardio XP: rewards minutes, distance, and calories burned.
// Tunable to feel comparable to strength workout XP per session.
export function calculateCardioXp({ duration_seconds, distance_meters, calories }) {
  if (!duration_seconds || duration_seconds <= 0) return 0;
  const minutes = duration_seconds / 60;
  const baseXp = minutes * 1;
  const distanceXp = (distance_meters || 0) / 250;
  const calorieXp = (calories || 0) / 25;
  const raw = baseXp + distanceXp + calorieXp;
  return Math.min(Math.round(raw), 400);
}

// Calculate total volume from a set of exercises
export function calculateTotalVolume(exercises) {
  let totalVolume = 0;
  if (!exercises) return 0;

  exercises.forEach((exercise) => {
    if (exercise.sets && Array.isArray(exercise.sets)) {
      exercise.sets.forEach((set) => {
        totalVolume += (set.weight || 0) * (set.reps || 0);
      });
    }
  });

  return totalVolume;
}