// components/UniversalAnimated.tsx
import React, { type ReactNode, useRef, useEffect, useState } from 'react';
import { motion, useInView, type Variants, useAnimation } from 'framer-motion';

interface UniversalAnimatedProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  type?: 'scroll' | 'onload' | 'both' | 'hover';
  once?: boolean;
  amount?: number;
  staggerChildren?: number;
  customStyles?: React.CSSProperties;
  // Дополнительные параметры
  scale?: number; // эффект масштабирования
  rotate?: number; // эффект вращения
  blur?: boolean; // эффект размытия
  onAnimationComplete?: () => void;
}

const UniversalAnimated: React.FC<UniversalAnimatedProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  direction = 'up',
  type = 'scroll',
  once = true,
  amount = 0.2,
  staggerChildren,
  customStyles,
  scale = 1,
  rotate = 0,
  blur = false,
  onAnimationComplete
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });
  const controls = useAnimation();
  const [isHovered, setIsHovered] = useState(false);

  // Базовое начальное состояние
  const getInitialState = () => {
    const initial: any = { opacity: 0 };
    
    if (direction === 'up') initial.y = 50;
    if (direction === 'down') initial.y = -50;
    if (direction === 'left') initial.x = -50;
    if (direction === 'right') initial.x = 50;
    if (scale !== 1) initial.scale = scale;
    if (rotate !== 0) initial.rotate = rotate;
    if (blur) initial.filter = 'blur(10px)';
    
    return initial;
  };

  // Конечное состояние
  const getFinalState = () => {
    const final: any = { 
      opacity: 1, 
      x: 0, 
      y: 0,
      scale: 1,
      rotate: 0,
      transition: { 
        duration, 
        delay,
        staggerChildren: staggerChildren,
        delayChildren: delay,
        ease: "easeOut"
      }
    };
    
    if (blur) final.filter = 'blur(0px)';
    
    return final;
  };

  // Определяем когда запускать анимацию
  useEffect(() => {
    if (type === 'onload') {
      controls.start(getFinalState());
    } else if (type === 'scroll' && isInView) {
      controls.start(getFinalState());
    } else if (type === 'both' && (isInView || true)) {
      controls.start(getFinalState());
    }
  }, [isInView, type, controls]);

  // Для hover типа
  const handleHoverStart = () => {
    if (type === 'hover' && !isHovered) {
      setIsHovered(true);
      controls.start(getFinalState());
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={customStyles}
      initial={getInitialState()}
      animate={controls}
      onHoverStart={type === 'hover' ? handleHoverStart : undefined}
      onAnimationComplete={onAnimationComplete}
      
    >
      {children}
    </motion.div>
  );
};

export default UniversalAnimated;