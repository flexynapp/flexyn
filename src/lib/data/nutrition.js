// src/lib/data/nutrition.js
import { base44 } from '@/api/base44Client';
import { containsProfanity } from '@/lib/profanityFilter';

export const list = (email, limit = 50) =>
  base44.entities.NutritionLog.filter({ created_by: email }, '-date', limit);

function assertNoTextProfanity(fields) {
  for (const [key, val] of Object.entries(fields)) {
    if (typeof val === 'string' && containsProfanity(val)) {
      throw Object.assign(new Error(`Profanity detected in field "${key}"`), { code: 'PROFANITY', field: key });
    }
  }
}

export const create = (data) => {
  assertNoTextProfanity({ food_name: data.food_name, notes: data.notes });
  return base44.entities.NutritionLog.create(data);
};
export const update = (id, data) => {
  const textFields = {};
  if (data.food_name !== undefined) textFields.food_name = data.food_name;
  if (data.notes !== undefined) textFields.notes = data.notes;
  if (Object.keys(textFields).length) assertNoTextProfanity(textFields);
  return base44.entities.NutritionLog.update(id, data);
};
export const remove = (id) => base44.entities.NutritionLog.delete(id);

export const purgeForUser = async (email) => {
  if (!email) return;
  const PAGE = 100;
  let total = 0;
  while (true) {
    const batch = await base44.entities.NutritionLog
      .filter({ created_by: email }, '-created_date', PAGE).catch(() => []);
    if (!batch || batch.length === 0) break;
    await Promise.all(batch.map(r =>
      base44.entities.NutritionLog.delete(r.id).catch(() => {})
    ));
    total += batch.length;
    if (batch.length < PAGE || total > 5000) break;
  }
};