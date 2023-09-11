import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Slide = ({
  children,
  isActive,

  duration = 1,
  direction = 1,
  xdistance = 0,
  ydistance = 0,
  hideTime = null,
  onUnmount,
}) => {
  const [isMounted, setIsMounted] = React.useState(true);
  useEffect(() => {
    if (hideTime !== null && onUnmount !== null && isActive === true) {
      const timeout = setTimeout(() => {
        setIsMounted(false);
        onUnmountComponent();
      }, hideTime * 1000);
      return () => clearTimeout(timeout);
    }
  }, [hideTime, onUnmount]);
  const onUnmountComponent = () => {
    const timeout = setTimeout(() => {
      onUnmount();
    }, 1000);
    return () => clearTimeout(timeout);
  };
  return (
    <AnimatePresence>
      {isMounted && isActive && (
        <motion.div
          exit={{
            opacity: 0,
            transition: { duration: duration },
            x: direction * -(xdistance * 1),
            y: direction * -(ydistance * 1),
          }}
          initial={{
            opacity: 0,
            transition: { duration: duration },
            x: direction * xdistance,
            y: direction * ydistance,
          }}
          animate={{ opacity: 1, x: 0, y: 0 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Slide;
