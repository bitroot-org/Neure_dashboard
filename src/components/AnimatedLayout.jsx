import React from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './PageTransition';

const AnimatedLayout = ({ children }) => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        {children}
      </PageTransition>
    </AnimatePresence>
  );
};

export default AnimatedLayout;