import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

export const StatCounter = ({ value, prefix = '', suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = parseInt(value, 10);
    if (isNaN(end)) {
      setCount(value);
      return;
    }

    const totalSteps = 60;
    const increment = end / totalSteps;
    const stepTime = duration / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  const formattedCount = typeof count === 'number' && count > 999 
    ? count.toLocaleString('fr-FR') 
    : count;

  return (
    <span ref={ref} className="font-serif font-bold">
      {prefix}{formattedCount}{suffix}
    </span>
  );
};
