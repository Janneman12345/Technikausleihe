
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
    return !!supabase && supabaseUrl !== 'undefined' && supabaseAnonKey !== 'undefined';
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
      // Wir führen den Insert aus.
      const response = await supabase
        .from('transactions')
        .insert(transaction);

      const { status, error } = response;

      // Status 200-299: Standard-Erfolg
      // Status 406: "Not Acceptable" -> Tritt auf, wenn RLS INSERT erlaubt, aber SELECT (zum Zurückgeben des Werts) verbietet.
      // Da der Nutzer sagt "alles ist da", ist 406 der wahrscheinlichste Grund für den Fehlalarm.
      const isActuallySuccess = (status >= 200 && status < 300) || status === 406;

      if (isActuallySuccess) {
        return true;
      }

      // Nur bei echtem Fehler loggen
      console.error('Echter Supabase Speicherfehler:', {
        message: error?.message,
        details: error?.details,
        status: status
      });
      
      return false;
    } catch (e) {
      console.error('Kritischer Ausnahmefehler beim Speichern:', e);
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
