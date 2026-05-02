// src/lib/data/hubFollows.js
import { base44 } from '@/api/base44Client';

const e = () => base44.entities.HubFollow;

/** List emails the given user is following. */
export const listFollowing = async (email) => {
  if (!email) return [];
  const rows = await e().filter({ follower_email: email }, '-created_date', 500).catch(() => []);
  return rows.map(r => r.followee_email);
};

/** List emails of users following the given user (their followers). */
export const listFollowers = async (email) => {
  if (!email) return [];
  const rows = await e().filter({ followee_email: email }, '-created_date', 500).catch(() => []);
  return rows.map(r => r.follower_email);
};

/** Check if follower follows target. */
export const isFollowing = async (followerEmail, followeeEmail) => {
  if (!followerEmail || !followeeEmail) return false;
  if (followerEmail === followeeEmail) return false;
  const rows = await e().filter({ follower_email: followerEmail, followee_email: followeeEmail }, '-created_date', 1).catch(() => []);
  return rows.length > 0;
};

/** Create a follow relationship. Idempotent — returns existing if already followed. */
export const follow = async (followerEmail, followeeEmail) => {
  if (followerEmail === followeeEmail) return null;
  const existing = await e().filter({ follower_email: followerEmail, followee_email: followeeEmail }, '-created_date', 1).catch(() => []);
  if (existing.length > 0) return existing[0];
  return await e().create({ follower_email: followerEmail, followee_email: followeeEmail });
};

/** Remove a follow relationship. */
export const unfollow = async (followerEmail, followeeEmail) => {
  const existing = await e().filter({ follower_email: followerEmail, followee_email: followeeEmail }, '-created_date', 1).catch(() => []);
  if (existing.length === 0) return;
  await e().delete(existing[0].id).catch(() => {});
};

/** Cascade-delete all follow rows involving a user (in either direction). */
export const purgeForUser = async (email) => {
  if (!email) return;
  const [asFollower, asFollowing] = await Promise.all([
    e().filter({ follower_email: email }, '-created_date', 500).catch(() => []),
    e().filter({ followee_email: email }, '-created_date', 500).catch(() => []),
  ]);
  await Promise.all([
    ...asFollower.map(r => e().delete(r.id).catch(() => {})),
    ...asFollowing.map(r => e().delete(r.id).catch(() => {})),
  ]);
};