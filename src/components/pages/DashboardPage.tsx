import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader, Plus, Search, Clock, ChevronRight, TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import { GlowButton, Badge, LoadingSpinner, Input } from '../ui';
import { supabase } from '../../lib/supabase';
import type { Scan } from '../../types';

interface DashboardPageProps {
  onNavigate: (page: string, scanId?: string) => void;
}

interface ScanWithFindings extends Scan {
  findingCount?: number;
  criticalCount?: number;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [scans, setScans] = useState<ScanWithFindings[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadScans();
  }, []);

  const loadScans = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('scans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const scansWithFindings: ScanWithFindings[] = data || [];

      if (scansWithFindings.length > 0) {
        const scanIds = scansWithFindings.map(s => s.id);
        const { data: findingsData } = await supabase
          .from('findings')
          .select('scan_id, severity')
          .in('scan_id', scanIds);

        if (findingsData) {
          const countMap: Record<string, { total: number; critical: number }> = {};
          findingsData.forEach(f => {
            if (!countMap[f.scan_id]) countMap[f.scan_id] = { total: 0, critical: 0 };
            countMap[f.scan_id].total++;
            if (f.severity === 'critical') countMap[f.scan_id].critical++;
          });
          scansWithFindings.forEach(s => {
            s.findingCount = countMap[s.id]?.total || 0;
            s.criticalCount = countMap[s.id]?.critical || 0;
          });
        }
      }

      setScans(scansWithFindings);
    } catch (err) {
      console.error('Error loading scans:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-3.5 h-3.5 text-terminal-green" />;
      case 'failed':
        return <XCircle className="w-3.5 h-3.5 text-terminal-red" />;
      case 'running':
        return <Loader className="w-3.5 h-3.5 text-neon-orange animate-spin" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-terminal-dim" />;
    }
  };

  const getStatusBadge = (status: string): 'critical' | 'high' | 'medium' | 'low' | 'info' | 'success' => {
    const map: Record<string, 'critical' | 'high' | 'medium' | 'low' | 'info' | 'success'> = {
      completed: 'success',
      running: 'medium',
      failed: 'critical',
      pending: 'info',
    };
    return map[status] || 'info';
  };

  const getRiskBadge = (score: number): 'critical' | 'high' | 'medium' | 'low' | 'info' => {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    if (score >= 20) return 'low';
    return 'info';
  };

  const filteredScans = scans.filter((scan) => {
    const matchesSearch = scan.target_domain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || scan.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: scans.length,
    completed: scans.filter(s => s.status === 'completed').length,
    running: scans.filter(s => s.status === 'running').length,
    failed: scans.filter(s => s.status === 'failed').length,
  };

  const completedScans = scans.filter(s => s.status === 'completed');
  const avgRisk = completedScans.length > 0
    ? Math.round(completedScans.reduce((sum, s) => sum + s.risk_score, 0) / completedScans.length)
    : 0;

  const domainGroups: Record<string, ScanWithFindings[]> = {};
  completedScans.forEach(s => {
    if (!domainGroups[s.target_domain]) domainGroups[s.target_domain] = [];
    domainGroups[s.target_domain].push(s);
  });

  const trends = Object.entries(domainGroups)
    .filter(([, group]) => group.length >= 2)
    .map(([domain, group]) => {
      const sorted = [...group].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const latest = sorted[0];
      const previous = sorted[1];
      const delta = latest.risk_score - previous.risk_score;
      return { domain, latest, previous, delta };
    })
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

  return (
    <div className="min-h-screen pt-16 pb-12 px-4 sm:px-6 lg:px-8 grid-bg">
      <div className="scanline-overlay" />
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[11px] text-neon-orange/30">$</span>
              <span className="font-mono text-sm text-neon-orange/60">ls -la /scans/</span>
            </div>
            <h1 className="font-mono text-xl font-bold text-neon-orange uppercase tracking-wider text-shadow-neon">
              Scan Dashboard
            </h1>
          </div>
          <GlowButton size="sm" onClick={() => onNavigate('new-scan')}>
            <Plus className="w-3.5 h-3.5" />
            New Scan
          </GlowButton>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { label: 'Total', value: stats.total, color: 'text-neon-orange' },
            { label: 'Complete', value: stats.completed, color: 'text-terminal-green' },
            { label: 'Running', value: stats.running, color: 'text-terminal-yellow' },
            { label: 'Failed', value: stats.failed, color: 'text-terminal-red' },
            { label: 'Avg Risk', value: avgRisk, color: avgRisk >= 60 ? 'text-terminal-red' : avgRisk >= 40 ? 'text-neon-orange' : 'text-terminal-green' },
          ].map((stat) => (
            <div key={stat.label} className="terminal-panel rounded-sm">
              <div className="px-3 py-2 border-b border-neon-orange/5">
                <span className="font-mono text-[10px] text-neon-orange/30 uppercase tracking-widest">{stat.label}</span>
              </div>
              <div className="px-3 py-3">
                <span className={`font-mono text-2xl font-bold ${stat.color}`}>{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        {trends.length > 0 && (
          <div className="terminal-panel rounded-sm mb-6">
            <div className="terminal-header">
              <BarChart3 className="w-3 h-3" />
              Risk Trends
              <span className="ml-auto text-neon-orange/30 font-normal">domains with multiple scans</span>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {trends.slice(0, 6).map((trend) => (
                  <button
                    key={trend.domain}
                    onClick={() => onNavigate('scan-result', trend.latest.id)}
                    className="p-3 border border-neon-orange/10 text-left hover:border-neon-orange/25 transition-all"
                  >
                    <div className="font-mono text-xs text-neon-orange font-semibold truncate mb-1">
                      {trend.domain}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-lg font-bold text-neon-orange">{trend.latest.risk_score}</span>
                        <span className="font-mono text-[10px] text-neon-orange/20">from {trend.previous.risk_score}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {trend.delta > 0 ? (
                          <TrendingUp className="w-3 h-3 text-terminal-red" />
                        ) : trend.delta < 0 ? (
                          <TrendingDown className="w-3 h-3 text-terminal-green" />
                        ) : (
                          <Minus className="w-3 h-3 text-neon-orange/30" />
                        )}
                        <span className={`font-mono text-xs font-bold ${
                          trend.delta > 0 ? 'text-terminal-red' :
                          trend.delta < 0 ? 'text-terminal-green' :
                          'text-neon-orange/30'
                        }`}>
                          {trend.delta > 0 ? '+' : ''}{trend.delta}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="terminal-panel rounded-sm mb-4">
          <div className="p-3 flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="grep -i domain..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                prefix="$"
              />
            </div>
            <div className="flex items-center border border-neon-orange/10">
              {['all', 'pending', 'running', 'completed', 'failed'].map((status, i) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-2 font-mono text-[11px] uppercase tracking-wider transition-all ${
                    filterStatus === status
                      ? 'bg-neon-orange/10 text-neon-orange'
                      : 'text-neon-orange/25 hover:text-neon-orange/50'
                  } ${i > 0 ? 'border-l border-neon-orange/10' : ''}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <LoadingSpinner size="md" text="Loading scans..." />
          </div>
        ) : filteredScans.length === 0 ? (
          <div className="terminal-panel rounded-sm">
            <div className="p-8 text-center">
              <Search className="w-8 h-8 text-neon-orange/10 mx-auto mb-3" />
              <p className="font-mono text-sm text-neon-orange/25">
                {searchTerm || filterStatus !== 'all'
                  ? 'No matching scans found'
                  : 'No scans yet. Initialize your first security test.'}
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <GlowButton className="mt-4" size="sm" onClick={() => onNavigate('new-scan')}>
                  <Plus className="w-3.5 h-3.5" />
                  Create First Scan
                </GlowButton>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            {filteredScans.map((scan) => (
              <div
                key={scan.id}
                onClick={() => (scan.status === 'completed' || scan.status === 'running') && onNavigate('scan-result', scan.id)}
                className={`terminal-panel rounded-sm transition-all duration-200 ${
                  scan.status === 'completed' || scan.status === 'running' ? 'cursor-pointer hover:border-neon-orange/30' : ''
                }`}
              >
                <div className="p-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getStatusIcon(scan.status)}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-neon-orange font-semibold truncate">
                          {scan.target_domain}
                        </span>
                        <Badge variant={getStatusBadge(scan.status)}>
                          {scan.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 font-mono text-[11px] text-neon-orange/20 mt-0.5">
                        <span>depth:{scan.scan_depth}</span>
                        {scan.findingCount !== undefined && scan.status === 'completed' && (
                          <>
                            <span>|</span>
                            <span>{scan.findingCount} finding{scan.findingCount !== 1 ? 's' : ''}</span>
                            {(scan.criticalCount || 0) > 0 && (
                              <span className="text-terminal-red/50">{scan.criticalCount} critical</span>
                            )}
                          </>
                        )}
                        <span>|</span>
                        <span>{new Date(scan.created_at).toLocaleDateString()} {new Date(scan.created_at).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {scan.status === 'completed' && (
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-neon-orange/30">risk:</span>
                        <span className="font-mono text-lg font-bold text-neon-orange text-shadow-neon">
                          {scan.risk_score}
                        </span>
                        <Badge variant={getRiskBadge(scan.risk_score)}>
                          {scan.risk_score >= 80 ? 'CRIT' :
                           scan.risk_score >= 60 ? 'HIGH' :
                           scan.risk_score >= 40 ? 'MED' :
                           scan.risk_score >= 20 ? 'LOW' : 'INFO'}
                        </Badge>
                      </div>
                    )}
                    {(scan.status === 'completed' || scan.status === 'running') && (
                      <ChevronRight className="w-3.5 h-3.5 text-neon-orange/20" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
