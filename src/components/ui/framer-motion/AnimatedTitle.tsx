// components/AnimatedTitle.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedTitleProps {
  text: string;
  className?: string;
  delay?: number;
}

const AnimatedTitle: React.FC<AnimatedTitleProps> = ({ 
  text, 
  className = '', 
  delay = 0 
}) => {
  const letters = text.split('');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: delay }
    })
  };

  const child = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 20 }
  };

  return (
    <motion.h2
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={child}
          style={{ display: 'inline-block' }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.h2>
  );
};

export default AnimatedTitle;