// components/CountUp.tsx (упрощённая версия)
import React, { useEffect, useState, useRef } from 'react';

interface CountUpProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  delay?: number;
  decimals?: number;
}

const CountUp: React.FC<CountUpProps> = ({ 
  end, 
  suffix = '', 
  prefix = '', 
  duration = 2,
  delay = 0,
  decimals = 0 
}) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect(); // Останавливаем наблюдение после запуска
            
          setTimeout(() => {
            let start = 0;
            const step = () => {
              start += end / (duration * 60); // 60fps
              if (start >= end) {
                setCount(end);
                return;
              }
              setCount(Math.min(start, end));
              requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          }, delay * 1000);
        }
      },
      { threshold: 0.3 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration, delay]);

  return (
    <span ref={elementRef}>
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>
  );
};

export default CountUp;