export type ScanStatus = 'pending' | 'running' | 'completed' | 'failed';
export type ScanDepth = 'quick' | 'standard' | 'deep';
export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type ReportType = 'executive' | 'technical' | 'devops';

export type OwaspLLMCategory =
  | 'LLM01' | 'LLM02' | 'LLM03' | 'LLM04' | 'LLM05'
  | 'LLM06' | 'LLM07' | 'LLM08' | 'LLM09' | 'LLM10';

export const OWASP_LLM_MAP: Record<OwaspLLMCategory, { title: string; description: string }> = {
  LLM01: { title: 'Prompt Injection', description: 'Manipulating LLMs via crafted inputs' },
  LLM02: { title: 'Sensitive Information Disclosure', description: 'Unauthorized access to sensitive data through LLM' },
  LLM03: { title: 'Supply Chain', description: 'Vulnerabilities from third-party components' },
  LLM04: { title: 'Data and Model Poisoning', description: 'Manipulation of training data or models' },
  LLM05: { title: 'Improper Output Handling', description: 'Insufficient validation of LLM outputs' },
  LLM06: { title: 'Excessive Agency', description: 'Granting LLMs too much autonomy' },
  LLM07: { title: 'System Prompt Leakage', description: 'Exposure of system-level prompts' },
  LLM08: { title: 'Vector and Embedding Weaknesses', description: 'Exploiting vector storage and RAG pipelines' },
  LLM09: { title: 'Misinformation', description: 'LLM generating false or misleading content' },
  LLM10: { title: 'Unbounded Consumption', description: 'Resource exhaustion through LLM abuse' },
};

export type ModuleCategory = 'recon' | 'web' | 'ai';

export interface ScanModule {
  name: string;
  label: string;
  description: string;
  enabled: boolean;
  category?: ModuleCategory;
}

export interface Finding {
  id: string;
  scan_id?: string;
  title: string;
  description: string;
  severity: Severity;
  cvss_score?: number;
  affected_url?: string;
  evidence?: string;
  remediation?: string;
  cwe_id?: string;
  owasp_category?: string;
  module_name?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
}

export interface Scan {
  id: string;
  user_id?: string;
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

export interface ScanModuleStatus {
  id: string;
  scan_id: string;
  module_name: string;
  enabled: boolean;
  status: string;
  findings_count?: number;
  started_at?: string;
  completed_at?: string;
  created_at?: string;
}

export interface AttackPath {
  id: string;
  scan_id: string;
  chain_name: string;
  severity: Severity;
  steps: Array<{ step: number; type: string; description: string; finding_title?: string }>;
  exploitability: number;
  description: string;
  created_at?: string;
}

export interface Report {
  id: string;
  scan_id: string;
  report_type: ReportType;
  content: string;
  created_at?: string;
}

export interface ScanTemplate {
  id: string;
  name: string;
  description: string;
  modules: string[];
  scan_depth: ScanDepth;
  is_builtin: boolean;
  user_id?: string;
  created_at?: string;
}

export interface ScanResult {
  scan: Scan;
  findings: Finding[];
  modules: ScanModuleStatus[];
  attackPaths: AttackPath[];
  reports: Report[];
}
