import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'critical' | 'high' | 'medium' | 'low' | 'info' | 'success';
  className?: string;
}

export function Badge({ children, variant = 'info', className = '' }: BadgeProps) {
  const variants = {
    critical: 'text-terminal-red border-terminal-red/40 bg-terminal-red/5 text-shadow-red',
    high: 'text-neon-orange border-neon-orange/40 bg-neon-orange/5 text-shadow-neon',
    medium: 'text-terminal-yellow border-terminal-yellow/40 bg-terminal-yellow/5',
    low: 'text-terminal-blue border-terminal-blue/40 bg-terminal-blue/5',
    info: 'text-terminal-dim border-terminal-dim/30 bg-terminal-dim/5',
    success: 'text-terminal-green border-terminal-green/40 bg-terminal-green/5 text-shadow-green',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-mono font-semibold uppercase tracking-wider border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
