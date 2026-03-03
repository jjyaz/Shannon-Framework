import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-mono text-neon-orange/50 mb-1.5 uppercase tracking-widest">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`w-full px-4 py-2.5 bg-cyber-dark/80 border border-neon-orange/15 text-neon-orange font-mono text-sm focus:outline-none focus:border-neon-orange/40 focus:shadow-neon-sm transition-all appearance-none ${className}`}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-cyber-dark text-neon-orange">
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neon-orange/30 font-mono text-xs">
            v
          </div>
        </div>
        {error && (
          <p className="mt-1 text-xs font-mono text-terminal-red">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
