import { motion } from 'framer-motion';

// Floating particle dots for higher tiers
export default function Particles({ type }) {
  if (type === 'none') return null;

  const dots = type === 'golden'
    ? [
        { x: '10%', y: '20%', size: 3, delay: 0 },
        { x: '80%', y: '15%', size: 2, delay: 0.4 },
        { x: '50%', y: '70%', size: 2, delay: 0.8 },
        { x: '25%', y: '60%', size: 1.5, delay: 1.2 },
        { x: '70%', y: '55%', size: 2, delay: 0.2 },
        { x: '90%', y: '80%', size: 1.5, delay: 0.6 },
      ]
    : type === 'sparkle'
    ? [
        { x: '15%', y: '25%', size: 2, delay: 0 },
        { x: '75%', y: '20%', size: 1.5, delay: 0.5 },
        { x: '55%', y: '65%', size: 2, delay: 0.9 },
        { x: '30%', y: '55%', size: 1.5, delay: 1.3 },
      ]
    : [
        { x: '20%', y: '30%', size: 2.5, delay: 0 },
        { x: '70%', y: '60%', size: 2, delay: 0.6 },
        { x: '85%', y: '25%', size: 2, delay: 1.1 },
      ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-lg">
      {dots.map((dot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/60"
          style={{ left: dot.x, top: dot.y, width: dot.size, height: dot.size }}
          animate={type === 'golden'
            ? { opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5], y: [0, -6, 0] }
            : type === 'sparkle'
            ? { opacity: [0, 1, 0], scale: [0, 1, 0] }
            : { opacity: [0.2, 0.8, 0.2], scale: [1, 1.4, 1] }
          }
          transition={{ duration: type === 'golden' ? 2 : type === 'sparkle' ? 1.5 : 2.5, delay: dot.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}