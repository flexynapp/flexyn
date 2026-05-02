// src/lib/data/hubReactions.js
import { base44 } from '@/api/base44Client';
import * as hubPosts from './hubPosts';

const e = () => base44.entities.HubReaction;

/** Get the current user's reaction (or null) for a given post. */
export const getMyReaction = async (postId, email) => {
  if (!postId || !email) return null;
  const rows = await e().filter({ post_id: postId, user_email: email }, '-created_date', 1).catch(() => []);
  return rows[0] || null;
};

/**
 * Set the user's reaction on a post. Pass `null` to clear.
 * Handles all transitions: none→like, like→dislike, like→none, etc.
 * Updates the denormalized counters on the post atomically (best-effort).
 */
export const setReaction = async (postId, email, newReaction /* 'like' | 'dislike' | null */) => {
  const existing = await getMyReaction(postId, email);

  if (existing && existing.reaction_type === newReaction) return existing; // no-op

  // Decrement old counter if any
  if (existing) {
    await e().delete(existing.id).catch(() => {});
    const field = existing.reaction_type === 'like' ? 'like_count' : 'dislike_count';
    await hubPosts.incrementCounter(postId, field, -1);
  }

  // Add new reaction (if any)
  if (newReaction) {
    const created = await e().create({ post_id: postId, user_email: email, reaction_type: newReaction });
    const field = newReaction === 'like' ? 'like_count' : 'dislike_count';
    await hubPosts.incrementCounter(postId, field, +1);
    return created;
  }

  return null;
};

/** Cascade-delete all reactions by a user and decrement post counters. */
export const purgeForUser = async (email) => {
  if (!email) return;
  const rows = await e().filter({ user_email: email }, '-created_date', 1000).catch(() => []);
  const dec = {};
  for (const r of rows) {
    if (!r.post_id || !r.reaction_type) continue;
    dec[r.post_id] = dec[r.post_id] || { like: 0, dislike: 0 };
    dec[r.post_id][r.reaction_type] = (dec[r.post_id][r.reaction_type] || 0) + 1;
  }
  await Promise.all(rows.map(r => e().delete(r.id).catch(() => {})));
  await Promise.all(
    Object.entries(dec).flatMap(([postId, counts]) => [
      counts.like    ? hubPosts.incrementCounter(postId, 'like_count',    -counts.like).catch(() => {})    : null,
      counts.dislike ? hubPosts.incrementCounter(postId, 'dislike_count', -counts.dislike).catch(() => {}) : null,
    ].filter(Boolean))
  );
};