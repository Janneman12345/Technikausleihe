
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

  const SQL_SNIPPET = `-- 1. TABELLE ANLEGEN
-- CREATE TABLE transactions (
--   id TEXT PRIMARY KEY,
--   type TEXT NOT NULL,
--   date TEXT NOT NULL,
--   item TEXT NOT NULL,
--   person TEXT NOT NULL,
--   remarks TEXT,
--   photo TEXT,
--   timestamp BIGINT NOT NULL
-- );

-- ZUGRIFFSRECHTE SICHERSTELLEN
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read" ON transactions FOR SELECT USING (true);
CREATE POLICY "Public Insert" ON transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Delete" ON transactions FOR DELETE USING (true);`;

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
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in py-10">
          <div className="bg-[#3d3b3c] rounded-3xl border-2 border-[#f5ff00]/20 p-8 md:p-12">
            <h2 className="text-3xl font-black text-[#f5ff00] uppercase mb-6 tracking-tight text-center">Cloud-Datenbank Setup</h2>
            <div className="space-y-6 text-center">
              <p className="text-gray-400">Bitte richte zuerst deine Umgebungsvariablen in Vercel ein.</p>
              <div className="bg-black/20 p-6 rounded-2xl border border-white/5 text-left">
                <h3 className="text-white font-bold mb-3">Tabelle anlegen:</h3>
                <pre className="bg-[#2b292a] p-4 rounded-xl text-[10px] text-[#f5ff00] font-mono overflow-x-auto border border-[#f5ff00]/30 shadow-inner">
                  {SQL_SNIPPET}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const addTransaction = async (t: Transaction) => {
    const previousTransactions = [...transactions];
    setTransactions(prev => [t, ...prev]);
    const result = await databaseService.saveTransaction(t);
    if (!result.success) {
      alert(`Fehler: ${result.error}`);
      setTransactions(previousTransactions);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (window.confirm("Eintrag wirklich löschen?")) {
      const original = [...transactions];
      setTransactions(prev => prev.filter(t => t.id !== id));
      const success = await databaseService.deleteTransaction(id);
      if (!success) setTransactions(original);
    }
  };

  const getOutstandingItems = () => {
    const statusMap = new Map<string, Transaction>();
    const sorted = [...transactions].sort((a, b) => a.timestamp - b.timestamp);
    sorted.forEach(t => { statusMap.set(t.item, t); });
    return Array.from(statusMap.values()).filter(t => t.type === TransactionType.LOAN);
  };

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        <section>
          <header className="mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Übersicht</h2>
          </header>
          <Stats transactions={transactions} />
          <OutstandingItems items={getOutstandingItems()} />
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-1"><LoanForm onAddTransaction={addTransaction} /></section>
          <section className="lg:col-span-2"><HistoryTable transactions={transactions} onDelete={deleteTransaction} /></section>
        </div>
      </div>
    </Layout>
  );
};

export default App;
