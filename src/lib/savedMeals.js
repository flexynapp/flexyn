// src/lib/savedMeals.js
// localStorage-backed saved meals from Hub posts.
// Each entry comes from a hub post's linked_entity_snapshot + metadata.

const KEY = 'flexyn_saved_meals';
const MAX = 100;

export function loadSavedMeals() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

export function saveMeal(meal) {
  try {
    const list = loadSavedMeals();
    if (list.some(m => m.id === meal.id)) return;
    list.unshift({ ...meal, saved_at: new Date().toISOString() });
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  } catch {}
}

export function removeSavedMeal(id) {
  try {
    localStorage.setItem(KEY, JSON.stringify(loadSavedMeals().filter(m => m.id !== id)));
  } catch {}
}

export function isMealSaved(id) {
  try { return loadSavedMeals().some(m => m.id === id); } catch { return false; }
}
