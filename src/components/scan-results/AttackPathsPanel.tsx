import { ChevronRight } from 'lucide-react';
import { Badge } from '../ui';
import type { AttackPath } from '../../types';

interface AttackPathsPanelProps {
  paths: AttackPath[];
}

const STEP_COLORS: Record<string, string> = {
  target: 'border-terminal-blue/30 bg-terminal-blue/[0.05] text-terminal-blue/70',
  discovery: 'border-terminal-yellow/30 bg-terminal-yellow/[0.05] text-terminal-yellow/70',
  vulnerability: 'border-neon-orange/30 bg-neon-orange/[0.05] text-neon-orange/70',
  exploit: 'border-terminal-red/30 bg-terminal-red/[0.05] text-terminal-red/70',
  impact: 'border-terminal-red/40 bg-terminal-red/[0.08] text-terminal-red/80',
};

export function AttackPathsPanel({ paths }: AttackPathsPanelProps) {
  if (paths.length === 0) return null;

  return (
    <div className="terminal-panel rounded-sm">
      <div className="terminal-header">
        Attack Chains
        <span className="ml-auto text-neon-orange/30 font-normal">{paths.length} identified</span>
      </div>
      <div className="p-4 space-y-4">
        {paths.map((path) => (
          <div key={path.id} className="border border-neon-orange/10 p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-mono text-xs font-bold text-neon-orange uppercase tracking-wide">
                {path.chain_name}
              </h4>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-neon-orange/30">
                  exploit: {Math.round(path.exploitability * 100)}%
                </span>
                <Badge variant={path.severity as any}>{path.severity}</Badge>
              </div>
            </div>
            <p className="font-mono text-[11px] text-neon-orange/30 mb-3 leading-relaxed">
              {path.description}
            </p>
            <div className="flex items-center flex-wrap gap-1">
              {(path.steps || []).map((step, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className={`px-2 py-1 border font-mono text-[10px] ${STEP_COLORS[step.type] || STEP_COLORS.discovery}`}>
                    <span className="opacity-50 mr-1">{step.step}.</span>
                    {step.description}
                  </div>
                  {i < (path.steps || []).length - 1 && (
                    <ChevronRight className="w-2.5 h-2.5 text-neon-orange/15 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
