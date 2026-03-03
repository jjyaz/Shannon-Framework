import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  prefix?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, prefix = '>', className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-mono text-neon-orange/50 mb-1.5 uppercase tracking-widest">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <span className="absolute left-3 text-neon-orange/30 font-mono text-sm pointer-events-none">
            {prefix}
          </span>
          <input
            ref={ref}
            className={`w-full pl-7 pr-4 py-2.5 bg-cyber-dark/80 border border-neon-orange/15 text-neon-orange font-mono text-sm placeholder-neon-orange/20 focus:outline-none focus:border-neon-orange/40 focus:shadow-neon-sm transition-all ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-xs font-mono text-terminal-red">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
