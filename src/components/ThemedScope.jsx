// src/components/ThemedScope.jsx
import { getThemeStyle } from '@/lib/themeScope';

/**
 * Wraps children in a div that overrides CSS variables for primary/accent/ring
 * to match the given themeId. Tailwind classes like `bg-primary`, `text-primary`
 * resolve through these vars and will pick up the scoped values.
 *
 * Dark mode is intentionally NOT scoped — the viewer keeps their own light/dark
 * preference. Only the theme accent palette changes.
 *
 * Usage:
 *   <ThemedScope themeId={otherUser.preferred_theme}>
 *     <ProfileCard ... />
 *   </ThemedScope>
 *
 * Pass `null` or omit `themeId` to use the global theme (no override).
 */
export default function ThemedScope({ themeId, className = '', children }) {
  if (!themeId) {
    return <div className={className}>{children}</div>;
  }
  return (
    <div style={getThemeStyle(themeId)} className={className}>
      {children}
    </div>
  );
}