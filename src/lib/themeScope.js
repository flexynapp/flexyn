// src/lib/themeScope.js
//
// Tools for rendering a subtree in a different user's theme palette
// without affecting the rest of the app.
//
// Used when viewing another user's Hub profile — their primary/accent/ring
// colors apply to the profile card and feed area, while the viewer's
// dark/light mode and overall layout colors stay intact.

import { THEMES } from './ThemeContext';

/**
 * Resolve a theme id to its CSS variable map.
 * Returns an inline-style object suitable for spread onto a React element.
 * Falls back to the first theme if the id isn't recognized.
 */
export function getThemeStyle(themeId) {
  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
  // Spread the theme's vars as inline CSS custom properties.
  const out = {};
  for (const [k, v] of Object.entries(theme.vars || {})) {
    out[k] = v;
  }
  return out;
}

/**
 * Resolve a theme id to a small accent-color object (CSS color strings) —
 * useful when you need a one-off color for an overlay that lives in a
 * portal (and therefore can't inherit CSS vars from the scoped wrapper).
 */
export function getThemePreview(themeId) {
  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
  return theme.preview || ['#888', '#444'];
}