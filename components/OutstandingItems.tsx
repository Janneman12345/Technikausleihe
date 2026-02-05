
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
          <div key={item.id} className="bg-[#3d3b3c] border border-[#f5ff00]/10 rounded-xl p-4 flex items-center space-x-4 shadow-lg hover:border-[#f5ff00]/30 transition-all group">
            {item.photo ? (
              <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 border border-[#f5ff00]/10 bg-black">
                <img src={item.photo} alt={item.item} className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="h-16 w-16 rounded-lg bg-[#333132] flex items-center justify-center flex-shrink-0 border border-white/5 text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            )}
            <div className="flex-grow min-w-0">
              <h4 className="text-white font-bold truncate leading-tight">{item.item}</h4>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-[10px] font-black text-[#f5ff00] uppercase tracking-tighter bg-[#f5ff00]/10 px-1.5 py-0.5 rounded">
                  {item.person}
                </span>
                <span className="text-[10px] text-gray-500 font-medium">
                  seit {new Date(item.date).toLocaleDateString('de-DE')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutstandingItems;
