import { useState } from 'react';
import { Play, ArrowLeft, Zap } from 'lucide-react';
import { GlowButton, Input, TextArea, Select, Checkbox, LoadingSpinner } from '../ui';
import { ConsentModal } from '../modals/ConsentModal';
import type { ConsentData } from '../modals/ConsentModal';
import { supabase } from '../../lib/supabase';
import type { ScanModule, ScanDepth } from '../../types';

interface NewScanPageProps {
  onNavigate: (page: string, scanId?: string) => void;
}

const AVAILABLE_MODULES: (ScanModule & { category: string })[] = [
  { name: 'recon', label: 'Reconnaissance', description: 'DNS enumeration, subdomain discovery, SPF/DMARC', enabled: true, category: 'recon' },
  { name: 'osint', label: 'OSINT', description: 'Robots.txt, sitemap, tech fingerprinting, email harvest', enabled: true, category: 'recon' },
  { name: 'web_vuln', label: 'Web Vuln Scan', description: 'Security headers, CSP, sensitive paths', enabled: true, category: 'web' },
  { name: 'sensitive_disclosure', label: 'Sensitive Disclosure', description: 'API key exposure, PII detection, error leaks', enabled: true, category: 'web' },
  { name: 'llm_injection', label: 'LLM Injection', description: 'AI endpoint discovery across 16 paths', enabled: true, category: 'ai' },
  { name: 'ai_attack_surface', label: 'AI Attack Surface', description: 'Plugin manifests, vector DBs, model APIs', enabled: true, category: 'ai' },
  { name: 'prompt_injection', label: 'Prompt Injection', description: 'System prompt extraction, role hijacking', enabled: true, category: 'ai' },
  { name: 'rag_exploitation', label: 'RAG Exploitation', description: 'Document upload, retrieval poisoning', enabled: false, category: 'ai' },
  { name: 'mcp_security', label: 'MCP Security', description: 'MCP manifest, tool permissions, SSE transport', enabled: false, category: 'ai' },
];

interface ScanPreset {
  name: string;
  description: string;
  modules: string[];
}

const SCAN_PRESETS: ScanPreset[] = [
  { name: 'Full Assessment', description: 'All 9 modules', modules: AVAILABLE_MODULES.map(m => m.name) },
  { name: 'AI Security Audit', description: 'AI/LLM focused', modules: ['llm_injection', 'ai_attack_surface', 'prompt_injection', 'rag_exploitation', 'mcp_security', 'sensitive_disclosure'] },
  { name: 'Web Hardening', description: 'Web security', modules: ['recon', 'osint', 'web_vuln', 'sensitive_disclosure'] },
  { name: 'Quick Recon', description: 'Fast surface scan', modules: ['recon', 'osint'] },
];

const CATEGORY_LABELS: Record<string, string> = {
  recon: 'Reconnaissance',
  web: 'Web Security',
  ai: 'AI / LLM Security',
};

export function NewScanPage({ onNavigate }: NewScanPageProps) {
  const [targetDomain, setTargetDomain] = useState('');
  const [targetIp, setTargetIp] = useState('');
  const [scopeDescription, setScopeDescription] = useState('');
  const [scanDepth, setScanDepth] = useState<ScanDepth>('standard');
  const [modules, setModules] = useState<(ScanModule & { category: string })[]>(AVAILABLE_MODULES);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const handleModuleToggle = (moduleName: string) => {
    setActivePreset(null);
    setModules(modules.map(m =>
      m.name === moduleName ? { ...m, enabled: !m.enabled } : m
    ));
  };

  const handlePreset = (preset: ScanPreset) => {
    setActivePreset(preset.name);
    setModules(modules.map(m => ({
      ...m,
      enabled: preset.modules.includes(m.name),
    })));
  };

  const handleStartScan = () => {
    setError('');
    if (!targetDomain.trim()) {
      setError('Target domain is required');
      return;
    }
    setShowConsentModal(true);
  };

  const handleConsent = async (consentData: ConsentData) => {
    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const { data: consent, error: consentError } = await supabase
        .from('consents')
        .insert({
          user_id: user.id,
          organization_name: consentData.organizationName,
          target_domain: consentData.targetDomain,
          authorized: consentData.authorized,
          terms_accepted: consentData.termsAccepted,
        })
        .select()
        .single();

      if (consentError) throw consentError;

      const { data: scan, error: scanError } = await supabase
        .from('scans')
        .insert({
          user_id: user.id,
          consent_id: consent.id,
          target_domain: targetDomain,
          target_ip: targetIp || null,
          scope_description: scopeDescription || null,
          scan_depth: scanDepth,
          status: 'pending',
        })
        .select()
        .single();

      if (scanError) throw scanError;

      const moduleInserts = modules
        .filter(m => m.enabled)
        .map(m => ({
          scan_id: scan.id,
          module_name: m.name,
          enabled: true,
          status: 'pending',
        }));

      const { error: modulesError } = await supabase
        .from('scan_modules')
        .insert(moduleInserts);

      if (modulesError) throw modulesError;

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/execute-scan`;
      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scanId: scan.id }),
      });

      setShowConsentModal(false);
      onNavigate('scan-result', scan.id);
    } catch (err) {
      console.error('Error creating scan:', err);
      setError(err instanceof Error ? err.message : 'Failed to create scan');
    } finally {
      setLoading(false);
    }
  };

  const selectedCount = modules.filter(m => m.enabled).length;
  const categories = ['recon', 'web', 'ai'];

  return (
    <div className="min-h-screen pt-16 pb-12 px-4 sm:px-6 lg:px-8 grid-bg">
      <div className="scanline-overlay" />
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <GlowButton variant="ghost" size="sm" onClick={() => onNavigate('dashboard')} className="mb-3">
            <ArrowLeft className="w-3.5 h-3.5" />
            back
          </GlowButton>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[11px] text-neon-orange/30">$</span>
            <span className="font-mono text-sm text-neon-orange/60">shannon --new-scan</span>
          </div>
          <h1 className="font-mono text-xl font-bold text-neon-orange uppercase tracking-wider text-shadow-neon">
            Configure Scan
          </h1>
        </div>

        {error && (
          <div className="mb-4 terminal-panel rounded-sm border-terminal-red/30">
            <div className="p-3 font-mono text-xs text-terminal-red">
              [ERROR] {error}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="terminal-panel rounded-sm">
            <div className="terminal-header">Target Configuration</div>
            <div className="p-4 space-y-3">
              <Input
                label="Target Domain"
                placeholder="example.com"
                value={targetDomain}
                onChange={(e) => setTargetDomain(e.target.value)}
              />
              <Input
                label="Target IP (optional)"
                placeholder="192.168.1.1"
                value={targetIp}
                onChange={(e) => setTargetIp(e.target.value)}
              />
              <TextArea
                label="Scope Description"
                placeholder="Describe the scope of this security test..."
                value={scopeDescription}
                onChange={(e) => setScopeDescription(e.target.value)}
                rows={3}
              />
              <Select
                label="Scan Depth"
                value={scanDepth}
                onChange={(e) => setScanDepth(e.target.value as ScanDepth)}
                options={[
                  { value: 'quick', label: 'Quick -- Fast recon (5-10 min)' },
                  { value: 'standard', label: 'Standard -- Full scan (15-30 min)' },
                  { value: 'deep', label: 'Deep -- Intensive analysis (1-2 hrs)' },
                ]}
              />
            </div>
          </div>

          <div className="terminal-panel rounded-sm">
            <div className="terminal-header">
              <Zap className="w-3 h-3" />
              Scan Presets
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SCAN_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handlePreset(preset)}
                    className={`p-2 border text-left transition-all ${
                      activePreset === preset.name
                        ? 'border-neon-orange/30 bg-neon-orange/10'
                        : 'border-neon-orange/10 hover:border-neon-orange/20'
                    }`}
                  >
                    <span className={`font-mono text-[11px] font-bold block ${
                      activePreset === preset.name ? 'text-neon-orange' : 'text-neon-orange/50'
                    }`}>
                      {preset.name}
                    </span>
                    <span className="font-mono text-[10px] text-neon-orange/20">{preset.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="terminal-panel rounded-sm">
            <div className="terminal-header">
              Security Modules
              <span className="ml-auto text-neon-orange/30 font-normal">{selectedCount}/{modules.length} active</span>
            </div>
            <div className="p-4 space-y-4">
              {categories.map((cat) => {
                const catModules = modules.filter(m => m.category === cat);
                return (
                  <div key={cat}>
                    <h3 className="font-mono text-[10px] text-neon-orange/30 uppercase tracking-widest mb-2">
                      {CATEGORY_LABELS[cat]}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {catModules.map((module) => (
                        <div
                          key={module.name}
                          className={`p-3 border transition-all cursor-pointer ${
                            module.enabled
                              ? 'border-neon-orange/25 bg-neon-orange/[0.03]'
                              : 'border-neon-orange/5 bg-transparent'
                          }`}
                          onClick={() => handleModuleToggle(module.name)}
                        >
                          <Checkbox
                            label={module.label}
                            checked={module.enabled}
                            onChange={() => handleModuleToggle(module.name)}
                          />
                          <p className="font-mono text-[11px] text-neon-orange/20 ml-7 mt-0.5">
                            {module.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <GlowButton variant="secondary" size="sm" onClick={() => onNavigate('dashboard')}>
              Cancel
            </GlowButton>
            <GlowButton
              onClick={handleStartScan}
              disabled={loading || !targetDomain.trim() || selectedCount === 0}
            >
              {loading ? (
                <LoadingSpinner size="sm" text="Initializing..." />
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Execute Scan
                </>
              )}
            </GlowButton>
          </div>
        </div>
      </div>

      <ConsentModal
        isOpen={showConsentModal}
        onClose={() => setShowConsentModal(false)}
        onConsent={handleConsent}
        targetDomain={targetDomain}
      />
    </div>
  );
}
