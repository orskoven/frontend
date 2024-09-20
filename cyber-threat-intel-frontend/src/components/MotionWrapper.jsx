import React from 'react';
import { motion } from 'framer-motion';

const MotionWrapper = ({ children, variants, initial, animate, exit }) => {
  return (
    <motion.div
      variants={variants}
      initial={initial}
      animate={animate}
      exit={exit}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
};

export default MotionWrapper;
