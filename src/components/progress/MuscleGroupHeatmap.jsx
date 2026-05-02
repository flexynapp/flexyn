import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

const MUSCLE_GROUPS = [
  'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 
  'Legs', 'Glutes', 'Core', 'Forearms'
];

const MUSCLE_MAP = {
  'Chest': { id: 'chest', intensity: 0 },
  'Back': { id: 'back', intensity: 0 },
  'Shoulders': { id: 'shoulders', intensity: 0 },
  'Biceps': { id: 'biceps', intensity: 0 },
  'Triceps': { id: 'triceps', intensity: 0 },
  'Legs': { id: 'legs', intensity: 0 },
  'Glutes': { id: 'glutes', intensity: 0 },
  'Core': { id: 'core', intensity: 0 },
  'Forearms': { id: 'forearms', intensity: 0 }
};

export default function MuscleGroupHeatmap({ logs }) {
  const { t } = useLanguage();
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [activeView, setActiveView] = useState('front'); // front or back

  // Calculate muscle group intensities
  const intensities = useMemo(() => {
    const map = {};
    Object.keys(MUSCLE_MAP).forEach(g => {
      map[g] = { id: MUSCLE_MAP[g].id, intensity: 0, setsPerWeek: 0, daysSinceLastTrained: null };
    });

    const validLogs = (logs || []).filter(l => l?.date && !isNaN(new Date(l.date).getTime()));
    if (validLogs.length === 0) return map;

    const now = new Date();
    const mostRecentLog = validLogs.reduce((latest, l) => {
      const d = new Date(l.date);
      return (!latest || d > latest) ? d : latest;
    }, null);
    const daysSinceAnyWorkout = Math.floor((now - mostRecentLog) / (1000 * 60 * 60 * 24));
    const GLOBAL_COLD_THRESHOLD = 45;
    if (daysSinceAnyWorkout >= GLOBAL_COLD_THRESHOLD) return map;

    const firstLogDate = validLogs.reduce((earliest, l) => {
      const d = new Date(l.date);
      return (!earliest || d < earliest) ? d : earliest;
    }, null);
    // Minimum 14-day observation window to avoid inflating intensity for brand-new users
    const totalDays = Math.max(14, Math.ceil((now - firstLogDate) / (1000 * 60 * 60 * 24)) + 1);
    const totalWeeks = totalDays / 7;
    // Ramp from 0→100% intensity over the first 28 days of history
    const historyFactor = Math.min(1, totalDays / 28);

    const totalSetsByGroup = {};
    const lastTrainedByGroup = {};
    const sessionCountByGroup = {};
    Object.keys(MUSCLE_MAP).forEach(g => { totalSetsByGroup[g] = 0; lastTrainedByGroup[g] = null; sessionCountByGroup[g] = 0; });

    validLogs.forEach(log => {
      const logDate = new Date(log.date);
      (log.exercises || []).forEach(ex => {
        const setCount = (ex.sets || []).filter(s => (s.weight > 0 || s.reps > 0)).length;
        if (setCount === 0) return;
        const groups = ex.muscle_groups || (ex.muscle_group ? [ex.muscle_group] : []);
        groups.forEach(group => {
          if (totalSetsByGroup[group] != null) {
            totalSetsByGroup[group] += setCount;
            sessionCountByGroup[group] = (sessionCountByGroup[group] || 0) + 1;
            if (!lastTrainedByGroup[group] || logDate > lastTrainedByGroup[group]) {
              lastTrainedByGroup[group] = logDate;
            }
          }
        });
      });
    });

    const freshness = (daysSince) => {
      if (daysSince == null) return 0;
      if (daysSince <= 3) return 1.00;
      if (daysSince <= 7) return 0.95;
      if (daysSince <= 14) return 0.85;
      if (daysSince <= 28) return 0.60;
      if (daysSince <= 45) return 0.30;
      if (daysSince <= 60) return 0.10;
      return 0;
    };

    Object.keys(map).forEach(group => {
      const totalSets = totalSetsByGroup[group];
      const lastDate = lastTrainedByGroup[group];
      if (totalSets === 0 || !lastDate) return;

      const daysSince = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
      const sessionCount = sessionCountByGroup[group] || 1;
      // Cap freshness at 0.5 for a single-session group trained very recently
      let fresh = freshness(daysSince);
      if (daysSince <= 1 && sessionCount === 1) fresh = Math.min(fresh, 0.5);

      const lifetimeSetsPerWeek = totalSets / totalWeeks;
      const effectiveSetsPerWeek = lifetimeSetsPerWeek * fresh * historyFactor;

      map[group].setsPerWeek = Math.round(effectiveSetsPerWeek * 10) / 10;
      map[group].daysSinceLastTrained = daysSince;

      let intensity;
      const s = effectiveSetsPerWeek;
      if (s < 2) intensity = (s / 2) * 15;
      else if (s < 6) intensity = 15 + ((s - 2) / 4) * 25;
      else if (s < 14) intensity = 40 + ((s - 6) / 8) * 25;
      else if (s < 20) intensity = 65 + ((s - 14) / 6) * 20;
      else if (s < 28) intensity = 85 + ((s - 20) / 8) * 15;
      else intensity = 100;

      map[group].intensity = Math.round(Math.min(100, Math.max(0, intensity)));
    });

    return map;
  }, [logs]);

  const getGradientId = (muscleGroup) => `gradient-${muscleGroup.toLowerCase()}`;

  const getColor = (intensity) => {
    if (intensity < 3) return '#a0aec0';   // Untrained — gray
    if (intensity < 25) return '#3b82f6';  // Light — blue
    if (intensity < 55) return '#22c55e';  // Productive — green (sweet spot)
    if (intensity < 75) return '#eab308';  // High volume — yellow
    if (intensity < 90) return '#f97316';  // Overreaching — orange
    return '#ef4444';                       // Overtraining — red
  };

  const isSelected = (muscleGroup) => selectedMuscle === muscleGroup;

  const selectedData = selectedMuscle ? {
    group: selectedMuscle,
    intensity: Math.round(intensities[selectedMuscle]?.intensity || 0),
    setsPerWeek: intensities[selectedMuscle]?.setsPerWeek || 0,
    daysSinceLastTrained: intensities[selectedMuscle]?.daysSinceLastTrained,
    exerciseCount: logs?.reduce((count, log) => {
    return count + (log.exercises?.filter(ex => {
      const groups = ex.muscle_groups || (ex.muscle_group ? [ex.muscle_group] : []);
      return groups.includes(selectedMuscle);
    }).length || 0);
    }, 0) || 0
    } : null;

  return (
    <div className="space-y-4">
      <Card className="p-6 border-none shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-heading font-bold">{t('progress.muscleHeatmap')}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{t('progress.muscleHeatmapDesc')}</p>
          </div>
          <div className="flex gap-1 bg-secondary rounded-lg p-1">
            <button
              onClick={() => setActiveView('front')}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${activeView === 'front' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {t('progress.muscleFront')}
            </button>
            <button
              onClick={() => setActiveView('back')}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${activeView === 'back' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {t('progress.muscleBack')}
            </button>
          </div>
        </div>

        {/* Humanoid SVG */}
        <div className="flex justify-center mb-8 bg-secondary/30 rounded-lg p-6">
          <svg width="140" height="380" viewBox="0 0 140 380" className="max-w-full drop-shadow-sm">
            <defs>
              {MUSCLE_GROUPS.map(group => (
                <linearGradient 
                  key={getGradientId(group)}
                  id={getGradientId(group)} 
                  x1="0%" y1="0%" x2="100%" y2="100%"
                >
                  <stop offset="0%" stopColor={getColor(intensities[group].intensity)} stopOpacity="0.6" />
                  <stop offset="100%" stopColor={getColor(intensities[group].intensity)} stopOpacity="1" />
                </linearGradient>
              ))}
            </defs>

            {activeView === 'front' ? (
              <>
                {/* Head */}
                <circle cx="70" cy="25" r="18" fill="rgba(100, 116, 139, 0.3)" stroke="currentColor" strokeWidth="1.5" />

                {/* Neck */}
                <line x1="70" y1="43" x2="70" y2="55" stroke="currentColor" strokeWidth="2" />

                {/* Shoulders */}
                <path
                  d="M 35 55 Q 35 65 50 75 L 90 75 Q 105 65 105 55"
                  fill={isSelected('Shoulders') ? `url(#${getGradientId('Shoulders')})` : `rgba(${getColor('Shoulders').match(/\d+/g).join(',')}, 0.5)`}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                  onClick={() => setSelectedMuscle('Shoulders')}
                />

                {/* Chest */}
                <path
                  d="M 50 75 L 50 155 Q 50 160 55 160 L 60 160 L 60 80 L 80 80 L 80 160 L 85 160 Q 90 160 90 155 L 90 75"
                  fill={isSelected('Chest') ? `url(#${getGradientId('Chest')})` : `rgba(${getColor('Chest').match(/\d+/g).join(',')}, 0.5)`}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                  onClick={() => setSelectedMuscle('Chest')}
                />

                {/* Abs/Core */}
                <path
                  d="M 55 160 L 85 160 L 85 200 Q 85 205 80 205 L 60 205 Q 55 205 55 200 Z"
                  fill={isSelected('Core') ? `url(#${getGradientId('Core')})` : `rgba(${getColor('Core').match(/\d+/g).join(',')}, 0.5)`}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                  onClick={() => setSelectedMuscle('Core')}
                />

                {/* Left Bicep */}
                <path
                  d="M 50 75 Q 40 95 35 125 L 45 130 Q 48 100 55 80 Z"
                  fill={isSelected('Biceps') ? `url(#${getGradientId('Biceps')})` : `rgba(${getColor('Biceps').match(/\d+/g).join(',')}, 0.5)`}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                  onClick={() => setSelectedMuscle('Biceps')}
                />

                {/* Right Bicep */}
                <path
                  d="M 90 75 Q 100 95 105 125 L 95 130 Q 92 100 85 80 Z"
                  fill={isSelected('Biceps') ? `url(#${getGradientId('Biceps')})` : `rgba(${getColor('Biceps').match(/\d+/g).join(',')}, 0.5)`}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                  onClick={() => setSelectedMuscle('Biceps')}
                />

                {/* Left Forearm */}
                <path
                  d="M 35 125 L 30 170 L 42 172 L 45 130 Z"
                  fill={isSelected('Forearms') ? `url(#${getGradientId('Forearms')})` : `rgba(${getColor('Forearms').match(/\d+/g).join(',')}, 0.5)`}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                  onClick={() => setSelectedMuscle('Forearms')}
                />

                {/* Right Forearm */}
                <path
                  d="M 105 125 L 110 170 L 98 172 L 95 130 Z"
                  fill={isSelected('Forearms') ? `url(#${getGradientId('Forearms')})` : `rgba(${getColor('Forearms').match(/\d+/g).join(',')}, 0.5)`}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                  onClick={() => setSelectedMuscle('Forearms')}
                />

                {/* Left Leg (Quadriceps) */}
                <path
                  d="M 55 205 L 50 310 Q 50 315 55 315 L 70 315 L 70 205 Z"
                  fill={isSelected('Legs') ? `url(#${getGradientId('Legs')})` : `rgba(${getColor('Legs').match(/\d+/g).join(',')}, 0.5)`}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                  onClick={() => setSelectedMuscle('Legs')}
                />

                {/* Right Leg (Quadriceps) */}
                <path
                  d="M 85 205 L 90 310 Q 90 315 85 315 L 70 315 L 70 205 Z"
                  fill={isSelected('Legs') ? `url(#${getGradientId('Legs')})` : `rgba(${getColor('Legs').match(/\d+/g).join(',')}, 0.5)`}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                  onClick={() => setSelectedMuscle('Legs')}
                />

                {/* Left Foot */}
                <path d="M 50 315 L 45 330 Q 48 335 55 335 L 65 335 L 70 315 Z" fill="rgba(100, 116, 139, 0.3)" stroke="currentColor" strokeWidth="1.5" />

                {/* Right Foot */}
                <path d="M 90 315 L 95 330 Q 92 335 85 335 L 75 335 L 70 315 Z" fill="rgba(100, 116, 139, 0.3)" stroke="currentColor" strokeWidth="1.5" />

                {/* Glutes */}
                <ellipse
                  cx="70" cy="195"
                  rx="22" ry="16"
                  fill={isSelected('Glutes') ? `url(#${getGradientId('Glutes')})` : `rgba(${getColor('Glutes').match(/\d+/g).join(',')}, 0.5)`}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                  onClick={() => setSelectedMuscle('Glutes')}
                />
              </>
            ) : (
              <>
                {/* Back View */}
                {/* Head */}
                <circle cx="70" cy="25" r="18" fill="rgba(100, 116, 139, 0.3)" stroke="currentColor" strokeWidth="1.5" />

                {/* Neck */}
                <line x1="70" y1="43" x2="70" y2="55" stroke="currentColor" strokeWidth="2" />

                {/* Shoulders */}
                <path
                  d="M 35 55 Q 35 65 50 75 L 90 75 Q 105 65 105 55"
                  fill={isSelected('Shoulders') ? `url(#${getGradientId('Shoulders')})` : `rgba(${getColor('Shoulders').match(/\d+/g).join(',')}, 0.5)`}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                  onClick={() => setSelectedMuscle('Shoulders')}
                />

                {/* Back/Lats */}
                <path
                  d="M 50 75 L 45 160 Q 45 165 50 165 L 60 165 L 60 80 L 80 80 L 80 165 L 90 165 Q 95 165 95 160 L 90 75"
                  fill={isSelected('Back') ? `url(#${getGradientId('Back')})` : `rgba(${getColor('Back').match(/\d+/g).join(',')}, 0.5)`}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                  onClick={() => setSelectedMuscle('Back')}
                />

                {/* Left Tricep */}
                <path
                  d="M 50 75 Q 40 95 35 125 L 45 130 Q 48 100 55 80 Z"
                  fill={isSelected('Triceps') ? `url(#${getGradientId('Triceps')})` : `rgba(${getColor('Triceps').match(/\d+/g).join(',')}, 0.5)`}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                  onClick={() => setSelectedMuscle('Triceps')}
                />

                {/* Right Tricep */}
                <path
                  d="M 90 75 Q 100 95 105 125 L 95 130 Q 92 100 85 80 Z"
                  fill={isSelected('Triceps') ? `url(#${getGradientId('Triceps')})` : `rgba(${getColor('Triceps').match(/\d+/g).join(',')}, 0.5)`}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                  onClick={() => setSelectedMuscle('Triceps')}
                />

                {/* Left Hamstring */}
                <path
                  d="M 55 165 L 50 310 Q 50 315 55 315 L 70 315 L 70 165 Z"
                  fill={isSelected('Legs') ? `url(#${getGradientId('Legs')})` : `rgba(${getColor('Legs').match(/\d+/g).join(',')}, 0.5)`}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                  onClick={() => setSelectedMuscle('Legs')}
                />

                {/* Right Hamstring */}
                <path
                  d="M 85 165 L 90 310 Q 90 315 85 315 L 70 315 L 70 165 Z"
                  fill={isSelected('Legs') ? `url(#${getGradientId('Legs')})` : `rgba(${getColor('Legs').match(/\d+/g).join(',')}, 0.5)`}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                  onClick={() => setSelectedMuscle('Legs')}
                />

                {/* Glutes */}
                <ellipse
                  cx="70" cy="155"
                  rx="22" ry="16"
                  fill={isSelected('Glutes') ? `url(#${getGradientId('Glutes')})` : `rgba(${getColor('Glutes').match(/\d+/g).join(',')}, 0.5)`}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                  onClick={() => setSelectedMuscle('Glutes')}
                />

                {/* Left Foot */}
                <path d="M 50 315 L 45 330 Q 48 335 55 335 L 65 335 L 70 315 Z" fill="rgba(100, 116, 139, 0.3)" stroke="currentColor" strokeWidth="1.5" />

                {/* Right Foot */}
                <path d="M 90 315 L 95 330 Q 92 335 85 335 L 75 335 L 70 315 Z" fill="rgba(100, 116, 139, 0.3)" stroke="currentColor" strokeWidth="1.5" />

                {/* Core (lower back) */}
                <path
                  d="M 55 165 L 85 165 L 85 200 Q 85 205 80 205 L 60 205 Q 55 205 55 200 Z"
                  fill={isSelected('Core') ? `url(#${getGradientId('Core')})` : `rgba(${getColor('Core').match(/\d+/g).join(',')}, 0.5)`}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                  onClick={() => setSelectedMuscle('Core')}
                />
              </>
            )}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 justify-center mb-6 text-xs">
          {[
            { label: 'Untrained', color: '#a0aec0' },
            { label: 'Light', color: '#3b82f6' },
            { label: 'Productive', color: '#22c55e' },
            { label: 'High volume', color: '#eab308' },
            { label: 'Overreaching', color: '#f97316' },
            { label: 'Overtraining', color: '#ef4444' }
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
              <span className="text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Muscle Groups Selection Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {MUSCLE_GROUPS.map(group => (
            <button
              key={group}
              onClick={() => setSelectedMuscle(selectedMuscle === group ? null : group)}
              className={`text-xs px-2.5 py-2 rounded-lg border transition-all font-medium ${
                selectedMuscle === group
                  ? 'bg-primary text-primary-foreground border-primary shadow-md'
                  : 'bg-secondary text-secondary-foreground border-border hover:border-primary/50 hover:bg-secondary/80'
              }`}
            >
              {group}
            </button>
          ))}
        </div>
      </Card>

      {/* Selected Muscle Details */}
      {selectedData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-4 border-primary/30 border-2 bg-primary/5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-heading font-bold text-lg">{selectedData.group}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedData.exerciseCount} {selectedData.exerciseCount === 1 ? 'exercise' : 'exercises'} logged
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedMuscle(null)} className="h-6 w-6">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('progress.focusIntensity')}</span>
                <span className="text-lg font-heading font-bold text-primary">{selectedData.intensity}%</span>
              </div>
              <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${selectedData.intensity}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-primary via-accent to-chart-3"
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-medium">{t('progress.avgSetsPerWeek')}</span>
                <span className="text-lg font-heading font-bold text-accent">{selectedData.setsPerWeek}</span>
              </div>
              {selectedData.daysSinceLastTrained != null && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-medium">{t('progress.lastTrained')}</span>
                  <span className="text-lg font-heading font-bold text-accent">{selectedData.daysSinceLastTrained === 0 ? t('progress.today') : selectedData.daysSinceLastTrained === 1 ? t('progress.yesterday') : `${selectedData.daysSinceLastTrained} ${t('widgets.days')} ${t('progress.ago')}`}</span>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}