import { OWASP_LLM_MAP } from '../../types';
import type { Finding, OwaspLLMCategory } from '../../types';

interface OwaspCoveragePanelProps {
  findings: Finding[];
}

export function OwaspCoveragePanel({ findings }: OwaspCoveragePanelProps) {
  const categories = Object.entries(OWASP_LLM_MAP) as [OwaspLLMCategory, { title: string; description: string }][];

  const findingsPerCategory: Record<string, number> = {};
  findings.forEach(f => {
    if (f.owasp_category) {
      findingsPerCategory[f.owasp_category] = (findingsPerCategory[f.owasp_category] || 0) + 1;
    }
  });

  const testedCount = categories.filter(([key]) => findingsPerCategory[key]).length;

  return (
    <div className="terminal-panel rounded-sm">
      <div className="terminal-header">
        OWASP LLM Top 10
        <span className="ml-auto text-neon-orange/30 font-normal">{testedCount}/10 categories tested</span>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
          {categories.map(([key, info]) => {
            const count = findingsPerCategory[key] || 0;
            const tested = count > 0;
            return (
              <div
                key={key}
                className={`p-2 border transition-all ${
                  tested
                    ? 'border-neon-orange/25 bg-neon-orange/[0.05]'
                    : 'border-neon-orange/5 bg-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`font-mono text-[10px] font-bold ${tested ? 'text-neon-orange' : 'text-neon-orange/20'}`}>
                    {key}
                  </span>
                  {tested && (
                    <span className="font-mono text-[10px] text-neon-orange/40">{count}</span>
                  )}
                </div>
                <p className={`font-mono text-[9px] leading-tight ${tested ? 'text-neon-orange/40' : 'text-neon-orange/15'}`}>
                  {info.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
