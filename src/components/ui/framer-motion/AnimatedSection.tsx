// components/AnimatedSection.tsx
import React, { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AnimatedSectionProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  className?: string;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  delay = 0,
  direction = 'up',
  duration = 0.5,
  className = ''
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: 50, opacity: 0 };
      case 'down': return { y: -50, opacity: 0 };
      case 'left': return { x: -50, opacity: 0 };
      case 'right': return { x: 50, opacity: 0 };
      case 'none': return { opacity: 0 };
      default: return { y: 50, opacity: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={{ y: 0, x: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;