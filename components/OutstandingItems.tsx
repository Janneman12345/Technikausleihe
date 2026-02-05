
import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';

interface OutstandingItemsProps { items: Transaction[]; }

const OutstandingItems: React.FC<OutstandingItemsProps> = ({ items }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedImage]);

  if (items.length === 0) return null;

  return (
    <div className="space-y-4 mb-8 animate-fade-in">
      <div className="flex items-center space-x-2">
        <span className="w-2 h-2 bg-[#f5ff00] rounded-full animate-pulse"></span>
        <h2 className="text-sm font-black uppercase tracking-widest text-[#f5ff00]">Aktuell verliehen</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-[#3d3b3c] border border-[#f5ff00]/10 rounded-2xl p-4 flex flex-col space-y-4 shadow-xl transition-all group overflow-hidden hover:border-[#f5ff00]/40 hover:shadow-[0_0_30px_rgba(245,255,0,0.05)]">
            <div className="flex items-start space-x-5">
              {item.photo ? (
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(item.photo || null);
                  }}
                  className="h-24 w-24 rounded-xl overflow-hidden flex-shrink-0 border-2 border-[#f5ff00]/10 bg-black cursor-zoom-in hover:border-[#f5ff00] transition-all shadow-2xl relative"
                >
                  <img src={item.photo} alt={item.item} className="h-full w-full object-cover pointer-events-none transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                </div>
              ) : (
                <div className="h-24 w-24 rounded-xl bg-[#333132] flex items-center justify-center flex-shrink-0 border border-white/5 text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              )}
              <div className="flex-grow min-w-0 pt-1">
                <h4 className="text-white text-lg font-black truncate leading-tight tracking-tight mb-1">{item.item}</h4>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black text-[#333132] uppercase tracking-tighter bg-[#f5ff00] px-2 py-0.5 rounded">
                      {item.person}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    Seit {new Date(item.date).toLocaleDateString('de-DE')}
                  </span>
                </div>
              </div>
            </div>

            {item.handlingTip && (
              <div className="bg-emerald-500/10 border-l-2 border-emerald-500/40 p-3 rounded-r-lg">
                <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1 flex items-center">
                   <span className="mr-1.5">🛡️</span> Langlebigkeits-Check
                </p>
                <p className="text-xs text-white/90 leading-tight italic font-medium">"{item.handlingTip}"</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl transition-all animate-fade-in cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center pointer-events-none z-[110]">
            <div className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] hidden md:block pl-4">
              HD Detailansicht • Schließen mit ESC oder Klick
            </div>
            <button 
              className="p-4 bg-white/5 hover:bg-[#f5ff00] hover:text-[#333132] rounded-full transition-all text-white pointer-events-auto shadow-2xl border border-white/10"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="w-full h-full flex items-center justify-center p-2 md:p-8">
            <div className="relative max-w-full max-h-full flex items-center justify-center">
               <img 
                src={selectedImage} 
                alt="Großansicht" 
                className="max-w-[95vw] max-h-[90vh] object-contain rounded-lg shadow-[0_0_100px_rgba(0,0,0,1)] animate-zoom-in ring-1 ring-white/10"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          
          <div className="absolute bottom-10 left-0 right-0 text-center md:hidden pointer-events-none opacity-50">
            <span className="text-white text-[9px] font-black uppercase tracking-[0.3em] bg-white/5 px-4 py-2 rounded-full border border-white/10">
              Tippen zum Schließen
            </span>
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
