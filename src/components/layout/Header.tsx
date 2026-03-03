import { Terminal, LayoutDashboard, Crosshair, ChevronRight } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const navItems = [
    { id: 'home', label: 'home', icon: Terminal },
    { id: 'dashboard', label: 'scans', icon: LayoutDashboard },
    { id: 'new-scan', label: 'new', icon: Crosshair },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cyber-black/95 backdrop-blur-sm border-b border-neon-orange/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group"
          >
            <span className="text-neon-orange/40 font-mono text-xs">root@shannon</span>
            <span className="text-neon-orange/20 font-mono text-xs">:</span>
            <span className="text-neon-orange font-mono text-sm font-bold tracking-wider text-shadow-neon animate-glow-pulse">
              SHANNON
            </span>
            <span className="text-neon-orange/30 font-mono text-xs hidden sm:inline">v2.0</span>
          </button>

          <nav className="flex items-center">
            <div className="flex items-center bg-cyber-dark/50 border border-neon-orange/10">
              {navItems.map((item, i) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition-all relative ${
                      isActive
                        ? 'text-neon-orange bg-neon-orange/10 text-shadow-neon'
                        : 'text-neon-orange/30 hover:text-neon-orange/70 hover:bg-neon-orange/5'
                    } ${i > 0 ? 'border-l border-neon-orange/10' : ''}`}
                  >
                    <Icon className="w-3 h-3" />
                    <span className="hidden sm:inline">{item.label}</span>
                    {isActive && (
                      <ChevronRight className="w-3 h-3 text-neon-orange/50" />
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
