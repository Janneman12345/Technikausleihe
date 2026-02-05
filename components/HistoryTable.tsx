
import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';

interface HistoryTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ transactions, onDelete }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="bg-[#333132] rounded-2xl shadow-2xl border border-[#f5ff00]/20 overflow-hidden">
      <div className="bg-[#3d3b3c] border-b border-[#f5ff00]/20 px-6 py-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-[#f5ff00]">Verlauf</h2>
          <p className="text-sm text-gray-400">Zuletzt getätigte Buchungen.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#f5ff00]/10">
          <thead className="bg-[#3d3b3c]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Datum</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Person</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Aktion</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Gegenstand</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="bg-[#333132] divide-y divide-[#f5ff00]/5">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                  Noch keine Buchungen vorhanden.
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <React.Fragment key={t.id}>
                  <tr 
                    onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}
                    className="hover:bg-[#3d3b3c] transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">
                      {new Date(t.date).toLocaleDateString('de-DE')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#f5ff00]">
                      {t.person || 'Unbekannt'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        t.type === TransactionType.LOAN 
                          ? 'bg-[#f5ff00]/10 text-[#f5ff00]' 
                          : 'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      <span>{t.item}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(t.id); }}
                        className="text-rose-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Löschen
                      </button>
                    </td>
                  </tr>
                  {expandedId === t.id && (
                    <tr className="bg-[#2b292a] animate-fade-in">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="space-y-2">
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Bemerkungen</p>
                          <p className="text-sm text-gray-300 italic">{t.remarks || 'Keine Bemerkungen hinterlegt.'}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTable;
