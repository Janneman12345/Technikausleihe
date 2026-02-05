
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
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-[#3d3b3c] rounded-3xl border-2 border-dashed border-[#f5ff00]/30 animate-fade-in">
          <div className="p-6 bg-[#f5ff00]/10 rounded-full mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#f5ff00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-[#f5ff00] uppercase mb-4">Konfiguration fehlt</h2>
          <p className="text-gray-300 max-w-md mb-8 leading-relaxed">
            Die App ist bereit, aber die Verbindung zur Cloud-Datenbank (Supabase) wurde noch nicht eingerichtet. 
            Bitte hinterlege <code className="bg-black/40 px-2 py-1 rounded text-[#f5ff00]">SUPABASE_URL</code> und <code className="bg-black/40 px-2 py-1 rounded text-[#f5ff00]">SUPABASE_ANON_KEY</code> in deinen Umgebungsvariablen.
          </p>
          <a 
            href="https://supabase.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-8 py-3 bg-[#f5ff00] text-[#333132] font-bold rounded-xl hover:scale-105 transition-transform"
          >
            Supabase Setup Anleitung
          </a>
        </div>
      </Layout>
    );
  }

  const addTransaction = async (t: Transaction) => {
    setTransactions(prev => [t, ...prev]);
    const success = await databaseService.saveTransaction(t);
    if (!success) {
      alert("Fehler beim Speichern in der Cloud. Bitte Internetverbindung prüfen.");
      setTransactions(prev => prev.filter(item => item.id !== t.id));
    }
  };

  const deleteTransaction = async (id: string) => {
    if (window.confirm("Möchtest du diesen Eintrag wirklich löschen?")) {
      const originalTransactions = [...transactions];
      setTransactions(prev => prev.filter(t => t.id !== id));
      const success = await databaseService.deleteTransaction(id);
      if (!success) {
        alert("Löschen fehlgeschlagen.");
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
