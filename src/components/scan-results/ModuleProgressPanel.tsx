import { CheckCircle, Loader, XCircle, Clock } from 'lucide-react';
import type { ScanModuleStatus } from '../../types';

interface ModuleProgressPanelProps {
  modules: ScanModuleStatus[];
}

const MODULE_LABELS: Record<string, string> = {
  recon: 'Recon',
  osint: 'OSINT',
  web_vuln: 'Web Vuln',
  sensitive_disclosure: 'Sensitive Disclosure',
  llm_injection: 'LLM Injection',
  ai_attack_surface: 'AI Attack Surface',
  prompt_injection: 'Prompt Injection',
  rag_exploitation: 'RAG Exploitation',
  mcp_security: 'MCP Security',
};

export function ModuleProgressPanel({ modules }: ModuleProgressPanelProps) {
  const completed = modules.filter(m => m.status === 'completed').length;
  const failed = modules.filter(m => m.status === 'failed').length;
  const total = modules.length;
  const progress = total > 0 ? ((completed + failed) / total) * 100 : 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-3 h-3 text-terminal-green" />;
      case 'running': return <Loader className="w-3 h-3 text-neon-orange animate-spin" />;
      case 'failed': return <XCircle className="w-3 h-3 text-terminal-red" />;
      default: return <Clock className="w-3 h-3 text-neon-orange/20" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-terminal-green/20 bg-terminal-green/[0.03]';
      case 'running': return 'border-neon-orange/25 bg-neon-orange/[0.05]';
      case 'failed': return 'border-terminal-red/20 bg-terminal-red/[0.03]';
      default: return 'border-neon-orange/5 bg-transparent';
    }
  };

  return (
    <div className="terminal-panel rounded-sm">
      <div className="terminal-header">
        Module Progress
        <span className="ml-auto text-neon-orange/30 font-normal">{completed}/{total} complete</span>
      </div>
      <div className="p-4">
        <div className="h-1.5 bg-neon-orange/5 mb-4 overflow-hidden">
          <div
            className="h-full bg-neon-orange/40 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className={`p-2 border transition-all ${getStatusColor(mod.status)}`}
            >
              <div className="flex items-center gap-1.5">
                {getStatusIcon(mod.status)}
                <span className="font-mono text-[10px] text-neon-orange/50 uppercase tracking-wider truncate">
                  {MODULE_LABELS[mod.module_name] || mod.module_name}
                </span>
              </div>
              {mod.status === 'completed' && mod.findings_count !== undefined && (
                <span className="font-mono text-[10px] text-neon-orange/20 ml-4.5">
                  {mod.findings_count} finding{mod.findings_count !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
