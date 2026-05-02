import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export default function AnimatedRoutes({ children }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, pointerEvents: 'none' }}
        transition={{ duration: 0.18, ease: 'easeInOut' }}
        style={{ minHeight: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}