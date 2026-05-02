import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { calculateDailyValues } from '@/lib/nutritionDefaults';
import { useLanguage } from '@/lib/LanguageContext';

const MACROS = [
  { key: 'calories',       labelKey: 'nutrition.macros.calories',    unit: 'kcal', color: 'from-orange-400 to-orange-600', textColor: 'text-orange-600', bgColor: 'bg-orange-50 dark:bg-orange-950/20' },
  { key: 'protein_g',      labelKey: 'nutrition.macros.protein',     unit: 'g',    color: 'from-red-400 to-red-600',       textColor: 'text-red-600',    bgColor: 'bg-red-50 dark:bg-red-950/20' },
  { key: 'carbs_g',        labelKey: 'nutrition.macros.carbs',       unit: 'g',    color: 'from-blue-400 to-blue-600',     textColor: 'text-blue-600',   bgColor: 'bg-blue-50 dark:bg-blue-950/20' },
  { key: 'fat_g',          labelKey: 'nutrition.macros.fat',         unit: 'g',    color: 'from-yellow-400 to-yellow-600', textColor: 'text-yellow-600', bgColor: 'bg-yellow-50 dark:bg-yellow-950/20' },
  { key: 'sodium_mg',      labelKey: 'nutrition.macros.sodium',      unit: 'mg',   color: 'from-pink-400 to-pink-600',     textColor: 'text-pink-600',   bgColor: 'bg-pink-50 dark:bg-pink-950/20' },
  { key: 'fiber_g',        labelKey: 'nutrition.macros.fiber',       unit: 'g',    color: 'from-green-400 to-green-600',   textColor: 'text-green-600',  bgColor: 'bg-green-50 dark:bg-green-950/20' },
  { key: 'sugar_g',        labelKey: 'nutrition.macros.sugar',       unit: 'g',    color: 'from-purple-400 to-purple-600', textColor: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-950/20' },
  { key: 'cholesterol_mg', labelKey: 'nutrition.macros.cholesterol', unit: 'mg',   color: 'from-cyan-400 to-cyan-600',     textColor: 'text-cyan-600',   bgColor: 'bg-cyan-50 dark:bg-cyan-950/20' },
];

export default function MacroNutrientBox({ entries = [], userProfile = {} }) {
  const { t } = useLanguage();
  const totals = useMemo(() => {
    return entries.reduce(
      (acc, entry) => ({
        calories: acc.calories + (entry.calories || 0),
        protein_g: acc.protein_g + (entry.protein_g || 0),
        carbs_g: acc.carbs_g + (entry.carbs_g || 0),
        fat_g: acc.fat_g + (entry.fat_g || 0),
        sodium_mg: acc.sodium_mg + (entry.sodium_mg || 0),
        fiber_g: acc.fiber_g + (entry.fiber_g || 0),
        sugar_g: acc.sugar_g + (entry.sugar_g || 0),
        cholesterol_mg: acc.cholesterol_mg + (entry.cholesterol_mg || 0),
      }),
      {
        calories: 0,
        protein_g: 0,
        carbs_g: 0,
        fat_g: 0,
        sodium_mg: 0,
        fiber_g: 0,
        sugar_g: 0,
        cholesterol_mg: 0,
      }
    );
  }, [entries]);

  const dailyValues = useMemo(() => calculateDailyValues(userProfile), [userProfile]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Card className="p-4 border-none shadow-sm">
      <h3 className="font-heading font-bold mb-3">{t('nutrition.nutritionalValues')}</h3>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {MACROS.map(macro => {
          const actual = totals[macro.key];
          const daily = dailyValues[macro.key] || 100;
          const percentOfDaily = Math.min((actual / daily) * 100, 100);

          return (
            <motion.div key={macro.key} variants={itemVariants}>
              <div className={`${macro.bgColor} rounded-lg p-3 h-full`}>
                <p className="text-xs text-muted-foreground mb-1 truncate">{t(macro.labelKey)}</p>
                <p className={`font-heading font-bold text-lg ${macro.textColor}`}>
                  {actual.toFixed(macro.key === 'calories' ? 0 : 1)}{macro.unit}
                </p>
                <p className="text-xs text-muted-foreground mt-1 mb-2">{Math.round(percentOfDaily)}% {t('nutrition.macros.dv')}</p>
                <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${macro.textColor.replace('text-', 'bg-')}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentOfDaily}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </Card>
  );
}