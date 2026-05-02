import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { useSettings } from '@/lib/SettingsContext';
import { calculateLevelFromXp } from '@/lib/xpSystem';
import LevelUpOverlay from '@/components/LevelUpOverlay';

/**
 * Watches the authenticated user's total_xp and shows LevelUpOverlay when —
 * and only when — the user crosses a level boundary during this session.
 *
 * Detection rules (all must hold to fire):
 *   1. We have a fully loaded userProfile with a server-assigned id.
 *   2. We have an established baseline for this email in localStorage.
 *   3. The current level is strictly greater than the baseline.
 *   4. The user has level animations enabled.
 *
 * Persistence: per-email baseline in localStorage so reloads don't re-fire.
 */
const STORAGE_PREFIX = 'fn-last-seen-level:';

export default function LevelUpManager() {
  const { user } = useAuth();
  const { levelAnimationsEnabled } = useSettings();

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: () => base44.auth.me(),
    enabled: !!user?.email,
  });

  const [event, setEvent] = useState(null);
  const lastFiredForRef = useRef(null); // guards against re-fire within a single session

  useEffect(() => {
    if (!user?.email) return;
    // Wait for the real profile record — id is server-assigned, so it's a
    // reliable "fully loaded" signal. Without this gate, the initial render
    // (total_xp=0 → level 1) would baseline incorrectly.
    if (!userProfile || !userProfile.id) return;

    const totalXp = Number(userProfile.total_xp) || 0;
    const currentLevel = calculateLevelFromXp(totalXp).level;
    const storageKey = `${STORAGE_PREFIX}${user.email}`;

    let lastSeenLevel = null;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw !== null) lastSeenLevel = Number(raw);
    } catch { /* localStorage unavailable — degrade gracefully */ }

    // First time we've seen this user on this device — baseline silently.
    if (lastSeenLevel === null || Number.isNaN(lastSeenLevel)) {
      try { localStorage.setItem(storageKey, String(currentLevel)); } catch {}
      lastFiredForRef.current = currentLevel;
      return;
    }

    // Account reset / odd state — re-baseline silently, never fire on a drop.
    if (currentLevel < lastSeenLevel) {
      try { localStorage.setItem(storageKey, String(currentLevel)); } catch {}
      lastFiredForRef.current = currentLevel;
      return;
    }

    // No level change — nothing to do.
    if (currentLevel === lastSeenLevel) return;

    // currentLevel > lastSeenLevel — genuine level-up.
    // Guard against re-firing for the same target within one session
    // (e.g. if the query refetches and the effect re-runs before the user
    // dismisses the overlay).
    if (lastFiredForRef.current === currentLevel) {
      try { localStorage.setItem(storageKey, String(currentLevel)); } catch {}
      return;
    }

    if (levelAnimationsEnabled) {
      setEvent({ fromLevel: lastSeenLevel, toLevel: currentLevel, totalXp });
    }
    lastFiredForRef.current = currentLevel;
    try { localStorage.setItem(storageKey, String(currentLevel)); } catch {}
  }, [
    user?.email,
    userProfile?.id,
    userProfile?.total_xp,
    levelAnimationsEnabled,
  ]);

  return <LevelUpOverlay event={event} onDismiss={() => setEvent(null)} />;
}