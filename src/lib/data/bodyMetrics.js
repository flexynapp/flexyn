// src/lib/data/bodyMetrics.js
import { base44 } from '@/api/base44Client';

export const list = (email, limit = 200) =>
  base44.entities.BodyMetric.filter({ created_by: email }, 'date', limit);

export const create = (data) => base44.entities.BodyMetric.create(data);
export const update = (id, data) => base44.entities.BodyMetric.update(id, data);
export const remove = (id) => base44.entities.BodyMetric.delete(id);

export const purgeForUser = async (email) => {
  if (!email) return;
  const batch = await base44.entities.BodyMetric.filter({ created_by: email }).catch(() => []);
  await Promise.all((batch || []).map(r =>
    base44.entities.BodyMetric.delete(r.id).catch(() => {})
  ));
};