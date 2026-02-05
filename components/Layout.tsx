
import React, { useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  useEffect(() => {
    // Da Browser den Fullscreen-Modus nur nach einer echten Nutzerinteraktion erlauben,
    // hängen wir einen Listener an das Dokument, der beim ersten Klick triggert.
    const requestFullscreenOnInteraction = () => {
      const doc = document.documentElement;
      if (!document.fullscreenElement) {
        doc.requestFullscreen()
          .then(() => {
            console.debug("Vollbild aktiviert.");
          })
          .catch((err) => {
            console.debug(`Vollbild-Anfrage übersprungen: ${err.message}`);
          });
      }
      // Listener entfernen, damit er nur einmal ausgeführt wird
      window.removeEventListener('mousedown', requestFullscreenOnInteraction);
      window.removeEventListener('touchstart', requestFullscreenOnInteraction);
      window.removeEventListener('keydown', requestFullscreenOnInteraction);
    };

    window.addEventListener('mousedown', requestFullscreenOnInteraction);
    window.addEventListener('touchstart', requestFullscreenOnInteraction, { passive: true });
    window.addEventListener('keydown', requestFullscreenOnInteraction);

    return () => {
      window.removeEventListener('mousedown', requestFullscreenOnInteraction);
      window.removeEventListener('touchstart', requestFullscreenOnInteraction);
      window.removeEventListener('keydown', requestFullscreenOnInteraction);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#333132] text-white">
      {/* 
        Header ist vergrößert (py-14), scrollt mit (relative statt sticky), 
        und nutzt Safe-Area Insets für moderne Displays.
      */}
      <header className="bg-[#333132] border-b border-[#f5ff00]/10 text-white relative z-50 safe-top shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-14 flex flex-col items-center sm:items-start text-center sm:text-left space-y-6 sm:space-y-0">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5 group">
            <div className="p-4 bg-[#f5ff00] rounded-[2rem] shadow-[0_0_40px_rgba(245,255,0,0.25)] transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#333132]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812-1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-[#f5ff00] uppercase leading-none mb-2">
                Technik<span className="text-white ml-2">Ausleihe</span>
              </h1>
              <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-[0.2em] sm:tracking-[0.3em] opacity-80">
                Ausleih-Managment von Lausitz.Rocks
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Hauptinhalt mit verbessertem Padding */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-fade-in">
        {children}
      </main>
      
      <footer className="bg-[#2b292a] border-t border-[#f5ff00]/5 py-16 text-center safe-bottom">
        <div className="flex flex-col items-center space-y-4 opacity-40 hover:opacity-100 transition-opacity duration-500">
          <div className="flex items-center space-x-3">
            <div className="h-px w-6 bg-[#f5ff00]/30"></div>
            <p className="text-xs sm:text-sm text-gray-300 font-medium tracking-wide">
              Bei Problemen oder Feedback ganz einfach bei <span className="font-bold">Jan</span> melden! ;)
            </p>
            <div className="h-px w-6 bg-[#f5ff00]/30"></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
