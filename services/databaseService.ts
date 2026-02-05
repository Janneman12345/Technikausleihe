
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Transaction } from '../types';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

// Wir initialisieren den Client nur, wenn die URL vorhanden ist.
export const supabase: SupabaseClient | null = supabaseUrl 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const databaseService = {
  isConfigured(): boolean {
    return !!supabase;
  },

  async fetchTransactions(): Promise<Transaction[]> {
    if (!supabase) return [];
    
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Supabase Fetch Fehler:', error);
        return [];
      }
      return data as Transaction[];
    } catch (e) {
      console.error('Netzwerkfehler beim Laden:', e);
      return [];
    }
  },

  async saveTransaction(transaction: Transaction): Promise<boolean> {
    if (!supabase) return false;

    try {
      // FIX: 'minimal' ist kein gültiger Wert für 'count'. In Supabase v2 ist das Standardverhalten 
      // bereits minimal (kein automatisches SELECT nach dem Einfügen), was RLS-Probleme vermeidet.
      const { status, error } = await supabase
        .from('transactions')
        .insert(transaction);

      // Ein Status-Code im 200er Bereich (200, 201, 204) bedeutet Erfolg.
      if (status >= 200 && status < 300) {
        return true;
      }

      // Falls ein Fehler auftritt, loggen wir ihn für die Entwicklerkonsole.
      if (error) {
        console.error('Supabase Save Fehler:', error.message, 'Status:', status);
      }
      
      return false;
    } catch (e) {
      console.error('Kritischer Netzwerkfehler beim Speichern:', e);
      return false;
    }
  },

  async deleteTransaction(id: string): Promise<boolean> {
    if (!supabase) return false;

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase Delete Fehler:', error);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Netzwerkfehler beim Löschen:', e);
      return false;
    }
  }
};
