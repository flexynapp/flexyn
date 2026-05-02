import { motion } from 'framer-motion';

export default function GoalProgressBar({ progress, animated = true, complete = false }) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const barColor = complete ? 'bg-green-500' : 'bg-primary';

  return (
    <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${barColor}`}
        initial={animated ? { width: '0%' } : { width: `${clampedProgress}%` }}
        animate={{ width: `${clampedProgress}%` }}
        transition={animated ? { duration: 0.8, ease: 'easeOut' } : { duration: 0 }}
      />
      {clampedProgress >= 100 && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
          animate={{ x: ['100%', '-100%'] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </div>
  );
}