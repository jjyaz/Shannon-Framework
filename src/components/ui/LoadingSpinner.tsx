import { useEffect, useState } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const FRAMES = ['|', '/', '-', '\\'];

export function LoadingSpinner({ size = 'md', className = '', text }: LoadingSpinnerProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % FRAMES.length);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  const sizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-3 font-mono text-neon-orange ${className}`}>
      <span className={`${sizes[size]} text-shadow-neon`}>{FRAMES[frame]}</span>
      {text && <span className="text-sm text-neon-orange/60">{text}</span>}
    </div>
  );
}
