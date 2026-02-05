
import React, { useState } from 'react';
import { Transaction } from '../types';

interface OutstandingItemsProps { items: Transaction[]; }

const OutstandingItems: React.FC<OutstandingItemsProps> = ({ items }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
                  className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 border border-[#f5ff00]/20 bg-black cursor-zoom-in hover:ring-2 ring-emerald-500/50 transition-all shadow-xl"
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

            {/* Smart Tip in Card */}
            {(item.quickGuide || item.safetyNote) && (
              <div className="bg-emerald-500/5 rounded-lg p-2.5 text-[10px] border border-emerald-500/20">
                <div className="flex items-center text-emerald-400 font-bold uppercase tracking-wider mb-1">
                  <span className="mr-1">✨</span> Tipp
                </div>
                <p className="text-gray-400 leading-snug line-clamp-2 italic">
                  "{item.quickGuide || item.safetyNote}"
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* REINE BILD-LIGHTBOX */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-full max-h-full flex items-center justify-center">
            <button 
              className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-[#f5ff00] hover:text-black rounded-full transition-all text-white"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <img 
              src={selectedImage} 
              alt="Zoom" 
              className="max-w-[95vw] max-h-[85vh] object-contain rounded-lg shadow-2xl animate-zoom-in"
              onClick={(e) => e.stopPropagation()}
            />
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
