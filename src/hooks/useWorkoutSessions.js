import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'paused_workouts';

function readStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function writeStorage(sessions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // ignore quota errors
  }
}

// Synchronously upsert a session into localStorage — safe to call from unmount
export function pauseWorkoutSync(workout) {
  const sessions = readStorage();
  const idx = sessions.findIndex(s => s.id === workout.id);
  if (idx >= 0) {
    sessions[idx] = workout;
  } else {
    sessions.push(workout);
  }
  writeStorage(sessions);
}

export function useWorkoutSessions() {
  const [sessions, setSessions] = useState(() => readStorage());

  // Keep in sync if another tab or the sync function writes to localStorage
  useEffect(() => {
    const onStorage = () => setSessions(readStorage());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const pauseWorkout = useCallback((workout) => {
    pauseWorkoutSync(workout);
    setSessions(readStorage());
  }, []);

  const resumeWorkout = useCallback((id) => {
    const sessions = readStorage();
    return sessions.find(s => s.id === id) || null;
  }, []);

  const removeSession = useCallback((id) => {
    const sessions = readStorage();
    writeStorage(sessions.filter(s => s.id !== id));
    setSessions(readStorage());
  }, []);

  return { sessions, pauseWorkout, resumeWorkout, removeSession };
}