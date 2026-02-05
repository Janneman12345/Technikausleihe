
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

  const SQL_SNIPPET = `CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  date TEXT NOT NULL,
  item TEXT NOT NULL,
  person TEXT NOT NULL,
  remarks TEXT,
  photo TEXT,
  timestamp BIGINT NOT NULL
);

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
            
            <div className="space-y-6">
              <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                <h3 className="text-white font-bold mb-3 flex items-center">
                  <span className="bg-[#f5ff00] text-black w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3">1</span>
                  Tabelle in Supabase erstellen
                </h3>
                <p className="text-sm text-gray-400 mb-4">Öffne den <strong>SQL Editor</strong> in deinem Supabase-Projekt und führe diesen Code aus:</p>
                <div className="relative group">
                  <pre className="bg-[#2b292a] p-4 rounded-xl text-[10px] text-[#f5ff00] font-mono overflow-x-auto border border-[#f5ff00]/10">
                    {SQL_SNIPPET}
                  </pre>
                </div>
              </div>

              <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                <h3 className="text-white font-bold mb-3 flex items-center">
                  <span className="bg-[#f5ff00] text-black w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3">2</span>
                  Vercel Variablen setzen
                </h3>
                <p className="text-sm text-gray-400">
                  Stelle sicher, dass <code className="text-[#f5ff00]">SUPABASE_URL</code> und <code className="text-[#f5ff00]">SUPABASE_ANON_KEY</code> in den Vercel Environment Variables korrekt hinterlegt sind.
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://supabase.com" target="_blank" className="px-8 py-4 bg-[#f5ff00] text-black font-black rounded-2xl hover:scale-105 transition-transform text-center uppercase tracking-wider text-sm">Supabase Dashboard</a>
              <button onClick={() => window.location.reload()} className="px-8 py-4 bg-white/5 text-white font-bold rounded-2xl border border-white/10 hover:bg-white/10 transition-all">Verbindung testen</button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const addTransaction = async (t: Transaction) => {
    setTransactions(prev => [t, ...prev]);
    
    const result = await databaseService.saveTransaction(t);
    if (!result.success) {
      alert(`⚠️ Cloud-Fehler:\n${result.error}\n\nDer Eintrag wird lokal entfernt. Prüfe bitte, ob die Tabelle 'transactions' korrekt angelegt wurde.`);
      setTransactions(prev => prev.filter(item => item.id !== t.id));
    }
  };

  const deleteTransaction = async (id: string) => {
    if (window.confirm("Möchtest du diesen Eintrag wirklich löschen?")) {
      const original = [...transactions];
      setTransactions(prev => prev.filter(t => t.id !== id));
      const success = await databaseService.deleteTransaction(id);
      if (!success) {
        alert("Löschen in der Cloud fehlgeschlagen.");
        setTransactions(original);
      }
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
          <OutstandingItems items={getOutstandingItems()} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-1">
            <LoanForm onAddTransaction={addTransaction} />
          </section>
          <section className="lg:col-span-2">
            <HistoryTable transactions={transactions} onDelete={deleteTransaction} />
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default App;
