import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import './PageTransition.css';

const PageTransition = ({ children, transitionDuration = 800 }) => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState(location);
  const [transitionState, setTransitionState] = useState('entered');
  const [currentChildren, setCurrentChildren] = useState(children);
  const [nextChildren, setNextChildren] = useState(null);
  const timeoutRef = useRef(null);

  // This function handles the entire transition sequence
  const startTransition = useCallback(() => {
    // 1. Start exit animation
    setTransitionState('exiting');

    // 2. After exit animation completes, the onAnimationEnd handler will fire
  }, []);

  // Handle location changes
  useEffect(() => {
    // Skip on initial render
    if (location === prevLocation) return;

    // Store the next children but don't render them yet
    setNextChildren(children);

    // Start the transition sequence
    startTransition();

    // Update prev location for next comparison
    setPrevLocation(location);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, startTransition]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Handle animation end events
  const handleAnimationEnd = () => {
    if (transitionState === 'exiting') {
      // Exit animation completed, now switch to the new children
      setCurrentChildren(nextChildren);
      setNextChildren(null);

      // Start the enter animation after a tiny delay to ensure DOM updates
      timeoutRef.current = setTimeout(() => {
        setTransitionState('entering');
      }, 20);
    }
    else if (transitionState === 'entering') {
      // Enter animation completed, we're done
      setTransitionState('entered');
    }
  };

  return (
    <div
      className={`page-transition state-${transitionState}`}
      onAnimationEnd={handleAnimationEnd}
      style={{
        '--transition-duration': `${transitionDuration}ms`
      }}
    >
      {currentChildren}
    </div>
  );
};

export default PageTransition;
