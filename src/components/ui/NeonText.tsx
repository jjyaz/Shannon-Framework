import { ReactNode } from 'react';

interface NeonTextProps {
  children: ReactNode;
  className?: string;
  glow?: 'normal' | 'strong' | 'none';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
}

export function NeonText({
  children,
  className = '',
  glow = 'normal',
  as: Component = 'p'
}: NeonTextProps) {
  const glowMap = {
    normal: 'text-shadow-neon',
    strong: 'text-shadow-neon-strong',
    none: '',
  };

  return (
    <Component className={`text-neon-orange font-mono ${glowMap[glow]} ${className}`}>
      {children}
    </Component>
  );
}
