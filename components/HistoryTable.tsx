import React from 'react';
import { Transaction, TransactionType } from '../types';

interface HistoryTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ transactions, onDelete }) => {
  return (
    <div className="bg-[#333132] rounded-2xl shadow-2xl border border-[#f5ff00]/20 overflow-hidden">
      <div className="bg-[#3d3b3c] border-b border-[#f5ff00]/20 px-6 py-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-[#f5ff00]">Verlauf</h2>
          <p className="text-sm text-gray-400">Zuletzt getätigte Buchungen.</p>
        </div>
        <div className="text-xs font-medium text-[#f5ff00]/60">
          Gesamt: {transactions.length}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#f5ff00]/10">
          <thead className="bg-[#3d3b3c]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Datum</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Bild</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Aktion</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Gegenstand</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Bemerkungen</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Optionen</th>
            </tr>
          </thead>
          <tbody className="bg-[#333132] divide-y divide-[#f5ff00]/5">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">
                  Noch keine Buchungen vorhanden.
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id} className="hover:bg-[#3d3b3c] transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(t.date).toLocaleDateString('de-DE')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {t.photo ? (
                      <div className="h-12 w-16 rounded overflow-hidden border border-[#f5ff00]/20 shadow-sm bg-black flex items-center justify-center">
                        <img src={t.photo} alt={t.item} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="h-12 w-16 rounded bg-[#3d3b3c] border border-[#f5ff00]/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      t.type === TransactionType.LOAN 
                        ? 'bg-[#f5ff00]/20 text-[#f5ff00]' 
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                    {t.item}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">
                    {t.remarks || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => onDelete(t.id)}
                      className="text-rose-500 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      Löschen
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTable;