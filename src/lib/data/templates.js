// src/lib/data/templates.js
import { base44 } from '@/api/base44Client';
import { containsProfanity } from '@/lib/profanityFilter';

export const list = (email) =>
  base44.entities.WorkoutTemplate.filter({ created_by: email }, '-created_date');

function assertNoTextProfanity(fields) {
  for (const [key, val] of Object.entries(fields)) {
    if (typeof val === 'string' && containsProfanity(val)) {
      throw Object.assign(new Error(`Profanity detected in field "${key}"`), { code: 'PROFANITY', field: key });
    }
  }
}

export const create = (data) => {
  assertNoTextProfanity({ name: data.name, description: data.description });
  return base44.entities.WorkoutTemplate.create(data);
};
export const update = (id, data) => {
  const textFields = {};
  if (data.name !== undefined) textFields.name = data.name;
  if (data.description !== undefined) textFields.description = data.description;
  if (Object.keys(textFields).length) assertNoTextProfanity(textFields);
  return base44.entities.WorkoutTemplate.update(id, data);
};
export const remove = (id) => base44.entities.WorkoutTemplate.delete(id);

export const purgeForUser = async (email) => {
  if (!email) return;
  const batch = await base44.entities.WorkoutTemplate.filter({ created_by: email }).catch(() => []);
  await Promise.all((batch || []).map(r =>
    base44.entities.WorkoutTemplate.delete(r.id).catch(() => {})
  ));
};