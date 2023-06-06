import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  const handleTouchStart = () => {
    setIsVisible(true);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="floating-button"
          onTouchStart={handleTouchStart}
        >
          Floating Button
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default FloatingButton;
