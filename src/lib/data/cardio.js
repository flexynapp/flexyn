// src/lib/data/cardio.js
import { base44 } from '@/api/base44Client';
import { containsProfanity } from '@/lib/profanityFilter';

export const list = (email, limit = 50) =>
  base44.entities.CardioLog.filter({ created_by: email }, '-date', limit);

export const listByDate = (email, date) =>
  base44.entities.CardioLog.filter({ created_by: email, date }, '-created_date', 50);

function assertNoTextProfanity(fields) {
  for (const [key, val] of Object.entries(fields)) {
    if (typeof val === 'string' && containsProfanity(val)) {
      throw Object.assign(new Error(`Profanity detected in field "${key}"`), { code: 'PROFANITY', field: key });
    }
  }
}

export const create = (data) => {
  assertNoTextProfanity({ notes: data.notes });
  return base44.entities.CardioLog.create(data);
};
export const update = (id, data) => {
  if (data.notes !== undefined) assertNoTextProfanity({ notes: data.notes });
  return base44.entities.CardioLog.update(id, data);
};
export const remove = (id) => base44.entities.CardioLog.delete(id);

export const purgeForUser = async (email) => {
  if (!email) return;
  const PAGE = 100;
  let total = 0;
  while (true) {
    const batch = await base44.entities.CardioLog
      .filter({ created_by: email }, '-created_date', PAGE).catch(() => []);
    if (!batch || batch.length === 0) break;
    await Promise.all(batch.map(r =>
      base44.entities.CardioLog.delete(r.id).catch(() => {})
    ));
    total += batch.length;
    if (batch.length < PAGE || total > 5000) break;
  }
};