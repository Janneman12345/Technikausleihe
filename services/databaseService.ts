
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
      // Wir senden den Insert-Befehl.
      // Falls RLS 'Insert' erlaubt aber 'Select' verbietet, gibt Supabase einen Fehler zurück,
      // obwohl die Daten gespeichert wurden. Wir prüfen daher primär den Status-Code.
      const response = await supabase
        .from('transactions')
        .insert([transaction]);

      // Status 201 bedeutet 'Created'. In diesem Fall ignorieren wir mögliche Fehler-Objekte,
      // die oft nur besagen, dass der Datensatz nicht zurückgelesen werden konnte.
      if (response.status === 201 || response.status === 200 || !response.error) {
        return true;
      }

      console.error('Supabase Save Fehler Details:', response.error, 'Status:', response.status);
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
