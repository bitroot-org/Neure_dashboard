import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.3,
        ease: "easeInOut"
      }}
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative'
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;