// Tracks whether this browser has ever opened Flexyn before.
//
// This is separate from onboardingHint.js — first-launch is about the DEVICE,
// onboarding is about the ACCOUNT. They usually align but handle different cases:
// - First-launch = false: brand new visitor, never opened Flexyn here.
// - First-launch = true, onboarding-seen = false: opened app but never completed signup.
// - Both true: returning user with a completed account.
//
// Both are cleared on account deletion so a deleted-and-re-installed user is treated as new.
//
// Server-side User.onboarding_complete remains the source of truth for account state.
// These localStorage flags are UX hints for the unauthenticated or pre-authenticated phase.

const FIRST_LAUNCH_KEY = 'fn-has-launched';

/**
 * Returns true if this is the first time the app has ever been opened on this browser.
 * Has a side effect: marks the app as launched after the first check returns true.
 */
export function consumeFirstLaunch() {
  try {
    const seen = localStorage.getItem(FIRST_LAUNCH_KEY);
    if (seen !== 'true') {
      localStorage.setItem(FIRST_LAUNCH_KEY, 'true');
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Returns whether the app has been launched before, WITHOUT marking it.
 * Use this for read-only checks (e.g., "should I show a tutorial hint?").
 */
export function isFirstLaunch() {
  try {
    return localStorage.getItem(FIRST_LAUNCH_KEY) !== 'true';
  } catch {
    return false;
  }
}

/**
 * Clears the first-launch flag. Call this on account deletion so a user who
 * deletes and re-signs-up is treated as a fresh install.
 */
export function clearFirstLaunch() {
  try {
    localStorage.removeItem(FIRST_LAUNCH_KEY);
    localStorage.removeItem('fn-returning-user');
  } catch {}
}

/**
 * Marks the user as a returning user (e.g., after they complete onboarding or sign in).
 */
export function markReturningUser() {
  try { localStorage.setItem('fn-returning-user', 'true'); } catch {}
}

/**
 * Returns true if the user has been marked as a returning user.
 */
export function isReturningUser() {
  try { return localStorage.getItem('fn-returning-user') === 'true'; } catch { return false; }
}

// Computed once per app session — captures the first-launch state as it was
// when the app booted. Components can import this for the duration of the session.
let _wasFirstLaunchThisSession = null;

export function getWasFirstLaunchThisSession() {
  if (_wasFirstLaunchThisSession === null) {
    _wasFirstLaunchThisSession = consumeFirstLaunch();
  }
  return _wasFirstLaunchThisSession;
}