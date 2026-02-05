
import React, { useState } from 'react';
import { Transaction } from '../types';

interface OutstandingItemsProps {
  items: Transaction[];
}

const OutstandingItems: React.FC<OutstandingItemsProps> = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState<Transaction | null>(null);

  if (items.length === 0) return null;

  return (
    <div className="space-y-4 mb-8 animate-fade-in">
      <div className="flex items-center space-x-2">
        <span className="w-2 h-2 bg-[#f5ff00] rounded-full animate-pulse"></span>
        <h2 className="text-sm font-black uppercase tracking-widest text-[#f5ff00]">Aktuell verliehen</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-[#3d3b3c] border border-[#f5ff00]/10 rounded-xl p-4 flex flex-col space-y-3 shadow-lg hover:border-[#f5ff00]/30 transition-all group">
            <div className="flex items-center space-x-4">
              {item.photo ? (
                <div 
                  onClick={() => setSelectedItem(item)}
                  className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 border border-[#f5ff00]/10 bg-black cursor-zoom-in group-hover:scale-105 transition-transform"
                >
                  <img src={item.photo} alt={item.item} className="h-full w-full object-cover" />
                </div>
              ) : (
                <div 
                  onClick={() => setSelectedItem(item)}
                  className="h-16 w-16 rounded-lg bg-[#333132] flex items-center justify-center flex-shrink-0 border border-white/5 text-gray-700 cursor-pointer"
                >
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

            {/* Smart Tip Preview in Card */}
            {(item.quickGuide || item.safetyNote) && (
              <div className="bg-black/20 rounded-lg p-2 text-[10px] border border-white/5">
                <div className="flex items-center text-[#f5ff00] font-bold uppercase tracking-wider mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Tipp
                </div>
                <p className="text-gray-400 leading-snug line-clamp-2 italic">
                  "{item.quickGuide || item.safetyNote}"
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Image Lightbox Modal with Details */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10 bg-black/95 backdrop-blur-xl animate-fade-in"
          onClick={() => setSelectedItem(null)}
        >
          <div className="relative max-w-5xl w-full h-full flex flex-col md:flex-row items-center justify-center gap-8">
            <button 
              className="absolute top-0 right-0 m-4 p-3 bg-white/10 hover:bg-[#f5ff00] hover:text-black rounded-full transition-all text-white z-[110]"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedItem(null);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="flex-1 w-full h-full flex items-center justify-center overflow-hidden">
              {selectedItem.photo ? (
                <img 
                  src={selectedItem.photo} 
                  alt={selectedItem.item} 
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-zoom-in"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <div className="text-gray-600 flex flex-col items-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                   <span>Kein Foto vorhanden</span>
                </div>
              )}
            </div>

            <div className="w-full md:w-80 flex flex-col space-y-6 text-left animate-fade-in" onClick={e => e.stopPropagation()}>
              <div>
                <h3 className="text-2xl font-black text-[#f5ff00] uppercase tracking-tight">{selectedItem.item}</h3>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">Ausgeliehen an {selectedItem.person}</p>
              </div>

              {selectedItem.safetyNote && (
                <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl">
                  <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    Sicherheitshinweis
                  </h4>
                  <p className="text-sm text-gray-200 leading-relaxed italic">"{selectedItem.safetyNote}"</p>
                </div>
              )}

              {selectedItem.quickGuide && (
                <div className="bg-[#f5ff00]/10 border border-[#f5ff00]/30 p-4 rounded-xl">
                  <h4 className="text-[10px] font-black text-[#f5ff00] uppercase tracking-widest mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 010-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414 0zM6.464 14.95a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.414z" /></svg>
                    Quick-Tipp
                  </h4>
                  <p className="text-sm text-gray-200 leading-relaxed italic">"{selectedItem.quickGuide}"</p>
                </div>
              )}

              {selectedItem.remarks && (
                <div className="border-t border-white/10 pt-4">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Anmerkungen</h4>
                  <p className="text-xs text-gray-400">{selectedItem.remarks}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes zoomIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-zoom-in {
          animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default OutstandingItems;
