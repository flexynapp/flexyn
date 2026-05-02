// Tier system based on level (every 10 levels: new tier with unique color + animation effect)
export function getTier(level, t) {
  if (level >= 91) return {
    name: t('levelBar.tier.legendary'),
    badge: 'from-yellow-400 via-orange-400 to-red-500',
    bar: 'from-yellow-400 via-orange-400 to-red-500',
    bg: 'bg-yellow-500/10 border border-yellow-500/30',
    text: 'text-yellow-500',
    glow: 'shadow-yellow-500/40',
    particles: 'golden',
  };
  if (level >= 81) return {
    name: t('levelBar.tier.diamond'),
    badge: 'from-cyan-300 via-blue-400 to-indigo-500',
    bar: 'from-cyan-300 to-indigo-500',
    bg: 'bg-cyan-500/10 border border-cyan-400/30',
    text: 'text-cyan-400',
    glow: 'shadow-cyan-400/40',
    particles: 'sparkle',
  };
  if (level >= 71) return {
    name: t('levelBar.tier.platinum'),
    badge: 'from-slate-300 via-slate-400 to-slate-500',
    bar: 'from-slate-300 to-slate-500',
    bg: 'bg-slate-400/10 border border-slate-400/30',
    text: 'text-slate-300',
    glow: 'shadow-slate-400/30',
    particles: 'pulse',
  };
  if (level >= 61) return {
    name: t('levelBar.tier.amethyst'),
    badge: 'from-purple-400 via-violet-500 to-fuchsia-500',
    bar: 'from-purple-400 to-fuchsia-500',
    bg: 'bg-purple-500/10 border border-purple-500/30',
    text: 'text-purple-400',
    glow: 'shadow-purple-500/40',
    particles: 'sparkle',
  };
  if (level >= 51) return {
    name: t('levelBar.tier.ruby'),
    badge: 'from-red-400 via-rose-500 to-pink-500',
    bar: 'from-red-400 to-pink-500',
    bg: 'bg-rose-500/10 border border-rose-500/30',
    text: 'text-rose-400',
    glow: 'shadow-rose-500/40',
    particles: 'pulse',
  };
  if (level >= 41) return {
    name: t('levelBar.tier.emerald'),
    badge: 'from-emerald-400 via-green-500 to-teal-500',
    bar: 'from-emerald-400 to-teal-500',
    bg: 'bg-emerald-500/10 border border-emerald-500/30',
    text: 'text-emerald-400',
    glow: 'shadow-emerald-500/40',
    particles: 'sparkle',
  };
  if (level >= 31) return {
    name: t('levelBar.tier.sapphire'),
    badge: 'from-blue-400 via-blue-500 to-indigo-500',
    bar: 'from-blue-400 to-indigo-500',
    bg: 'bg-blue-500/10 border border-blue-500/30',
    text: 'text-blue-400',
    glow: 'shadow-blue-500/40',
    particles: 'pulse',
  };
  if (level >= 21) return {
    name: t('levelBar.tier.gold'),
    badge: 'from-amber-400 via-yellow-500 to-orange-400',
    bar: 'from-amber-400 to-orange-400',
    bg: 'bg-amber-500/10 border border-amber-400/30',
    text: 'text-amber-400',
    glow: 'shadow-amber-400/30',
    particles: 'sparkle',
  };
  if (level >= 11) return {
    name: t('levelBar.tier.silver'),
    badge: 'from-slate-300 to-slate-400',
    bar: 'from-slate-300 to-slate-400',
    bg: 'bg-slate-300/10 border border-slate-300/20',
    text: 'text-slate-400',
    glow: 'shadow-slate-300/20',
    particles: 'none',
  };
  return {
    name: t('levelBar.tier.bronze'),
    badge: 'from-orange-500 to-amber-600',
    bar: 'from-primary to-accent',
    bg: 'bg-primary/10 border border-primary/20',
    text: 'text-primary',
    glow: 'shadow-primary/20',
    particles: 'none',
  };
}