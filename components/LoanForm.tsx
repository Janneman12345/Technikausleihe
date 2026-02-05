
import React, { useState, useEffect, useRef } from 'react';
import { TransactionType, Transaction, SmartTip } from '../types';
import { getSmartInsight } from '../services/geminiService';

interface LoanFormProps {
  onAddTransaction: (transaction: Transaction) => void;
}

const PERSONS = [
  "Beno", "Anne", "Julian", "Tadej", "Louisa", 
  "Latta", "Jamie", "Louis", "Jan"
].sort();

const LoanForm: React.FC<LoanFormProps> = ({ onAddTransaction }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.LOAN);
  const [person, setPerson] = useState('');
  const [item, setItem] = useState('');
  const [remarks, setRemarks] = useState('');
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [insight, setInsight] = useState<SmartTip | null>(null);
  
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // KI-Abfrage mit Debounce (1 Sekunde warten nach letztem Tastendruck)
  useEffect(() => {
    const trimmedItem = item.trim();
    if (trimmedItem.length < 3) {
      setInsight(null);
      setIsLoadingInsight(false);
      return;
    }

    setIsLoadingInsight(true);

    const timeoutId = setTimeout(async () => {
      try {
        const result = await getSmartInsight(trimmedItem);
        setInsight(result);
      } catch (err) {
        console.error("KI-Insight Fehler:", err);
      } finally {
        setIsLoadingInsight(false);
      }
    }, 1000); 

    return () => clearTimeout(timeoutId);
  }, [item]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhoto(undefined);
    if (galleryInputRef.current) galleryInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !person) return;

    setIsSubmitting(true);
    
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      date,
      item,
      person,
      remarks,
      photo,
      timestamp: Date.now(),
      category: insight?.category,
      safetyNote: insight?.safetyNote,
      quickGuide: insight?.quickGuide
    };

    setTimeout(() => {
      onAddTransaction(newTransaction);
      setItem('');
      setRemarks('');
      setPhoto(undefined);
      setInsight(null);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="bg-[#333132] rounded-2xl shadow-2xl border border-[#f5ff00]/20 overflow-hidden h-full">
      <div className="bg-[#3d3b3c] border-b border-[#f5ff00]/20 px-6 py-4">
        <h2 className="text-lg font-semibold text-[#f5ff00]">Neuer Vorgang</h2>
        <p className="text-sm text-gray-400">Gerät registrieren</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Modus</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TransactionType)}
              className="w-full rounded-xl bg-[#3d3b3c] border-[#f5ff00]/20 text-white shadow-sm focus:border-[#f5ff00] focus:ring-[#f5ff00] text-sm border px-4 py-3 outline-none appearance-none cursor-pointer"
            >
              <option value={TransactionType.LOAN}>📤 Ausleihe</option>
              <option value={TransactionType.RETURN}>📥 Rückgabe</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Datum</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl bg-[#3d3b3c] border-[#f5ff00]/20 text-white shadow-sm focus:border-[#f5ff00] focus:ring-[#f5ff00] text-sm border px-4 py-3 cursor-pointer outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Ansprechpartner</label>
          <select required value={person} onChange={(e) => setPerson(e.target.value)} className="w-full rounded-xl bg-[#3d3b3c] border-[#f5ff00]/20 text-white shadow-sm border px-4 py-3 outline-none appearance-none cursor-pointer">
            <option value="" disabled>Wer leiht aus?</option>
            {PERSONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Gegenstand</label>
          <input 
            type="text" 
            required 
            placeholder="z.B. Sony Kamera Alpha" 
            value={item} 
            onChange={(e) => setItem(e.target.value)} 
            className="w-full rounded-xl bg-[#3d3b3c] border-[#f5ff00]/30 text-white placeholder-gray-600 shadow-sm border px-4 py-3 outline-none focus:border-[#f5ff00]/60 transition-colors" 
          />
          
          {/* DEDIZIERTE SMART-INFO-AREA (Dauerhaft sichtbar, wechselnder Inhalt) */}
          <div className="mt-4 rounded-xl border border-white/5 bg-black/40 p-4 transition-all min-h-[100px] flex flex-col justify-center relative overflow-hidden group">
            {/* Dekoratives Element */}
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#f5ff00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>

            {isLoadingInsight ? (
              <div className="flex flex-col items-center space-y-3 py-2 animate-pulse">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-[#f5ff00] rounded-full"></div>
                  <div className="w-2 h-2 bg-[#f5ff00] rounded-full opacity-60"></div>
                  <div className="w-2 h-2 bg-[#f5ff00] rounded-full opacity-30"></div>
                </div>
                <span className="text-[10px] text-[#f5ff00] font-black uppercase tracking-[0.3em]">System Analyse läuft...</span>
              </div>
            ) : insight ? (
              <div className="animate-fade-in space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black text-[#f5ff00] uppercase tracking-widest bg-[#f5ff00]/10 px-2 py-1 rounded border border-[#f5ff00]/20">
                    {insight.category}
                  </span>
                  <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">KI Empfehlung</span>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-white leading-relaxed font-medium italic border-l-2 border-[#f5ff00]/30 pl-3">
                    "{insight.quickGuide}"
                  </p>
                  <div className="flex items-start space-x-2 text-rose-400 bg-rose-400/5 px-3 py-2 rounded-lg border border-rose-400/20">
                    <span className="text-xs mt-0.5">⚠️</span>
                    <p className="text-[10px] font-bold leading-snug">{insight.safetyNote}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.2em] mb-1">
                  {item.length < 3 ? "Warte auf Gerätenamen" : "Keine Smart-Infos verfügbar"}
                </p>
                <div className="h-0.5 w-12 bg-gray-800 mx-auto rounded-full"></div>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Notizen</label>
          <textarea rows={2} placeholder="Zustand? Akku voll? Kabel dabei?" value={remarks} onChange={(e) => setRemarks(e.target.value)} className="w-full rounded-xl bg-[#3d3b3c] border-[#f5ff00]/20 text-white placeholder-gray-600 border px-4 py-3 outline-none resize-none focus:border-[#f5ff00]/40" />
        </div>

        <div className="space-y-3 pt-2">
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Foto-Beweis</label>
          <input type="file" accept="image/*" ref={galleryInputRef} onChange={handleFileChange} className="hidden" />
          <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} onChange={handleFileChange} className="hidden" />

          {!photo ? (
            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => cameraInputRef.current?.click()} className="flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl py-6 hover:border-[#f5ff00]/40 hover:bg-[#f5ff00]/5 transition-all group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600 group-hover:text-[#f5ff00] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812-1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest group-hover:text-white">Kamera</span>
              </button>
              <button type="button" onClick={() => galleryInputRef.current?.click()} className="flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl py-6 hover:border-[#f5ff00]/40 hover:bg-[#f5ff00]/5 transition-all group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600 group-hover:text-[#f5ff00] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest group-hover:text-white">Galerie</span>
              </button>
            </div>
          ) : (
            <div className="relative group rounded-2xl overflow-hidden border-2 border-[#f5ff00]/30 bg-black/40">
              <img src={photo} alt="Vorschau" className="w-full h-40 object-cover opacity-80" />
              <button type="button" onClick={removePhoto} className="absolute top-3 right-3 p-2 bg-rose-600 rounded-full shadow-2xl text-white hover:scale-110 active:scale-90 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          )}
        </div>

        <button type="submit" disabled={isSubmitting} className={`w-full flex justify-center py-5 px-4 rounded-2xl shadow-[0_10px_30px_rgba(245,255,0,0.15)] text-sm font-black uppercase tracking-[0.2em] transition-all transform active:scale-[0.97] ${isSubmitting ? 'opacity-50 cursor-not-allowed bg-gray-600' : 'bg-[#f5ff00] text-[#333132] hover:shadow-[0_10px_40px_rgba(245,255,0,0.3)] hover:-translate-y-1'}`}>
          {isSubmitting ? "Wird verarbeitet..." : `${type} bestätigen`}
        </button>
      </form>
    </div>
  );
};

export default LoanForm;
