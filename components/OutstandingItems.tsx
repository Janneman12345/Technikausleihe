
import React from 'react';
import { Transaction } from '../types';

interface OutstandingItemsProps {
  items: Transaction[];
}

const OutstandingItems: React.FC<OutstandingItemsProps> = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <div className="space-y-4 mb-8 animate-fade-in">
      <div className="flex items-center space-x-2">
        <span className="w-2 h-2 bg-[#f5ff00] rounded-full animate-pulse"></span>
        <h2 className="text-sm font-black uppercase tracking-widest text-[#f5ff00]">Aktuell verliehen</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-[#3d3b3c] border border-[#f5ff00]/10 rounded-xl p-4 flex items-center space-x-4 shadow-lg hover:border-[#f5ff00]/30 transition-colors">
            {item.photo ? (
              <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 border border-[#f5ff00]/10 bg-black">
                <img src={item.photo} alt={item.item} className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="h-16 w-16 rounded-lg bg-[#333132] flex items-center justify-center flex-shrink-0 border border-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <div className="flex-grow min-w-0">
              <h4 className="text-white font-bold truncate">{item.item}</h4>
              <p className="text-[10px] text-[#f5ff00] font-medium uppercase tracking-tighter">Seit {new Date(item.date).toLocaleDateString('de-DE')}</p>
              {item.remarks && (
                <p className="text-xs text-gray-400 truncate italic mt-0.5">"{item.remarks}"</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutstandingItems;
