import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { useWeightUnit } from '@/lib/WeightUnitContext';
// Note: useWeightUnit is also used in the top-level Onboarding component
import LanguagePicker from '@/components/LanguagePicker';
import { getWasFirstLaunchThisSession, markReturningUser } from '@/lib/firstLaunch';
import { containsProfanity } from '@/lib/profanityFilter';
import ProfanityWarningDialog from '@/components/ProfanityWarningDialog';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parse } from 'date-fns';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { ArrowRight, User, Calendar, Weight, Ruler, Dumbbell, TrendingUp, Apple, Trophy, Users, Medal, LogIn, Check, X, Info, ChevronDown } from 'lucide-react';
import LocationStep from '@/components/onboarding/LocationStep';

// ── Slideshow visuals ─────────────────────────────────────────────────────────

function VisualFrame({ children, accent = 'primary' }) {
  return (
    <div className="relative w-full max-w-[280px] h-[180px] rounded-2xl bg-card border border-border shadow-lg shadow-foreground/5 overflow-hidden mb-6">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(120% 80% at 50% 0%, hsl(var(--${accent}) / 0.06), transparent 60%)` }}
      />
      <div className="relative w-full h-full p-4">{children}</div>
    </div>
  );
}

function WorkoutLogVisual() {
  const sets = [
    { weight: 135, reps: 10 },
    { weight: 135, reps: 8  },
    { weight: 145, reps: 6  },
  ];
  return (
    <VisualFrame>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center">
          <Dumbbell className="w-4 h-4 text-violet-500" />
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-bold tracking-tight text-foreground leading-none">Bench Press</p>
          <p className="text-[9px] text-muted-foreground mt-0.5">Chest · 3 sets</p>
        </div>
      </div>
      <div className="space-y-1.5">
        {sets.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.35, duration: 0.35, ease: 'easeOut' }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-secondary/60"
          >
            <span className="text-[9px] font-bold text-muted-foreground w-8">SET {i + 1}</span>
            <span className="text-[11px] font-semibold text-foreground flex-1">
              {s.weight} <span className="text-[9px] text-muted-foreground">lb</span>
              <span className="mx-1.5 text-muted-foreground">×</span>
              {s.reps}
            </span>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 + i * 0.35, type: 'spring', stiffness: 400, damping: 20 }}
              className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center"
            >
              <Check className="w-2.5 h-2.5 text-white" strokeWidth={3.5} />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </VisualFrame>
  );
}

function ProgressChartVisual() {
  const points = [
    { x: 8,   y: 110 },
    { x: 56,  y: 96  },
    { x: 104, y: 84  },
    { x: 152, y: 70  },
    { x: 200, y: 56  },
    { x: 248, y: 42  },
  ];
  const path = points.reduce((acc, p, i) => acc + (i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`), '');
  const areaPath = path + ` L ${points[points.length - 1].x} 140 L ${points[0].x} 140 Z`;
  const labels = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'];
  return (
    <VisualFrame>
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground leading-none">Bench Press</p>
          <p className="text-[14px] font-bold text-foreground mt-1 leading-none">+18% <span className="text-[9px] font-semibold text-emerald-500">this month</span></p>
        </div>
        <TrendingUp className="w-4 h-4 text-emerald-500" />
      </div>
      <svg viewBox="0 0 264 152" className="w-full h-[110px]" preserveAspectRatio="none">
        {[35, 70, 105].map(y => (
          <line key={y} x1="0" x2="264" y1={y} y2={y} stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.6" />
        ))}
        <motion.path
          d={areaPath}
          fill="hsl(var(--primary))"
          fillOpacity="0.12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        />
        <motion.path
          d={path}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
        />
        {points.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x} cy={p.y}
            r={i === points.length - 1 ? 4 : 2.5}
            fill="hsl(var(--primary))"
            stroke="hsl(var(--background))"
            strokeWidth={i === points.length - 1 ? 2 : 1}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.18, type: 'spring', stiffness: 300, damping: 18 }}
          />
        ))}
      </svg>
      <div className="flex justify-between mt-1">
        {labels.map(l => (
          <span key={l} className="text-[8px] text-muted-foreground">{l}</span>
        ))}
      </div>
    </VisualFrame>
  );
}

function MacrosVisual() {
  const macros = [
    { label: 'Protein', short: 'P', value: 142, target: 165, color: 'hsl(217 91% 60%)' },
    { label: 'Carbs',   short: 'C', value: 218, target: 280, color: 'hsl(38 92% 55%)'  },
    { label: 'Fats',    short: 'F', value: 58,  target: 75,  color: 'hsl(160 64% 45%)' },
  ];
  const R = 22;
  const C = 2 * Math.PI * R;
  return (
    <VisualFrame>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
          <Apple className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-bold tracking-tight text-foreground leading-none">Today's Macros</p>
          <p className="text-[9px] text-muted-foreground mt-0.5">2,140 / 2,400 kcal</p>
        </div>
      </div>
      <div className="flex items-center justify-around mt-1">
        {macros.map((m, i) => {
          const pct = m.value / m.target;
          return (
            <div key={m.label} className="flex flex-col items-center gap-1.5">
              <svg width="56" height="56" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r={R} fill="none" stroke="hsl(var(--border))" strokeWidth="4" opacity="0.4" />
                <motion.circle
                  cx="28" cy="28" r={R}
                  fill="none"
                  stroke={m.color}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  initial={{ strokeDashoffset: C }}
                  animate={{ strokeDashoffset: C * (1 - pct) }}
                  transition={{ delay: 0.15 + i * 0.18, duration: 1.0, ease: 'easeOut' }}
                  transform="rotate(-90 28 28)"
                />
                <text x="28" y="32" textAnchor="middle" fontSize="11" fill="hsl(var(--foreground))" fontWeight="bold">{m.short}</text>
              </svg>
              <span className="text-[9px] font-semibold text-foreground">{m.value}<span className="text-muted-foreground">/{m.target}g</span></span>
            </div>
          );
        })}
      </div>
    </VisualFrame>
  );
}

function GoalsVisual() {
  const goalPct = 0.72;
  return (
    <VisualFrame>
      <div className="flex items-center gap-2 mb-3">
        <motion.div
          initial={{ rotate: -10, scale: 0.85 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.1 }}
          className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center"
        >
          <Trophy className="w-4 h-4 text-amber-500" />
        </motion.div>
        <div className="flex-1">
          <p className="text-[11px] font-bold tracking-tight text-foreground leading-none">Squat 315 lb</p>
          <p className="text-[9px] text-muted-foreground mt-0.5">Goal · 6 weeks left</p>
        </div>
      </div>
      <div className="mb-1 mt-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-semibold text-muted-foreground">CURRENT</span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.3 }}
            className="text-[10px] font-bold text-foreground"
          >
            225 lb · 71%
          </motion.span>
        </div>
        <div className="relative h-2.5 rounded-full bg-secondary overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${goalPct * 100}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
            className="absolute left-0 top-0 h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(38 92% 55%))' }}
          />
        </div>
      </div>
      <div className="flex gap-1.5 mt-3">
        {[
          { label: 'First PR',    color: 'bg-blue-500/15 text-blue-500'       },
          { label: '30-Day',      color: 'bg-emerald-500/15 text-emerald-500' },
          { label: '10 Workouts', color: 'bg-amber-500/15 text-amber-500'     },
        ].map((b, i) => (
          <motion.span
            key={b.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.12, duration: 0.35 }}
            className={`text-[8px] font-bold px-1.5 py-1 rounded-md flex items-center gap-1 ${b.color}`}
          >
            <Medal className="w-2.5 h-2.5" />
            {b.label}
          </motion.span>
        ))}
      </div>
    </VisualFrame>
  );
}

function HubVisual() {
  return (
    <VisualFrame>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-rose-500/15 flex items-center justify-center">
          <Users className="w-4 h-4 text-rose-500" />
        </div>
        <p className="text-[11px] font-bold tracking-tight text-foreground leading-none flex-1">The Hub</p>
        <span className="text-[8px] text-muted-foreground">Just now</span>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="rounded-xl bg-secondary/60 p-2.5"
      >
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center text-white text-[9px] font-bold">JL</div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-foreground leading-none">@jordan_lifts</p>
            <p className="text-[8px] text-muted-foreground mt-0.5">crushed leg day 🦵</p>
          </div>
        </div>
        <div className="rounded-lg bg-card px-2 py-1.5 mb-2">
          <p className="text-[9px] text-muted-foreground">Squat</p>
          <p className="text-[11px] font-bold text-foreground leading-tight">5 × 5 @ 245 lb</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ delay: 0.9, duration: 0.5, ease: 'easeInOut' }}
            className="flex items-center gap-1"
          >
            <span className="text-[11px]">🔥</span>
            <FlameCounter />
          </motion.div>
          <span className="text-[9px] text-muted-foreground">3 comments</span>
        </div>
      </motion.div>
    </VisualFrame>
  );
}

function FlameCounter() {
  const [n, setN] = useState(11);
  useEffect(() => {
    const t = setTimeout(() => setN(12), 900);
    return () => clearTimeout(t);
  }, []);
  return <span className="text-[9px] font-bold text-foreground tabular-nums">{n}</span>;
}

function LeaderboardVisual() {
  const rows = [
    { rank: 1, handle: '@alex_iron',  value: 12480, color: 'from-amber-400 to-amber-600',   medal: '🥇' },
    { rank: 2, handle: '@sam_strong', value: 11220, color: 'from-slate-300 to-slate-500',   medal: '🥈' },
    { rank: 3, handle: '@you',        value: 10580, color: 'from-orange-400 to-orange-600', medal: '🥉', isYou: true },
  ];
  const max = rows[0].value;
  return (
    <VisualFrame>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center">
          <Medal className="w-4 h-4 text-cyan-500" />
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-bold tracking-tight text-foreground leading-none">Weekly Volume</p>
          <p className="text-[9px] text-muted-foreground mt-0.5">USA · This week</p>
        </div>
      </div>
      <div className="space-y-1.5">
        {rows.map((r, i) => (
          <motion.div
            key={r.rank}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.15, duration: 0.35 }}
            className={`relative flex items-center gap-2 rounded-lg px-2 py-1.5 ${r.isYou ? 'bg-primary/10 ring-1 ring-primary/30' : 'bg-secondary/50'}`}
          >
            <span className="text-[11px]">{r.medal}</span>
            <span className="text-[10px] font-bold text-foreground w-16 truncate">{r.handle}</span>
            <div className="flex-1 h-2 rounded-full bg-card overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(r.value / max) * 100}%` }}
                transition={{ delay: 0.35 + i * 0.15, duration: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full bg-gradient-to-r ${r.color}`}
              />
            </div>
            <span className="text-[9px] font-bold text-foreground tabular-nums w-9 text-right">{(r.value / 1000).toFixed(1)}k</span>
          </motion.div>
        ))}
      </div>
    </VisualFrame>
  );
}

// ── WelcomeScreen ─────────────────────────────────────────────────────────────

function WelcomeScreen({ onGetStarted }) {
  const { t } = useLanguage();
  const [slide, setSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  const features = [
    { Visual: WorkoutLogVisual,    title: t('onboarding.slide.workout.title'),      description: t('onboarding.slide.workout.desc') },
    { Visual: ProgressChartVisual, title: t('onboarding.slide.progress.title'),     description: t('onboarding.slide.progress.desc') },
    { Visual: MacrosVisual,        title: t('onboarding.slide.nutrition.title'),    description: t('onboarding.slide.nutrition.desc') },
    { Visual: GoalsVisual,         title: t('onboarding.slide.goals.title'),        description: t('onboarding.slide.goals.desc') },
    { Visual: HubVisual,           title: t('onboarding.slide.hub.title'),          description: t('onboarding.slide.hub.desc') },
    { Visual: LeaderboardVisual,   title: t('onboarding.slide.leaderboards.title'), description: t('onboarding.slide.leaderboards.desc') },
  ];

  useEffect(() => {
    if (getWasFirstLaunchThisSession()) {
      setTimeout(() => {
        toast.success(t('onboarding.toast.welcome'), {
          description: t('onboarding.toast.welcomeDesc'),
          duration: 4000,
        });
      }, 800);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setSlide(s => (s + 1) % features.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [features.length]);

  const goTo = (i) => {
    setDirection(i > slide ? 1 : -1);
    setSlide(i);
  };

  const feat = features[slide];
  const Visual = feat.Visual;

  const slideVariants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 50 : -50 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -50 : 50 }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="relative fixed inset-0 bg-background flex flex-col items-center justify-between p-6 pb-10"
    >
      {/* Ambient gradients */}
      <div aria-hidden="true" className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full h-[480px]" style={{ background: 'radial-gradient(ellipse 900px 480px at 50% 0%, hsl(var(--primary) / 0.10), transparent 70%)' }} />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 w-full h-64" style={{ background: 'radial-gradient(ellipse 700px 280px at 30% 100%, hsl(var(--primary) / 0.06), transparent 65%)' }} />

      {/* Logo */}
      <div className="relative pt-10 flex flex-col items-center gap-2 w-full max-w-sm">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-3xl bg-primary/30 blur-2xl" aria-hidden="true" />
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-xl shadow-primary/30 ring-1 ring-primary/20"
          >
            <img src="https://media.base44.com/images/public/69dfb5d1674e81512478f6f7/a7dcfb0be_transparent-logo.png" alt="Flexyn" className="w-full h-full object-contain" />
          </motion.div>
        </motion.div>
        <p className="font-heading text-3xl font-bold tracking-tight bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">{t('app.name')}</p>
        <p className="text-sm text-muted-foreground">{t('app.tagline')}</p>
        <p className="text-xs text-muted-foreground mt-1">{t('onboarding.welcome.languageHint')}</p>
        <div className="flex justify-center mt-3 mb-8">
          <LanguagePicker variant="compact" />
        </div>
      </div>

      {/* Feature Slideshow */}
      <div className="relative w-full max-w-sm flex-1 flex flex-col items-center justify-center">
        <div className="w-full overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={slide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="flex flex-col items-center text-center px-4"
            >
              <Visual />
              <h2 className="font-heading text-xl md:text-2xl font-bold tracking-tight mb-2">{feat.title}</h2>
              <p className="text-muted-foreground text-[13px] leading-relaxed max-w-xs">{feat.description}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex gap-1.5 mt-8">
          {features.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === slide ? 'w-5 bg-primary' : 'w-1.5 bg-border hover:bg-muted-foreground/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="relative w-full max-w-sm space-y-3 mt-6">
        <div className="flex items-center justify-center gap-2 mb-1 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Check className="w-3 h-3 text-primary" strokeWidth={3} />
            {t('onboarding.welcome.trust.free')}
          </span>
          <span className="text-border">•</span>
          <span className="flex items-center gap-1">
            <Check className="w-3 h-3 text-primary" strokeWidth={3} />
            {t('onboarding.welcome.trust.noCard')}
          </span>
          <span className="text-border">•</span>
          <span className="flex items-center gap-1">
            <Check className="w-3 h-3 text-primary" strokeWidth={3} />
            {t('onboarding.welcome.trust.private')}
          </span>
        </div>
        <Button
          className="w-full h-14 font-heading font-bold text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
          onClick={onGetStarted}
        >
          {t('onboarding.welcome.getStarted')}
          <motion.span
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            className="ml-1 inline-flex"
          >
            <ArrowRight className="w-5 h-5" />
          </motion.span>
        </Button>
        <p className="text-xs text-muted-foreground text-center">{t('onboarding.welcome.tagline')}</p>
      </div>
    </motion.div>
  );
}

function CreateAccountScreen({ onNext }) {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="relative fixed inset-0 bg-background flex flex-col items-center justify-between p-6 pb-10"
    >
      {/* Ambient gradients */}
      <div aria-hidden="true" className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full h-[480px]" style={{ background: 'radial-gradient(ellipse 900px 480px at 50% 0%, hsl(var(--primary) / 0.10), transparent 70%)' }} />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 w-full h-64" style={{ background: 'radial-gradient(ellipse 700px 280px at 30% 100%, hsl(var(--primary) / 0.06), transparent 65%)' }} />

      <div className="relative pt-10 flex flex-col items-center gap-2">
         <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg shadow-primary/30">
           <img src="https://media.base44.com/images/public/69dfb5d1674e81512478f6f7/a7dcfb0be_transparent-logo.png" alt="Flexyn" className="w-full h-full object-contain" />
         </div>
         <div className="flex justify-center mt-3 mb-8">
           <LanguagePicker variant="compact" />
         </div>
       </div>

      <div className="relative w-full max-w-sm flex-1 flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-6"
        >
          <div className="absolute inset-0 rounded-3xl bg-primary/25 blur-2xl" aria-hidden="true" />
          <div className="relative w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20 shadow-lg">
            <LogIn className="w-10 h-10 text-primary" />
          </div>
        </motion.div>
        <h2 className="font-heading text-2xl font-bold tracking-tight mb-3">{t('onboarding.createAccount.title')}</h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-2">
          {t('onboarding.createAccount.desc')}
        </p>
        <ul className="text-sm text-foreground/80 space-y-2.5 mt-5 mb-2 text-left w-full max-w-xs">
          {[t('onboarding.createAccount.bullet1'), t('onboarding.createAccount.bullet2'), t('onboarding.createAccount.bullet3')].map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.08, duration: 0.4 }}
              className="flex items-start gap-2.5"
            >
              <span className="mt-0.5 w-4 h-4 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 text-primary" strokeWidth={3} />
              </span>
              <span>{item}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="relative w-full max-w-sm space-y-2 mt-8">
        <Button
          className="w-full h-14 font-heading font-bold text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
          onClick={() => base44.auth.redirectToLogin('/')}
        >
          {t('onboarding.createAccount.cta')} <ArrowRight className="w-5 h-5 ml-1" />
        </Button>
        <Button variant="ghost" className="w-full text-sm text-muted-foreground hover:text-foreground" onClick={() => base44.auth.redirectToLogin('/')}>
          {t('onboarding.createAccount.signIn')}
        </Button>
      </div>
    </motion.div>
  );
}

function DemographicsStep({ saving, onNext }) {
   const { t } = useLanguage();
   const { setWeightUnit } = useWeightUnit();
   const [showWhyInfo, setShowWhyInfo] = useState(false);
   const [values, setValues] = useState({
     username: '',
     gender: null,
     birthday: '',
     height_inches: '',
     height_cm: '',
     weight_lbs: '',
     weight_kg: '',
     weight_stone: '',
     heightUnit: 'imperial',
     weightUnit: 'lbs',
   });
   const [selectingGender, setSelectingGender] = useState(false);
   const [profanityOpen, setProfanityOpen] = useState(false);
   const [bdayMonth, setBdayMonth] = useState('');
   const [bdayDay, setBdayDay] = useState('');
   const [bdayYear, setBdayYear] = useState('');

  const handleGenderSelect = (gender) => {
    setValues(v => ({ ...v, gender: gender.toLowerCase() }));
    setSelectingGender(false);
  };

  const updateBirthday = (month, day, year) => {
    if (month && day && year) {
      const bdayStr = `${year}-${month}-${day.padStart(2, '0')}`;
      setValues(v => ({ ...v, birthday: bdayStr }));
    } else {
      setValues(v => ({ ...v, birthday: '' }));
    }
  };

  const handleBdayMonthChange = (month) => {
    setBdayMonth(month);
    updateBirthday(month, bdayDay, bdayYear);
  };

  const handleBdayDayChange = (day) => {
    setBdayDay(day);
    updateBirthday(bdayMonth, day, bdayYear);
  };

  const handleBdayYearChange = (year) => {
    setBdayYear(year);
    updateBirthday(bdayMonth, bdayDay, year);
  };

  const bdayConfirmation = bdayMonth && bdayDay && bdayYear
    ? format(parse(`${bdayYear}-${bdayMonth}-${bdayDay}`, 'yyyy-MM-dd', new Date()), 'EEEE, MMMM do, yyyy')
    : null;

  const weightPlaceholder = 
    values.weightUnit === 'lbs' ? '165' :
    values.weightUnit === 'kg' ? '75' :
    '11.8';

  const convertHeight = (val, fromUnit, toUnit) => {
    if (!val) return '';
    const num = parseFloat(val);
    if (fromUnit === 'imperial' && toUnit === 'metric') {
      return (num * 2.54).toFixed(1);
    } else if (fromUnit === 'metric' && toUnit === 'imperial') {
      return (num / 2.54).toFixed(1);
    }
    return val;
  };

  const convertWeight = (val, fromUnit, toUnit) => {
    if (!val) return '';
    const num = parseFloat(val);
    if (fromUnit === 'lbs' && toUnit === 'kg') return (num / 2.205).toFixed(1);
    if (fromUnit === 'kg' && toUnit === 'lbs') return (num * 2.205).toFixed(1);
    if (fromUnit === 'lbs' && toUnit === 'stone') return (num / 14).toFixed(2);
    if (fromUnit === 'stone' && toUnit === 'lbs') return (num * 14).toFixed(1);
    if (fromUnit === 'kg' && toUnit === 'stone') return (num / 6.35).toFixed(2);
    if (fromUnit === 'stone' && toUnit === 'kg') return (num * 6.35).toFixed(1);
    return val;
  };

  const handleHeightUnitChange = (unit) => {
    const oldUnit = values.heightUnit;
    if (oldUnit === 'imperial') {
      const inches = parseFloat(values.height_inches);
      if (inches) {
        setValues(v => ({ ...v, height_cm: convertHeight(inches.toString(), 'imperial', 'metric'), heightUnit: unit }));
      } else {
        setValues(v => ({ ...v, heightUnit: unit }));
      }
    } else {
      const cm = parseFloat(values.height_cm);
      if (cm) {
        setValues(v => ({ ...v, height_inches: convertHeight(cm.toString(), 'metric', 'imperial'), heightUnit: unit }));
      } else {
        setValues(v => ({ ...v, heightUnit: unit }));
      }
    }
  };

  const WEIGHT_RANGES = { lbs: [50, 700], kg: [22, 317], stone: [3.5, 50] };
  const clampWeight = (val, unit) => {
    const [min, max] = WEIGHT_RANGES[unit];
    return String(Math.min(Math.max(parseFloat(val) || 0, min), max));
  };

  const handleWeightUnitChange = (unit) => {
    const oldUnit = values.weightUnit;
    let val = '';
    if (oldUnit === 'lbs') val = values.weight_lbs;
    else if (oldUnit === 'kg') val = values.weight_kg;
    else if (oldUnit === 'stone') val = values.weight_stone;

    if (val) {
      const toLbs = clampWeight(convertWeight(val, oldUnit, 'lbs'), 'lbs');
      const toKg = clampWeight(convertWeight(val, oldUnit, 'kg'), 'kg');
      const toStone = clampWeight(convertWeight(val, oldUnit, 'stone'), 'stone');
      setValues(v => ({
        ...v,
        weight_lbs: unit === 'lbs' ? clampWeight(val, 'lbs') : toLbs,
        weight_kg: unit === 'kg' ? clampWeight(convertWeight(val, oldUnit, 'kg'), 'kg') : toKg,
        weight_stone: unit === 'stone' ? clampWeight(convertWeight(val, oldUnit, 'stone'), 'stone') : toStone,
        weightUnit: unit,
      }));
    } else {
      setValues(v => ({ ...v, weightUnit: unit }));
    }
  };

  // Expose current values snapshot so parent can collect them for the final save
  const isComplete = values.username && values.gender && values.birthday && values.height_inches && values.weight_lbs;
  // onNext receives the demographics payload to pass to the location step
  const handleNext = () => {
    if (!isComplete || saving) return;
    if (containsProfanity(values.username)) {
      toast.error('Please choose an appropriate username.');
      return;
    }
    const [weightMin, weightMax] = WEIGHT_RANGES[values.weightUnit];
    const weightVal = parseFloat(
      values.weightUnit === 'lbs' ? values.weight_lbs :
      values.weightUnit === 'kg' ? values.weight_kg :
      values.weight_stone
    );
    if (isNaN(weightVal) || weightVal < weightMin || weightVal > weightMax) {
      toast.error(`Please enter your actual body weight. Valid range: ${weightMin}–${weightMax} ${values.weightUnit}.`);
      return;
    }
    onNext({
      username: values.username.trim(),
      gender: values.gender,
      birthday: values.birthday,
      height_inches: parseFloat(values.height_inches),
      weight_lbs: parseFloat(values.weight_lbs),
      weight_unit: values.weightUnit,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="relative fixed inset-0 bg-background flex flex-col items-center justify-start overflow-y-auto p-4 md:p-6"
    >
      {/* Ambient gradients */}
      <div aria-hidden="true" className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full h-[480px]" style={{ background: 'radial-gradient(ellipse 900px 480px at 50% 0%, hsl(var(--primary) / 0.10), transparent 70%)' }} />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 w-full h-64" style={{ background: 'radial-gradient(ellipse 700px 280px at 30% 100%, hsl(var(--primary) / 0.06), transparent 65%)' }} />

      <div className="relative w-full max-w-md py-6 md:py-8 pb-10">
        <div className="flex justify-center mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            {t('onboarding.demographics.stepLabel') || 'Step 1 of 2'}
          </span>
        </div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight mb-1 text-center">{t('onboarding.demographics.title')}</h1>
        <p className="text-muted-foreground text-xs md:text-sm text-center mb-4">{t('onboarding.demographics.subtitle')}</p>

        {/* Collapsible Info Section */}
        <button
          type="button"
          onClick={() => setShowWhyInfo(v => !v)}
          className="w-full flex items-center justify-between gap-2 mb-4 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="text-xs font-medium text-foreground">{t('onboarding.demographics.whyTitle')}</span>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${showWhyInfo ? 'rotate-180' : ''}`} />
        </button>
        {showWhyInfo && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t('onboarding.demographics.whyBody')}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {/* Username */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">{t('onboarding.demographics.username')}</label>
            <Input
              type="text"
              placeholder={t('onboarding.demographics.usernamePlaceholder')}
              value={values.username}
              onChange={e => {
                const val = e.target.value.trim();
                if (containsProfanity(val)) {
                  setProfanityOpen(true);
                } else {
                  setValues(v => ({ ...v, username: val }));
                }
              }}
              maxLength="30"
              className="h-12"
            />
            <p className="text-xs text-muted-foreground mt-1">{values.username.length}/30 characters</p>
          </div>

          {/* Gender Selection */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">{t('onboarding.demographics.gender')}</label>
            {!selectingGender ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectingGender(true)}
                className="w-full h-12 justify-center"
              >
                {values.gender ? `${values.gender.charAt(0).toUpperCase() + values.gender.slice(1)} ${t('onboarding.demographics.genderChange')}` : t('onboarding.demographics.genderSelect')}
              </Button>
            ) : (
              <div className="space-y-2">
                {[
                  [t('onboarding.demographics.genderMale'), 'male'],
                  [t('onboarding.demographics.genderFemale'), 'female'],
                  [t('onboarding.demographics.genderOther'), 'other'],
                ].map(([label, value]) => (
                  <button
                    key={value}
                    onClick={() => handleGenderSelect(value)}
                    className="w-full px-4 py-3 text-sm font-medium border border-border rounded-lg hover:bg-secondary transition-colors text-center"
                  >
                    {label}
                  </button>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectingGender(false)}
                  className="w-full"
                  disabled={!values.gender}
                >
                  <Check className="w-4 h-4 mr-2" /> {t('onboarding.demographics.confirm')}
                </Button>
              </div>
            )}
          </div>

          {/* Birthday */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">{t('onboarding.demographics.birthday')}</label>
            <div className="flex gap-2 mb-3">
              <Select value={bdayMonth} onValueChange={handleBdayMonthChange}>
                <SelectTrigger className="h-12 flex-1 text-center">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
                    <SelectItem key={i} value={String(i + 1).padStart(2, '0')}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={bdayDay} onValueChange={handleBdayDayChange}>
                <SelectTrigger className="h-12 flex-1 text-center">
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                    <SelectItem key={d} value={String(d)}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={bdayYear} onValueChange={handleBdayYearChange}>
                <SelectTrigger className="h-12 flex-1 text-center">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                    {Array.from({ length: 2013 - 1940 + 1 }, (_, i) => 2013 - i).map(y => (
                      <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                    ))}
                  </SelectContent>
              </Select>
            </div>
            {bdayConfirmation && (
              <p className="text-xs text-primary font-medium">{t('onboarding.demographics.birthdayConfirm')} {bdayConfirmation}</p>
            )}
          </div>

          {/* Height */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">{t('onboarding.demographics.height')}</label>
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => handleHeightUnitChange('imperial')}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${values.heightUnit === 'imperial' ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-secondary'}`}
              >
                ft / in
              </button>
              <button
                type="button"
                onClick={() => handleHeightUnitChange('metric')}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${values.heightUnit === 'metric' ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-secondary'}`}
              >
                cm
              </button>
            </div>
            {values.heightUnit === 'imperial' ? (
              <div className="flex gap-2">
                <Select value={String(Math.floor(parseFloat(values.height_inches) / 12) || '')} onValueChange={(ft) => {
                  const in_val = parseFloat(values.height_inches) % 12 || 0;
                  const total = parseInt(ft) * 12 + in_val;
                  setValues(v => ({ ...v, height_inches: total.toString(), height_cm: convertHeight(total.toString(), 'imperial', 'metric') }));
                }}>
                  <SelectTrigger className="h-12 flex-1 text-center">
                    <SelectValue placeholder="Feet" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 9 }, (_, i) => i).map(ft => (
                      <SelectItem key={ft} value={String(ft)}>{ft}'</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={String(Math.round(parseFloat(values.height_inches) % 12) || '')} onValueChange={(inches) => {
                  const ft = Math.floor(parseFloat(values.height_inches) / 12) || 0;
                  const total = ft * 12 + parseInt(inches);
                  setValues(v => ({ ...v, height_inches: total.toString(), height_cm: convertHeight(total.toString(), 'imperial', 'metric') }));
                }}>
                  <SelectTrigger className="h-12 flex-1 text-center">
                    <SelectValue placeholder="Inches" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i).map(in_val => (
                      <SelectItem key={in_val} value={String(in_val)}>{in_val}"</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <Select value={values.height_cm} onValueChange={(cm) => {
                setValues(v => ({ ...v, height_cm: cm, height_inches: convertHeight(cm, 'metric', 'imperial') }));
              }}>
                <SelectTrigger className="h-12 text-center">
                  <SelectValue placeholder="Height in cm" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 151 }, (_, i) => 100 + i).map(cm => (
                    <SelectItem key={cm} value={String(cm)}>{cm} cm</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Weight */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">{t('onboarding.demographics.weight')}</label>
            <div className="flex gap-2 mb-3 flex-wrap">
              {['lbs', 'kg', 'stone'].map(unit => (
                <button
                  key={unit}
                  type="button"
                  onClick={() => handleWeightUnitChange(unit)}
                  className={`px-3 py-2 text-xs font-medium rounded-md transition-colors ${values.weightUnit === unit ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-secondary'}`}
                >
                  {unit}
                </button>
              ))}
            </div>
            <div className="relative">
              <Input
                type="number"
                placeholder={weightPlaceholder}
                value={
                  values.weightUnit === 'lbs' ? values.weight_lbs :
                  values.weightUnit === 'kg' ? values.weight_kg :
                  values.weight_stone
                }
                onChange={e => {
                  const raw = e.target.value;
                  if (raw === '') {
                    setValues(v => ({ ...v, weight_lbs: '', weight_kg: '', weight_stone: '' }));
                    return;
                  }
                  const key = values.weightUnit === 'lbs' ? 'weight_lbs' : values.weightUnit === 'kg' ? 'weight_kg' : 'weight_stone';
                  setValues(v => ({ ...v, [key]: raw }));
                }}
                onKeyDown={e => { if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault(); }}
                className="h-12 text-center pr-12"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">{values.weightUnit}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-center">
              {values.weightUnit === 'lbs' && t('onboarding.demographics.weightRangeLbs')}
              {values.weightUnit === 'kg' && t('onboarding.demographics.weightRangeKg')}
              {values.weightUnit === 'stone' && t('onboarding.demographics.weightRangeStone')}
            </p>
          </div>
        </div>

        <Button
          className="w-full h-12 font-heading font-bold text-base mt-6"
          onClick={handleNext}
          disabled={!isComplete || saving}
        >
          {t('common.next')} <ArrowRight className="w-5 h-5 ml-1" />
        </Button>
      </div>

      <ProfanityWarningDialog
        open={profanityOpen}
        onContinue={() => {
          setValues(v => ({ ...v, username: '' }));
          setProfanityOpen(false);
        }}
      />
    </motion.div>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoadingAuth, checkUserAuth } = useAuth();
  const { setWeightUnit } = useWeightUnit();
  const urlParams = new URLSearchParams(window.location.search);
  const urlStep = urlParams.get('step');

  const initialScreen = urlStep || (isAuthenticated ? 'demographics' : 'welcome');
  const [screen, setScreen] = useState(initialScreen);
  const [saving, setSaving] = useState(false);
  // Holds demographics payload while waiting on location step
  const [demographicsData, setDemographicsData] = useState(null);

  useEffect(() => {
    if (isAuthenticated && (screen === 'welcome' || screen === 'create-account')) {
      setScreen('demographics');
    }
  }, [isAuthenticated, screen]);

  const handleDemographicsNext = (data) => {
    setDemographicsData(data);
    setScreen('location');
  };

  const handleLocationNext = async ({ country_code, state_code }) => {
    setSaving(true);
    try {
      await base44.auth.updateMe({
        ...demographicsData,
        country_code,
        state_code: state_code || null,
        onboarding_complete: true,
      });
      setWeightUnit(demographicsData.weight_unit);
      markReturningUser();
      if (checkUserAuth) await checkUserAuth();
      setSaving(false);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Onboarding submit failed:', err);
      // Still navigate to dashboard even if the profile save fails
      // (e.g. CORS from a preview deployment). User can update profile later.
      markReturningUser();
      setSaving(false);
      // Only show the error in production — on localhost it's just a CORS dev quirk
      if (import.meta.env.PROD) {
        toast.error('Profile save failed — you can update it later in Settings.');
      }
      navigate('/dashboard', { replace: true });
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {screen === 'welcome' && (
        <WelcomeScreen onGetStarted={() => setScreen('create-account')} />
      )}
      {screen === 'create-account' && (
        <CreateAccountScreen onNext={() => setScreen('demographics')} />
      )}
      {screen === 'demographics' && (
        <DemographicsStep saving={saving} onNext={handleDemographicsNext} />
      )}
      {screen === 'location' && (
        <LocationStep onNext={handleLocationNext} />
      )}
    </AnimatePresence>
  );
}