import { ReactNode } from 'react';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  onClick?: () => void;
}

export function GlowCard({ children, className = '', title, onClick }: GlowCardProps) {
  const clickable = onClick ? 'cursor-pointer hover:border-neon-orange/30' : '';

  return (
    <div
      className={`terminal-panel rounded-sm ${clickable} ${className}`}
      onClick={onClick}
    >
      {title && (
        <div className="terminal-header">
          {title}
        </div>
      )}
      <div className="terminal-body">
        {children}
      </div>
    </div>
  );
}
