import { InputHTMLAttributes, forwardRef } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, ...props }, ref) => {
    return (
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            ref={ref}
            type="checkbox"
            className="sr-only peer"
            {...props}
          />
          <div className="w-4 h-4 border border-neon-orange/30 bg-cyber-dark peer-checked:bg-neon-orange/20 peer-checked:border-neon-orange/60 transition-all group-hover:border-neon-orange/50">
            <svg
              className="w-4 h-4 text-neon-orange opacity-0 peer-checked:opacity-100 transition-opacity absolute inset-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        {label && (
          <span className="text-sm font-mono text-neon-orange/60 group-hover:text-neon-orange/80 transition-colors leading-relaxed">
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
