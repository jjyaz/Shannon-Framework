import { useEffect, useState } from 'react';
import { ArrowLeft, Download, FileText, AlertTriangle, Shield } from 'lucide-react';
import { GlowButton, Badge, LoadingSpinner } from '../ui';
import { supabase } from '../../lib/supabase';
import type { Scan, Finding } from '../../types';

interface ScanResultPageProps {
  scanId: string;
  onNavigate: (page: string) => void;
}

export function ScanResultPage({ scanId, onNavigate }: ScanResultPageProps) {
  const [scan, setScan] = useState<Scan | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScanData();
  }, [scanId]);

  const loadScanData = async () => {
    try {
      const { data: scanData, error: scanError } = await supabase
        .from('scans')
        .select('*')
        .eq('id', scanId)
        .maybeSingle();

      if (scanError) throw scanError;
      setScan(scanData);

      const { data: findingsData, error: findingsError } = await supabase
        .from('findings')
        .select('*')
        .eq('scan_id', scanId)
        .order('created_at', { ascending: false });

      if (findingsError) throw findingsError;
      setFindings(findingsData || []);
    } catch (err) {
      console.error('Error loading scan data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading scan results..." />
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-5xl mx-auto terminal-panel rounded-sm">
          <div className="p-8 text-center">
            <AlertTriangle className="w-8 h-8 text-terminal-red mx-auto mb-3" />
            <p className="font-mono text-sm text-neon-orange/30">Scan not found</p>
            <GlowButton className="mt-4" size="sm" onClick={() => onNavigate('dashboard')}>
              Back to Dashboard
            </GlowButton>
          </div>
        </div>
      </div>
    );
  }

  const severityCounts = {
    critical: findings.filter(f => f.severity === 'critical').length,
    high: findings.filter(f => f.severity === 'high').length,
    medium: findings.filter(f => f.severity === 'medium').length,
    low: findings.filter(f => f.severity === 'low').length,
    info: findings.filter(f => f.severity === 'info').length,
  };

  const handleExport = (format: 'json' | 'markdown') => {
    if (format === 'json') {
      const exportData = { scan, findings, exportedAt: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shannon-scan-${scan.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      let md = `# SHANNON Scan Report\n\n`;
      md += `**Target:** ${scan.target_domain}\n`;
      md += `**Date:** ${new Date(scan.created_at).toLocaleString()}\n`;
      md += `**Risk Score:** ${scan.risk_score}/100\n`;
      md += `**Depth:** ${scan.scan_depth}\n\n`;
      md += `## Severity Summary\n\n`;
      md += `| Severity | Count |\n|---|---|\n`;
      md += `| Critical | ${severityCounts.critical} |\n`;
      md += `| High | ${severityCounts.high} |\n`;
      md += `| Medium | ${severityCounts.medium} |\n`;
      md += `| Low | ${severityCounts.low} |\n`;
      md += `| Info | ${severityCounts.info} |\n\n`;
      md += `## Findings\n\n`;
      findings.forEach((f, i) => {
        md += `### ${i + 1}. ${f.title}\n\n`;
        md += `**Severity:** ${f.severity.toUpperCase()}\n\n`;
        if (f.description) md += `${f.description}\n\n`;
        if (f.affected_url) md += `**URL:** ${f.affected_url}\n\n`;
        if (f.remediation) md += `**Fix:** ${f.remediation}\n\n`;
        md += `---\n\n`;
      });
      const blob = new Blob([md], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shannon-scan-${scan.id}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const riskColor = scan.risk_score >= 80 ? 'text-terminal-red text-shadow-red' :
                    scan.risk_score >= 60 ? 'text-neon-orange text-shadow-neon' :
                    scan.risk_score >= 40 ? 'text-terminal-yellow' :
                    'text-terminal-green text-shadow-green';

  return (
    <div className="min-h-screen pt-16 pb-12 px-4 sm:px-6 lg:px-8 grid-bg">
      <div className="scanline-overlay" />
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <GlowButton variant="ghost" size="sm" onClick={() => onNavigate('dashboard')} className="mb-3">
            <ArrowLeft className="w-3.5 h-3.5" />
            back
          </GlowButton>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[11px] text-neon-orange/30">$</span>
                <span className="font-mono text-sm text-neon-orange/60">cat /scans/{scan.id.slice(0, 8)}/report</span>
              </div>
              <h1 className="font-mono text-xl font-bold text-neon-orange uppercase tracking-wider text-shadow-neon">
                {scan.target_domain}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <GlowButton variant="secondary" size="sm" onClick={() => handleExport('json')}>
                <Download className="w-3 h-3" />
                JSON
              </GlowButton>
              <GlowButton variant="secondary" size="sm" onClick={() => handleExport('markdown')}>
                <FileText className="w-3 h-3" />
                MD
              </GlowButton>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="terminal-panel rounded-sm">
            <div className="px-3 py-2 border-b border-neon-orange/5">
              <span className="font-mono text-[10px] text-neon-orange/30 uppercase tracking-widest">Risk Score</span>
            </div>
            <div className="px-3 py-3 text-center">
              <span className={`font-mono text-3xl font-bold ${riskColor}`}>{scan.risk_score}</span>
              <span className="font-mono text-xs text-neon-orange/20">/100</span>
            </div>
          </div>
          <div className="terminal-panel rounded-sm">
            <div className="px-3 py-2 border-b border-neon-orange/5">
              <span className="font-mono text-[10px] text-neon-orange/30 uppercase tracking-widest">Findings</span>
            </div>
            <div className="px-3 py-3 text-center">
              <span className="font-mono text-3xl font-bold text-neon-orange">{findings.length}</span>
            </div>
          </div>
          <div className="terminal-panel rounded-sm">
            <div className="px-3 py-2 border-b border-neon-orange/5">
              <span className="font-mono text-[10px] text-neon-orange/30 uppercase tracking-widest">Critical</span>
            </div>
            <div className="px-3 py-3 text-center">
              <span className="font-mono text-3xl font-bold text-terminal-red">{severityCounts.critical}</span>
            </div>
          </div>
          <div className="terminal-panel rounded-sm">
            <div className="px-3 py-2 border-b border-neon-orange/5">
              <span className="font-mono text-[10px] text-neon-orange/30 uppercase tracking-widest">High</span>
            </div>
            <div className="px-3 py-3 text-center">
              <span className="font-mono text-3xl font-bold text-neon-orange">{severityCounts.high}</span>
            </div>
          </div>
        </div>

        <div className="terminal-panel rounded-sm mb-6">
          <div className="terminal-header">Severity Breakdown</div>
          <div className="p-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="critical">{severityCounts.critical} Critical</Badge>
              <Badge variant="high">{severityCounts.high} High</Badge>
              <Badge variant="medium">{severityCounts.medium} Medium</Badge>
              <Badge variant="low">{severityCounts.low} Low</Badge>
              <Badge variant="info">{severityCounts.info} Info</Badge>
            </div>

            <div className="mt-4 flex gap-1 h-2">
              {severityCounts.critical > 0 && (
                <div className="bg-terminal-red/60 flex-grow" style={{ flexGrow: severityCounts.critical }} />
              )}
              {severityCounts.high > 0 && (
                <div className="bg-neon-orange/60 flex-grow" style={{ flexGrow: severityCounts.high }} />
              )}
              {severityCounts.medium > 0 && (
                <div className="bg-terminal-yellow/60 flex-grow" style={{ flexGrow: severityCounts.medium }} />
              )}
              {severityCounts.low > 0 && (
                <div className="bg-terminal-blue/60 flex-grow" style={{ flexGrow: severityCounts.low }} />
              )}
              {severityCounts.info > 0 && (
                <div className="bg-terminal-dim/40 flex-grow" style={{ flexGrow: severityCounts.info }} />
              )}
            </div>
          </div>
        </div>

        <div className="terminal-panel rounded-sm mb-1.5">
          <div className="terminal-header">
            Findings
            <span className="ml-auto text-neon-orange/30 font-normal">{findings.length} total</span>
          </div>
        </div>

        {findings.length === 0 ? (
          <div className="terminal-panel rounded-sm">
            <div className="p-8 text-center">
              <Shield className="w-8 h-8 text-terminal-green mx-auto mb-3" />
              <p className="font-mono text-sm text-terminal-green/60">No security findings detected</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            {findings.map((finding, index) => (
              <div key={finding.id} className="terminal-panel rounded-sm">
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-[11px] text-neon-orange/20 flex-shrink-0">
                        [{String(index + 1).padStart(2, '0')}]
                      </span>
                      <h3 className="font-mono text-sm font-bold text-neon-orange truncate">
                        {finding.title}
                      </h3>
                    </div>
                    <Badge variant={finding.severity as any}>
                      {finding.severity}
                    </Badge>
                  </div>

                  {finding.description && (
                    <p className="font-mono text-xs text-neon-orange/40 mb-3 leading-relaxed">
                      {finding.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-[11px]">
                    {finding.affected_url && (
                      <div>
                        <span className="text-neon-orange/20">url:</span>
                        <span className="text-neon-orange/50 ml-1 break-all">{finding.affected_url}</span>
                      </div>
                    )}
                    {finding.cvss_score && (
                      <div>
                        <span className="text-neon-orange/20">cvss:</span>
                        <span className="text-neon-orange/50 ml-1">{finding.cvss_score}</span>
                      </div>
                    )}
                    {finding.cwe_id && (
                      <div>
                        <span className="text-neon-orange/20">cwe:</span>
                        <span className="text-neon-orange/50 ml-1">{finding.cwe_id}</span>
                      </div>
                    )}
                  </div>

                  {finding.evidence && (
                    <div className="mt-3 bg-cyber-black/50 border border-neon-orange/5 p-3">
                      <span className="font-mono text-[10px] text-neon-orange/20 uppercase tracking-widest">Evidence</span>
                      <pre className="font-mono text-[11px] text-neon-orange/35 mt-1 overflow-x-auto whitespace-pre-wrap">
                        {finding.evidence}
                      </pre>
                    </div>
                  )}

                  {finding.remediation && (
                    <div className="mt-3 bg-terminal-green/[0.02] border border-terminal-green/10 p-3">
                      <span className="font-mono text-[10px] text-terminal-green/40 uppercase tracking-widest">Remediation</span>
                      <p className="font-mono text-[11px] text-terminal-green/50 mt-1 leading-relaxed">
                        {finding.remediation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
