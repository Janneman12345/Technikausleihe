import React, { useState, useEffect, useRef } from 'react';
import { TransactionType, Transaction, SmartTip } from '../types';
import { getSmartInsight } from '../services/geminiService';

interface LoanFormProps {
  onAddTransaction: (transaction: Transaction) => void;
}

const LoanForm: React.FC<LoanFormProps> = ({ onAddTransaction }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.LOAN);
  const [item, setItem] = useState('');
  const [remarks, setRemarks] = useState('');
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [insight, setInsight] = useState<SmartTip | null>(null);
  
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  const handleItemBlur = async () => {
    if (item.trim().length > 2) {
      const result = await getSmartInsight(item);
      setInsight(result);
    } else {
      setInsight(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
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
    if (!item) return;

    setIsSubmitting(true);
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      date,
      item,
      remarks,
      photo,
      timestamp: Date.now(),
    };

    setTimeout(() => {
      onAddTransaction(newTransaction);
      setItem('');
      setRemarks('');
      setPhoto(undefined);
      setInsight(null);
      setDate(new Date().toISOString().split('T')[0]);
      setIsSubmitting(false);
    }, 400);
  };

  const formattedDisplayDate = () => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('de-DE', {
      weekday: 'short',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="bg-[#333132] rounded-2xl shadow-2xl border border-[#f5ff00]/20 overflow-hidden h-full">
      <div className="bg-[#3d3b3c] border-b border-[#f5ff00]/20 px-6 py-4">
        <h2 className="text-lg font-semibold text-[#f5ff00]">Neuer Vorgang</h2>
        <p className="text-sm text-gray-400">Erfasse hier deine neue Ausleihe oder Rückgabe.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Was möchtest du tun?</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TransactionType)}
              className="w-full rounded-lg bg-[#3d3b3c] border-[#f5ff00]/30 text-white shadow-sm focus:border-[#f5ff00] focus:ring-[#f5ff00] sm:text-sm border px-3 py-2 outline-none appearance-none cursor-pointer"
            >
              <option value={TransactionType.LOAN}>📤 Ausleihen</option>
              <option value={TransactionType.RETURN}>📥 Zurückgeben</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Datum</label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg bg-[#3d3b3c] border-[#f5ff00]/30 text-transparent shadow-sm focus:border-[#f5ff00] focus:ring-[#f5ff00] sm:text-sm border px-3 py-2 cursor-pointer font-mono outline-none"
              />
              <div className="absolute inset-0 flex items-center px-3 pointer-events-none text-sm text-white font-medium">
                {formattedDisplayDate()}
              </div>
              <div className="absolute right-3 inset-y-0 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#f5ff00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Gegenstand</label>
          <input
            type="text"
            required
            placeholder="Was leihst du gerade aus?"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            onBlur={handleItemBlur}
            className="w-full rounded-lg bg-[#3d3b3c] border-[#f5ff00]/30 text-white placeholder-gray-500 shadow-sm focus:border-[#f5ff00] focus:ring-[#f5ff00] sm:text-sm border px-3 py-2 outline-none"
          />
          {insight && (
            <div className="mt-2 p-3 bg-[#f5ff00]/10 rounded-lg border border-[#f5ff00]/30 flex items-start space-x-3 animate-fade-in">
              <div className="mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#f5ff00]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-xs text-[#f5ff00] leading-relaxed">
                <p className="font-bold mb-0.5 uppercase tracking-wider">{insight.category}</p>
                <p className="italic mb-1">Hinweis für dich: {insight.safetyNote}</p>
                <p>Tipp: {insight.quickGuide}</p>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Bemerkungen</label>
          <textarea
            rows={2}
            placeholder="Zustand, Zubehör oder Sonstiges?"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full rounded-lg bg-[#3d3b3c] border-[#f5ff00]/30 text-white placeholder-gray-500 shadow-sm focus:border-[#f5ff00] focus:ring-[#f5ff00] sm:text-sm border px-3 py-2 outline-none resize-none"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300 mb-1">Foto dokumentieren</label>
          
          <input type="file" accept="image/*" ref={galleryInputRef} onChange={handleFileChange} className="hidden" />
          <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} onChange={handleFileChange} className="hidden" />

          {!photo ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex flex-col items-center justify-center border-2 border-dashed border-[#f5ff00]/20 rounded-xl py-6 hover:border-[#f5ff00] hover:bg-[#f5ff00]/5 transition-all group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500 group-hover:text-[#f5ff00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812-1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="mt-2 text-xs text-gray-400 font-semibold uppercase tracking-tight group-hover:text-[#f5ff00]">Foto machen</span>
              </button>

              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="flex flex-col items-center justify-center border-2 border-dashed border-[#f5ff00]/20 rounded-xl py-6 hover:border-[#f5ff00] hover:bg-[#f5ff00]/5 transition-all group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500 group-hover:text-[#f5ff00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="mt-2 text-xs text-gray-400 font-semibold uppercase tracking-tight group-hover:text-[#f5ff00]">Aus Galerie</span>
              </button>
            </div>
          ) : (
            <div className="relative group rounded-xl overflow-hidden border border-[#f5ff00]/30 bg-[#2b292a]">
              <img src={photo} alt="Preview" className="w-full h-48 object-contain" />
              <div className="absolute inset-0 bg-[#333132]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="px-4 py-2 bg-[#f5ff00] text-[#333132] text-xs font-bold rounded-lg shadow hover:opacity-90 transition-opacity"
                >
                  Neu aufnehmen
                </button>
                <button
                  type="button"
                  onClick={removePhoto}
                  className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-lg shadow hover:bg-rose-700 transition-colors"
                >
                  Entfernen
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold transition-all transform active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f5ff00] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''} bg-[#f5ff00] text-[#333132] hover:opacity-90`}
        >
          {isSubmitting ? (
            <svg className="animate-spin h-5 w-5 text-[#333132]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            `${type} bestätigen`
          )}
        </button>
      </form>
    </div>
  );
};

export default LoanForm;