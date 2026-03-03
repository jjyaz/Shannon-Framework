import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { GlowButton, Input, Checkbox } from '../ui';

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsent: (data: ConsentData) => void;
  targetDomain: string;
}

export interface ConsentData {
  organizationName: string;
  targetDomain: string;
  authorized: boolean;
  termsAccepted: boolean;
}

export function ConsentModal({ isOpen, onClose, onConsent, targetDomain }: ConsentModalProps) {
  const [organizationName, setOrganizationName] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationName || !authorized || !termsAccepted) return;
    onConsent({ organizationName, targetDomain, authorized, termsAccepted });
  };

  const canSubmit = organizationName.trim() && authorized && termsAccepted;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cyber-black/90 backdrop-blur-sm">
      <div className="terminal-panel rounded-sm max-w-xl w-full mx-4 shadow-neon-lg animate-terminal-boot">
        <div className="flex items-center justify-between px-4 py-2 border-b border-neon-orange/10">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-terminal-red" />
            <span className="font-mono text-xs text-terminal-red uppercase tracking-widest font-bold">
              Authorization Required
            </span>
          </div>
          <button onClick={onClose} className="text-neon-orange/20 hover:text-neon-orange/50 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="p-3 border border-terminal-red/15 bg-terminal-red/[0.03]">
            <p className="font-mono text-xs text-terminal-red font-bold uppercase tracking-wider mb-1">
              Legal Warning
            </p>
            <p className="font-mono text-[11px] text-neon-orange/30 leading-relaxed">
              Unauthorized security testing is illegal. You must have explicit written
              authorization before proceeding. All activity is logged for audit compliance.
            </p>
          </div>

          <div className="space-y-3">
            <Input
              label="Organization Name"
              placeholder="Enter your organization"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              required
            />
            <Input
              label="Target Domain"
              value={targetDomain}
              disabled
            />
          </div>

          <div className="space-y-3 border-t border-neon-orange/10 pt-3">
            <Checkbox
              label="I have explicit written authorization from the system owner to test this target."
              checked={authorized}
              onChange={(e) => setAuthorized(e.target.checked)}
            />
            <Checkbox
              label="I accept full legal responsibility and understand unauthorized testing is a criminal offense."
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <GlowButton type="button" variant="secondary" size="sm" onClick={onClose}>
              Abort
            </GlowButton>
            <GlowButton type="submit" size="sm" disabled={!canSubmit}>
              Confirm Authorization
            </GlowButton>
          </div>
        </form>
      </div>
    </div>
  );
}
