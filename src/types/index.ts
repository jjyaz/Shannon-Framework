export type ScanStatus = 'pending' | 'running' | 'completed' | 'failed';
export type ScanDepth = 'quick' | 'standard' | 'deep';
export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type ReportType = 'executive' | 'technical' | 'devops';

export interface ScanModule {
  name: string;
  label: string;
  description: string;
  enabled: boolean;
}

export interface Finding {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  cvss_score?: number;
  affected_url?: string;
  evidence?: string;
  remediation?: string;
  cwe_id?: string;
}

export interface Scan {
  id: string;
  target_domain: string;
  target_ip?: string;
  scope_description?: string;
  scan_depth: ScanDepth;
  status: ScanStatus;
  risk_score: number;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface ScanResult {
  scan: Scan;
  findings: Finding[];
  modules: ScanModule[];
}
