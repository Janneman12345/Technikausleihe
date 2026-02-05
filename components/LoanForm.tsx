
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
    if (!item || !person) {
      alert("Bitte wähle eine Person und einen Gegenstand aus.");
      return;
    }

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
    };

    setTimeout(() => {
      onAddTransaction(newTransaction);
      setItem('');
      setRemarks('');
      setPhoto(undefined);
      setInsight(null);
      // Wir lassen die Person ausgewählt, falls die gleiche Person mehrere Dinge ausleiht
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
        <p className="text-sm text-gray-400">Wer leiht was aus?</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Aktion</label>
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
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Wer bist du?</label>
          <select
            required
            value={person}
            onChange={(e) => setPerson(e.target.value)}
            className="w-full rounded-lg bg-[#3d3b3c] border-[#f5ff00]/30 text-white shadow-sm focus:border-[#f5ff00] focus:ring-[#f5ff00] sm:text-sm border px-3 py-2 outline-none appearance-none cursor-pointer"
          >
            <option value="" disabled>Name auswählen...</option>
            {PERSONS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Gegenstand</label>
          <input
            type="text"
            required
            placeholder="Was wird bewegt?"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            onBlur={handleItemBlur}
            className="w-full rounded-lg bg-[#3d3b3c] border-[#f5ff00]/30 text-white placeholder-gray-500 shadow-sm focus:border-[#f5ff00] focus:ring-[#f5ff00] sm:text-sm border px-3 py-2 outline-none"
          />
          {insight && (
            <div className="mt-2 p-3 bg-[#f5ff00]/10 rounded-lg border border-[#f5ff00]/30 flex items-start space-x-3 animate-fade-in">
              <div className="text-xs text-[#f5ff00] leading-relaxed">
                <p className="font-bold mb-0.5 uppercase tracking-wider">{insight.category}</p>
                <p>Tipp: {insight.quickGuide}</p>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Bemerkungen</label>
          <textarea
            rows={2}
            placeholder="Zubehör dabei? Zustand okay?"
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
                className="flex flex-col items-center justify-center border-2 border-dashed border-[#f5ff00]/20 rounded-xl py-4 hover:border-[#f5ff00] hover:bg-[#f5ff00]/5 transition-all group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 group-hover:text-[#f5ff00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812-1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="mt-1 text-[10px] text-gray-400 font-bold uppercase group-hover:text-[#f5ff00]">Kamera</span>
              </button>

              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="flex flex-col items-center justify-center border-2 border-dashed border-[#f5ff00]/20 rounded-xl py-4 hover:border-[#f5ff00] hover:bg-[#f5ff00]/5 transition-all group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 group-hover:text-[#f5ff00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="mt-1 text-[10px] text-gray-400 font-bold uppercase group-hover:text-[#f5ff00]">Galerie</span>
              </button>
            </div>
          ) : (
            <div className="relative group rounded-xl overflow-hidden border border-[#f5ff00]/30 bg-[#2b292a]">
              <img src={photo} alt="Preview" className="w-full h-32 object-contain" />
              <button
                type="button"
                onClick={removePhoto}
                className="absolute top-2 right-2 p-1 bg-rose-600 rounded-full shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold transition-all transform active:scale-[0.98] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'bg-[#f5ff00] text-[#333132] hover:opacity-90'}`}
        >
          {isSubmitting ? "Wird gespeichert..." : `${type} für ${person || '...'} bestätigen`}
        </button>
      </form>
    </div>
  );
};

export default LoanForm;
