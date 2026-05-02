import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplet, Check } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function WaterTracker({ waterOz = 0, userProfile = {}, waterUnit = 'oz', ozToDisplay = (v) => v }) {
  const { t } = useLanguage();
  // Calculate daily recommendation in oz with IOM formula
  const dailyRecOz = useMemo(() => {
    const weight = userProfile?.weight_lbs;
    const gender = userProfile?.gender || 'male';

    // Derive age from birthday or age field
    let age = 30;
    if (userProfile?.birthday) {
      const birth = new Date(userProfile.birthday);
      const now = new Date();
      age = now.getFullYear() - birth.getFullYear();
      const m = now.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    } else if (userProfile?.age) {
      age = userProfile.age;
    }

    // IOM total water intake baselines (includes water from food ~20%,
    // so multiply by 0.8 to get drinking water portion)
    // Male baseline: 125oz total → ~100oz drinking
    // Female baseline: 91oz total → ~73oz drinking
    let baseOz = gender === 'female' ? 73 : 100;

    // Weight adjustment: IOM assumes ~154 lbs male / 125 lbs female
    // Scale linearly by weight if available
    if (weight) {
      const referenceWeight = gender === 'female' ? 125 : 154;
      const weightFactor = weight / referenceWeight;
      // Cap adjustment to ±30% to avoid extreme values
      const clampedFactor = Math.min(Math.max(weightFactor, 0.7), 1.3);
      baseOz = Math.round(baseOz * clampedFactor);
    }

    // Age adjustment
    if (age < 18) baseOz = Math.round(baseOz * 0.9);
    else if (age > 55) baseOz = Math.round(baseOz * 0.95);

    // Round to nearest 8oz (one glass) for cleaner display
    return Math.round(baseOz / 8) * 8;
  }, [userProfile]);

  // Convert for display
  const displayWaterOz = Math.round(ozToDisplay(waterOz));
  const displayDailyRec = waterUnit === 'ml' 
    ? Math.round(ozToDisplay(dailyRecOz))
    : waterUnit === 'L'
    ? parseFloat((ozToDisplay(dailyRecOz)).toFixed(1))
    : Math.round(ozToDisplay(dailyRecOz));

  const progressPercent = Math.min((waterOz / dailyRecOz) * 100, 100);
  
  // Droplet grid: always exactly 8 droplets
  const TOTAL_DROPLETS = 8;
  const ozPerDroplet = dailyRecOz / TOTAL_DROPLETS;
  const numFilledDroplets = Math.floor(waterOz / ozPerDroplet);
  const partialFillPercent = ((waterOz % ozPerDroplet) / ozPerDroplet) * 100;
  const isGoalReached = progressPercent >= 100;

  // SVG circle progress
  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const isEmpty = waterOz === 0;

  return (
    <div className="space-y-6">
      {/* Main Layout: Two columns on md+, stacked on mobile */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* LEFT: DROPLET GRID */}
        <div>
          <AnimatePresence mode="wait">
            {isEmpty ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex items-center justify-center py-8"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="flex justify-center mb-3"
                  >
                    <Droplet className="w-12 h-12 text-blue-200" />
                  </motion.div>
                  <p className="text-muted-foreground font-medium">{t('nutrition.water.startHydrating')}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t('nutrition.water.logFirst')}</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-4 gap-2"
              >
              {Array.from({ length: TOTAL_DROPLETS }).map((_, idx) => {
                const isFilled = idx < numFilledDroplets;
                const isPartial = idx === numFilledDroplets && partialFillPercent > 0;
                const isJustFilled = isGoalReached;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                      delay: idx * 0.04,
                    }}
                    className="h-12 rounded-xl flex items-center justify-center transition-all relative overflow-hidden"
                  >
                    {/* Background (empty state) */}
                    <div className="absolute inset-0 bg-border/20 border border-dashed border-border/40 rounded-xl" />
                    
                    {/* Filled or partial fill */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl"
                      initial={{ scaleY: 0, opacity: 0 }}
                      animate={{ 
                        scaleY: isFilled ? 1 : isPartial ? partialFillPercent / 100 : 0,
                        opacity: isFilled || isPartial ? 1 : 0
                      }}
                      transition={{ duration: 0.8, ease: 'easeOut', type: 'tween' }}
                      style={{ originY: 1 }}
                    />
                  
                    {/* Icon */}
                    {(isFilled || isPartial) && (
                      <motion.div
                        className="relative z-10"
                        animate={isJustFilled ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.6, repeat: isJustFilled ? Infinity : 0 }}
                      >
                        <Droplet className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT: CIRCULAR RING PROGRESS + STATS */}
        <div className="flex flex-col items-center">
          {/* SVG Circle Ring */}
          <div className="relative mb-4">
            <svg width="120" height="120" viewBox="0 0 120 120">
              {/* Background ring */}
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="10"
              />
              {/* Progress ring */}
              <motion.circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="w-full text-center"
              >
                <p className="font-heading font-bold text-2xl text-foreground">
                  {displayWaterOz}
                </p>
                <p className="text-xs text-muted-foreground">{waterUnit}</p>
                <p className="text-xs text-muted-foreground">
                  {t('nutrition.macros.of')} {displayDailyRec}
                </p>
              </motion.div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2 w-full">
            {[
              { label: t('nutrition.water.today'), value: `${displayWaterOz} ${waterUnit}` },
              { label: t('nutrition.water.daily'), value: `${displayDailyRec} ${waterUnit}` },
              { label: t('progress.title'), value: `${Math.round(progressPercent)}%` },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-secondary/50 rounded-lg px-3 py-2 text-center"
              >
                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                <p className="font-heading font-bold text-sm text-foreground mt-0.5">
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Goal Achieved State */}
      <AnimatePresence>
        {progressPercent >= 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="flex items-center justify-center gap-2 p-4 rounded-lg bg-green-500/10 border border-green-500/30"
          >
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity }}>
              <Check className="w-5 h-5 text-green-600" />
            </motion.div>
            <span className="text-sm font-semibold text-green-700">{t('nutrition.water.goalReached')}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}