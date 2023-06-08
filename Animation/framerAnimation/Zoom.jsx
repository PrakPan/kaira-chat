import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
const Zoom = ({ children, isActive }) => {
  return (
    <AnimatePresence className="absolute z-30">
      {isActive && (
        <motion.div
          className="absolute z-30"
          exit={{
            opacity: 0,
            scale: 0,
          }}
          initial={{
            opacity: 0,
            scale: 0.4,
          }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Zoom;
