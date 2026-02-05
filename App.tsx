
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

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await databaseService.fetchTransactions();
      setTransactions(data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const addTransaction = async (t: Transaction) => {
    // Optimistisches Update für UI-Responsivität
    setTransactions(prev => [t, ...prev]);
    
    const success = await databaseService.saveTransaction(t);
    if (!success) {
      alert("Fehler beim Speichern in der Cloud. Bitte Internetverbindung prüfen.");
      // Rollback bei Fehler
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
    // Sortierung nach Zeitstempel sicherstellen
    const sorted = [...transactions].sort((a, b) => a.timestamp - b.timestamp);
    sorted.forEach(t => {
      statusMap.set(t.item, t);
    });
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
