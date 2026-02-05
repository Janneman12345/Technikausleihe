
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import LoanForm from './components/LoanForm';
import HistoryTable from './components/HistoryTable';
import Stats from './components/Stats';
import OutstandingItems from './components/OutstandingItems';
import { Transaction, TransactionType } from './types';
import { databaseService } from './services/databaseService';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isConfigured = databaseService.isConfigured();

  useEffect(() => {
    if (isConfigured) {
      const loadData = async () => {
        setIsLoading(true);
        const data = await databaseService.fetchTransactions();
        setTransactions(data);
        setIsLoading(false);
      };
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [isConfigured]);

  if (!isConfigured) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in py-10">
          <div className="bg-[#3d3b3c] rounded-3xl border-2 border-dashed border-[#f5ff00]/30 p-8 md:p-12 text-center">
            <div className="inline-flex p-5 bg-[#f5ff00]/10 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#f5ff00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-white uppercase mb-4 tracking-tight">Cloud-Setup fehlt</h2>
            <p className="text-gray-400 mb-8">Damit deine Daten sicher in der Cloud gespeichert werden können, fehlen noch die Umgebungsvariablen in <strong>Vercel</strong>:</p>
            
            <div className="text-left space-y-4 mb-10">
              <div className="flex items-start space-x-4">
                <div className="bg-[#f5ff00] text-[#333132] font-bold rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-1">1</div>
                <p className="text-sm text-gray-300">Füge <code className="text-[#f5ff00]">SUPABASE_URL</code> hinzu.</p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-[#f5ff00] text-[#333132] font-bold rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-1">2</div>
                <p className="text-sm text-gray-300">Füge <code className="text-[#f5ff00]">SUPABASE_ANON_KEY</code> hinzu.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a 
                href="https://supabase.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white/5 text-white border border-white/10 font-bold rounded-xl hover:bg-white/10 transition-all"
              >
                Supabase öffnen
              </a>
              <a 
                href="https://vercel.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#f5ff00] text-[#333132] font-bold rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(245,255,0,0.2)]"
              >
                Vercel Dashboard
              </a>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const addTransaction = async (t: Transaction) => {
    // Optimistisches Update: Erst in der UI anzeigen für sofortiges Feedback
    setTransactions(prev => [t, ...prev]);
    
    try {
      const success = await databaseService.saveTransaction(t);
      if (!success) {
        // Nur wenn es wirklich fehlgeschlagen ist, Rollback
        console.warn("Speichern wurde vom Service als fehlgeschlagen markiert.");
        alert("Fehler beim Cloud-Sync. Bitte prüfe die Internetverbindung. Der Eintrag wurde lokal zurückgesetzt.");
        setTransactions(prev => prev.filter(item => item.id !== t.id));
      }
    } catch (e) {
      console.error("Unerwarteter Fehler im addTransaction-Ablauf:", e);
      setTransactions(prev => prev.filter(item => item.id !== t.id));
    }
  };

  const deleteTransaction = async (id: string) => {
    if (window.confirm("Möchtest du diesen Eintrag wirklich löschen?")) {
      const originalTransactions = [...transactions];
      setTransactions(prev => prev.filter(t => t.id !== id));
      const success = await databaseService.deleteTransaction(id);
      if (!success) {
        alert("Löschen fehlgeschlagen. Bitte erneut versuchen.");
        setTransactions(originalTransactions);
      }
    }
  };

  const getOutstandingItems = () => {
    const statusMap = new Map<string, Transaction>();
    const sorted = [...transactions].sort((a, b) => a.timestamp - b.timestamp);
    sorted.forEach(t => { statusMap.set(t.item, t); });
    return Array.from(statusMap.values()).filter(t => t.type === TransactionType.LOAN);
  };

  const outstandingItems = getOutstandingItems();

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        <section>
          <header className="mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Dashboard</h2>
              <p className="text-gray-400 text-sm">Zentralisierte Cloud-Übersicht.</p>
            </div>
            {isLoading && (
              <div className="flex items-center space-x-2 text-[#f5ff00] text-xs font-bold animate-pulse">
                <div className="w-2 h-2 bg-[#f5ff00] rounded-full"></div>
                <span>SYNC...</span>
              </div>
            )}
          </header>
          
          <Stats transactions={transactions} />
          <OutstandingItems items={outstandingItems} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-1">
            <LoanForm onAddTransaction={addTransaction} />
          </section>

          <section className="lg:col-span-2">
            <HistoryTable 
              transactions={transactions} 
              onDelete={deleteTransaction} 
            />
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default App;
