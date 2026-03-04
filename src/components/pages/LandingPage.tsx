import { useEffect, useState } from 'react';
import { Brain, Target, Shield, FileText, AlertTriangle, ChevronRight, Zap, Scan, Bug, Network, Crosshair } from 'lucide-react';
import { GlowButton, NeonText } from '../ui';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

function TypingText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayed(text.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [started, text]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && <span className="animate-blink text-neon-orange">_</span>}
    </span>
  );
}

function TerminalWindow({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`terminal-panel rounded-sm ${className}`}>
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-neon-orange/10">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-terminal-red/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-terminal-yellow/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-terminal-green/60" />
          </div>
          <span className="font-mono text-[10px] text-neon-orange/40 uppercase tracking-widest">{title}</span>
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [bootComplete, setBootComplete] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setBootComplete(true), 600);
    return () => clearTimeout(timeout);
  }, []);

  const features = [
    { icon: Brain, title: 'AI Attack Surface', desc: 'Discover AI endpoints, plugin manifests, vector DBs, and MCP transport exposure' },
    { icon: Target, title: 'Prompt Injection', desc: 'System prompt extraction, role hijacking, delimiter bypass with OWASP LLM mapping' },
    { icon: Bug, title: 'LLM Exploits', desc: 'Detect jailbreaks, data leakage, RAG poisoning, and model manipulation vectors' },
    { icon: FileText, title: 'Auto Reports', desc: 'Executive, technical, and DevOps reports with OWASP LLM Top 10 compliance' },
    { icon: Scan, title: 'Web + Recon', desc: '9 modules: DNS, OSINT, headers, CSP, sensitive disclosure, and attack path correlation' },
    { icon: Network, title: 'MCP Security', desc: 'MCP manifest analysis, tool permission auditing, and SSE transport scanning' },
  ];

  const bootLines = [
    { text: '[  OK  ] Initializing SHANNON framework v2.0...', color: 'text-terminal-green' },
    { text: '[  OK  ] Loading 9 attack modules...', color: 'text-terminal-green' },
    { text: '[  OK  ] OWASP LLM Top 10 mapping active', color: 'text-terminal-green' },
    { text: '[WARN ] Authorized testing mode active', color: 'text-terminal-yellow' },
  ];

  return (
    <div className="min-h-screen grid-bg">
      <div className="scanline-overlay" />
      <div className="noise-overlay" />

      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-orange/[0.03] rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-lg mb-6 border border-neon-orange/20 rounded-sm overflow-hidden shadow-neon-lg">
              <img
                src="/get_rid_of_Keygraph_and_the_lo_Nano_Banana_2_04445.jpg"
                alt="SHANNON Framework"
                className="w-full"
              />
            </div>

            <TerminalWindow title="shannon.boot" className="w-full max-w-lg mb-8">
              <div className="space-y-0.5">
                {bootLines.map((line, i) => (
                  <div
                    key={i}
                    className={`font-mono text-[11px] ${line.color} transition-opacity duration-300`}
                    style={{ opacity: bootComplete ? 1 : 0, transitionDelay: `${i * 150}ms` }}
                  >
                    {line.text}
                  </div>
                ))}
                {bootComplete && (
                  <div className="font-mono text-[11px] text-neon-orange/40 mt-2">
                    <TypingText text="System ready. Awaiting operator command..." delay={800} />
                  </div>
                )}
              </div>
            </TerminalWindow>

            <div className="text-center mb-8">
              <NeonText as="h1" glow="strong" className="text-5xl sm:text-6xl md:text-8xl font-heading font-bold uppercase tracking-[0.15em] mb-3">
                SHANNON
              </NeonText>
              <p className="font-mono text-xs sm:text-sm text-neon-orange/40 uppercase tracking-[0.25em] mb-1.5">
                AI Penetration Testing Framework
              </p>
              <p className="font-mono text-[11px] text-neon-orange/25 mb-1">
                9 Security Modules | OWASP LLM Top 10 | Attack Path Correlation
              </p>
              <p className="font-mono text-[11px] text-terminal-red/60 uppercase tracking-widest">
                -Authorized Security Testing Only-
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <GlowButton size="lg" onClick={() => onNavigate('new-scan')}>
                <Crosshair className="w-4 h-4" />
                Start Authorized Test
              </GlowButton>
              <GlowButton size="lg" variant="secondary" onClick={() => onNavigate('dashboard')}>
                View Dashboard
              </GlowButton>
            </div>
          </div>
        </div>
      </section>

      <div className="glow-line max-w-4xl mx-auto" />

      <section className="py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <span className="font-mono text-[11px] text-neon-orange/30">$</span>
            <span className="font-mono text-sm text-neon-orange/60 uppercase tracking-wider">cat modules.conf</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="terminal-panel rounded-sm group hover:border-neon-orange/25 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-3.5 h-3.5 text-neon-orange/50 group-hover:text-neon-orange transition-colors" />
                      <h3 className="font-mono text-xs font-bold text-neon-orange/70 uppercase tracking-wide group-hover:text-neon-orange transition-colors">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="font-mono text-[11px] text-neon-orange/25 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="glow-line max-w-4xl mx-auto" />

      <section className="py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <span className="font-mono text-[11px] text-neon-orange/30">$</span>
            <span className="font-mono text-sm text-neon-orange/60 uppercase tracking-wider">./workflow --steps</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { step: '01', title: 'Authorize', desc: 'Provide legal consent and org details before any scan', icon: Shield },
              { step: '02', title: 'Configure', desc: 'Select target, depth, modules, or use preset templates', icon: Zap },
              { step: '03', title: 'Execute', desc: '9 modules run with live progress, attack paths, and auto reports', icon: Crosshair },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="relative">
                  <TerminalWindow title={`step_${item.step}`}>
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-2xl font-bold text-neon-orange/8">{item.step}</span>
                      <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Icon className="w-3.5 h-3.5 text-neon-orange/50" />
                          <h3 className="font-mono text-xs font-bold text-neon-orange uppercase tracking-wide">
                            {item.title}
                          </h3>
                        </div>
                        <p className="font-mono text-[11px] text-neon-orange/25 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </TerminalWindow>
                  {i < 2 && (
                    <div className="hidden md:flex absolute top-1/2 -right-1.5 transform -translate-y-1/2 z-10">
                      <ChevronRight className="w-3 h-3 text-neon-orange/15" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="glow-line max-w-4xl mx-auto" />

      <section className="py-14 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-3xl mx-auto">
          <TerminalWindow title="SECURITY_DISCLAIMER">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-terminal-red flex-shrink-0 mt-0.5" />
              <div className="font-mono text-[11px] space-y-2">
                <p className="text-terminal-red font-bold uppercase tracking-wider text-xs">
                  LEGAL WARNING
                </p>
                <p className="text-neon-orange/30 leading-relaxed">
                  SHANNON is designed exclusively for authorized security testing. Unauthorized access to computer
                  systems is illegal under federal and international law.
                </p>
                <p className="text-neon-orange/40 leading-relaxed">
                  By using this tool, you confirm explicit written authorization from the target system owner.
                  All scans are logged for audit compliance.
                </p>
              </div>
            </div>
          </TerminalWindow>
        </div>
      </section>
    </div>
  );
}
