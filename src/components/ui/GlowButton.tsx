import { ButtonHTMLAttributes, ReactNode } from 'react';

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function GlowButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: GlowButtonProps) {
  const base = 'font-mono font-semibold uppercase tracking-wider transition-all duration-200 relative disabled:opacity-30 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-neon-orange/10 text-neon-orange border border-neon-orange/50 hover:bg-neon-orange hover:text-cyber-black hover:shadow-neon-md active:shadow-neon-lg',
    secondary: 'bg-transparent text-neon-orange/60 border border-neon-orange/20 hover:border-neon-orange/50 hover:text-neon-orange hover:shadow-neon-sm',
    danger: 'bg-terminal-red/10 text-terminal-red border border-terminal-red/40 hover:bg-terminal-red/20 hover:shadow-[0_0_20px_rgba(255,51,51,0.3)]',
    ghost: 'bg-transparent text-neon-orange/40 border border-transparent hover:text-neon-orange hover:border-neon-orange/15',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </button>
  );
}
