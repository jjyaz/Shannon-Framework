import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AuthPage } from './components/auth/AuthPage';
import { LandingPage } from './components/pages/LandingPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { NewScanPage } from './components/pages/NewScanPage';
import { ScanResultPage } from './components/pages/ScanResultPage';

type Page = 'home' | 'dashboard' | 'new-scan' | 'scan-result';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [scanId, setScanId] = useState<string | undefined>();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleNavigate = (page: string, id?: string) => {
    setCurrentPage(page as Page);
    if (id) setScanId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setCurrentPage('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-black flex items-center justify-center">
        <div className="animate-pulse text-neon-orange text-2xl font-heading">
          SHANNON
        </div>
      </div>
    );
  }

  if (!user && (currentPage === 'dashboard' || currentPage === 'new-scan' || currentPage === 'scan-result')) {
    return <AuthPage onAuthSuccess={() => setCurrentPage('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-cyber-black flex flex-col">
      <Header onNavigate={handleNavigate} currentPage={currentPage} />

      <main className="flex-1">
        {currentPage === 'home' && <LandingPage onNavigate={handleNavigate} />}
        {currentPage === 'dashboard' && user && <DashboardPage onNavigate={handleNavigate} />}
        {currentPage === 'new-scan' && user && <NewScanPage onNavigate={handleNavigate} />}
        {currentPage === 'scan-result' && user && scanId && (
          <ScanResultPage scanId={scanId} onNavigate={handleNavigate} />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
