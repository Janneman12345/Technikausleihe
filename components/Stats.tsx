
import React from 'react';
import { Transaction, TransactionType } from '../types';

interface StatsProps {
  transactions: Transaction[];
}

const Stats: React.FC<StatsProps> = ({ transactions }) => {
  // Ermittlung der aktuell verliehenen Gegenstände
  const statusMap = new Map<string, Transaction>();
  [...transactions].reverse().forEach(t => {
    statusMap.set(t.item, t);
  });
  
  const outstandingCount = Array.from(statusMap.values()).filter(t => t.type === TransactionType.LOAN).length;

  return (
    <div className="mb-6">
      <div className={`p-4 rounded-xl shadow-lg border transition-all duration-500 ${
        outstandingCount > 0 
          ? 'bg-[#3d3b3c] border-[#f5ff00]/30' 
          : 'bg-[#3d3b3c] border-emerald-500/20'
      }`}>
        <div className="flex items-center space-x-4">
          <div className={`p-2.5 rounded-lg shadow-inner ${
            outstandingCount > 0 ? 'bg-[#f5ff00]' : 'bg-emerald-500'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${outstandingCount > 0 ? 'text-[#333132]' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0116 0z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-0.5">Status</p>
            <h3 className={`text-lg font-black uppercase tracking-tight ${outstandingCount > 0 ? 'text-[#f5ff00]' : 'text-emerald-400'}`}>
              {outstandingCount > 0 
                ? `${outstandingCount} ${outstandingCount === 1 ? 'Teil' : 'Teile'} im Umlauf` 
                : 'Lager vollständig'}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
