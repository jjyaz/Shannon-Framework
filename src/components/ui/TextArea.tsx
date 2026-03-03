import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-mono text-neon-orange/50 mb-1.5 uppercase tracking-widest">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full px-4 py-2.5 bg-cyber-dark/80 border border-neon-orange/15 text-neon-orange font-mono text-sm placeholder-neon-orange/20 focus:outline-none focus:border-neon-orange/40 focus:shadow-neon-sm transition-all resize-y ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs font-mono text-terminal-red">{error}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
