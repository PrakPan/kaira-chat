import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingButton = ({
  isVisible,
  setIsVisible,
  buttonLabel,
  duration,
  backgroundColor,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleButtonClick = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div style={{ position: 'fixed', right: 20, bottom: 20 }}>
      <button onClick={handleButtonClick}>{buttonLabel}</button>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'absolute',
              width: 50,
              height: 50,
              backgroundColor: backgroundColor || 'red',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingButton;
