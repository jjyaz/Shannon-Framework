import { useState } from 'react';
import { FileText, Download, BarChart3, Code, Wrench } from 'lucide-react';
import { GlowButton } from '../ui';
import type { Report } from '../../types';

interface ReportsPanelProps {
  reports: Report[];
}

const REPORT_CONFIG: Record<string, { icon: typeof FileText; label: string; color: string }> = {
  executive: { icon: BarChart3, label: 'Executive', color: 'text-terminal-blue' },
  technical: { icon: Code, label: 'Technical', color: 'text-neon-orange' },
  devops: { icon: Wrench, label: 'DevOps', color: 'text-terminal-green' },
};

export function ReportsPanel({ reports }: ReportsPanelProps) {
  const [activeReport, setActiveReport] = useState<string | null>(null);

  if (reports.length === 0) return null;

  const selectedReport = reports.find(r => r.report_type === activeReport);

  const handleDownload = (report: Report) => {
    const blob = new Blob([report.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shannon-${report.report_type}-report.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="terminal-panel rounded-sm">
      <div className="terminal-header">
        <FileText className="w-3 h-3" />
        Generated Reports
        <span className="ml-auto text-neon-orange/30 font-normal">{reports.length} reports</span>
      </div>
      <div className="p-4">
        <div className="flex gap-2 mb-3">
          {reports.map((report) => {
            const config = REPORT_CONFIG[report.report_type] || REPORT_CONFIG.technical;
            const Icon = config.icon;
            const isActive = activeReport === report.report_type;
            return (
              <button
                key={report.id}
                onClick={() => setActiveReport(isActive ? null : report.report_type)}
                className={`flex items-center gap-1.5 px-3 py-2 border font-mono text-[11px] uppercase tracking-wider transition-all ${
                  isActive
                    ? 'border-neon-orange/30 bg-neon-orange/10 text-neon-orange'
                    : 'border-neon-orange/10 text-neon-orange/30 hover:text-neon-orange/50'
                }`}
              >
                <Icon className={`w-3 h-3 ${isActive ? config.color : ''}`} />
                {config.label}
              </button>
            );
          })}
        </div>

        {selectedReport && (
          <div className="border border-neon-orange/10">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-neon-orange/5">
              <span className="font-mono text-[10px] text-neon-orange/30 uppercase tracking-widest">
                {REPORT_CONFIG[selectedReport.report_type]?.label || selectedReport.report_type} Report
              </span>
              <GlowButton variant="ghost" size="sm" onClick={() => handleDownload(selectedReport)}>
                <Download className="w-3 h-3" />
                .md
              </GlowButton>
            </div>
            <div className="p-3 max-h-96 overflow-y-auto">
              <pre className="font-mono text-[11px] text-neon-orange/40 whitespace-pre-wrap leading-relaxed">
                {selectedReport.content}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
