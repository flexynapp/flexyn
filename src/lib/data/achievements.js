// src/lib/data/achievements.js
import { base44 } from '@/api/base44Client';
import { filterAfterReset } from '@/lib/accountReset';

export const list = async (email) => {
  const [rows, me] = await Promise.all([
    base44.entities.Achievement.filter({ created_by: email }),
    base44.auth.me().catch(() => null),
  ]);
  return filterAfterReset(rows, me);
};

export const purgeForUser = async (email) => {
  if (!email) return;
  const batch = await base44.entities.Achievement.filter({ created_by: email }).catch(() => []);
  await Promise.all((batch || []).map(r =>
    base44.entities.Achievement.delete(r.id).catch(() => {})
  ));
};