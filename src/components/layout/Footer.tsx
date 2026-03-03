export function Footer() {
  return (
    <footer className="border-t border-neon-orange/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-xs">
          <div className="flex items-center gap-2 text-neon-orange/20">
            <span className="text-neon-orange/40">[SYS]</span>
            <span>SHANNON AI Penetration Testing Framework</span>
          </div>
          <div className="flex items-center gap-4 text-neon-orange/15">
            <a
              href="https://github.com/KeygraphHQ/shannon"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neon-orange/40 transition-colors"
            >
              github://KeygraphHQ/shannon
            </a>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">AUTHORIZED USE ONLY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
