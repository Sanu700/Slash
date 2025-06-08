import { useState, useEffect, useRef } from 'react';
import { useInView } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  value: string;
  className?: string;
}

const AnimatedCounter = ({ value, className }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      // Handle decimal numbers by preserving the decimal part
      const isDecimal = value.includes('.');
      const targetValue = isDecimal 
        ? parseFloat(value.replace(/[^0-9.]/g, ''))
        : parseInt(value.replace(/[^0-9]/g, ''));
      const duration = 2000; // 2 seconds
      const steps = 60; // 60fps
      const increment = targetValue / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        const currentValue = Math.min(increment * currentStep, targetValue);
        setCount(isDecimal ? Number(currentValue.toFixed(1)) : Math.floor(currentValue));

        if (currentStep >= steps) {
          clearInterval(interval);
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }
  }, [isInView, value]);

  // Format the number with the original suffix (e.g., "+", "%")
  const suffix = value.replace(/[0-9.]/g, '');
  const displayValue = `${count}${suffix}`;

  return (
    <div ref={ref} className={cn("transition-all duration-700", className)}>
      {displayValue}
    </div>
  );
};

export default AnimatedCounter; 