
import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';

interface OutstandingItemsProps { items: Transaction[]; }

const OutstandingItems: React.FC<OutstandingItemsProps> = ({ items }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Schließen bei Druck auf die ESC-Taste
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="space-y-4 mb-8 animate-fade-in">
      <div className="flex items-center space-x-2">
        <span className="w-2 h-2 bg-[#f5ff00] rounded-full animate-pulse"></span>
        <h2 className="text-sm font-black uppercase tracking-widest text-[#f5ff00]">Aktuell verliehen</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-[#3d3b3c] border border-[#f5ff00]/10 rounded-xl p-4 flex flex-col space-y-3 shadow-lg transition-all group overflow-hidden">
            <div className="flex items-center space-x-4">
              {item.photo ? (
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(item.photo || null);
                  }}
                  className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 border border-[#f5ff00]/20 bg-black cursor-zoom-in hover:ring-2 ring-emerald-500 transition-all shadow-xl"
                >
                  <img src={item.photo} alt={item.item} className="h-full w-full object-cover pointer-events-none" />
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
          </div>
        ))}
      </div>

      {/* FULLSCREEN BILD-ZOOM MODAL - Z-INDEX FIX UND ZENTRIERUNG */}
      {selectedImage && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black/95 backdrop-blur-3xl animate-fade-in"
          style={{ zIndex: 10000 }} // Deutlich höher als der Header (z-50)
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
            
            {/* Das zentrierte Bild */}
            <div className="relative flex items-center justify-center max-w-full max-h-full">
              <img 
                src={selectedImage} 
                alt="Großansicht" 
                className="max-w-[95vw] max-h-[80vh] sm:max-w-[85vw] sm:max-h-[85vh] object-contain rounded-xl shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-zoom-in ring-1 ring-white/10"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Schließen Button - Unten Rechts */}
            <button 
              className="fixed bottom-8 right-8 flex items-center space-x-3 bg-white text-black px-8 py-4 rounded-full font-bold shadow-2xl hover:bg-[#f5ff00] transition-all transform active:scale-95 z-[10001] group"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <span className="text-sm uppercase tracking-widest">Schließen</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Hinweis für ESC-Taste am Desktop */}
            <div className="hidden sm:block absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 text-[10px] uppercase font-bold tracking-[0.4em] pointer-events-none">
              ESC zum Schließen
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes zoomIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-zoom-in {
          animation: zoomIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default OutstandingItems;
