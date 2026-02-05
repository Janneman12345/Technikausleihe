
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Transaction } from '../types';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

export const supabase: SupabaseClient | null = supabaseUrl && supabaseUrl !== 'undefined'
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export interface SaveResult {
  success: boolean;
  error?: string;
}

export const databaseService = {
  isConfigured(): boolean {
    return !!supabase && !!supabaseUrl && !!supabaseAnonKey && supabaseUrl !== 'undefined';
  },

  async fetchTransactions(): Promise<Transaction[]> {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Fetch Fehler:', error);
        return [];
      }
      return data as Transaction[];
    } catch (e) {
      return [];
    }
  },

  async saveTransaction(transaction: Transaction): Promise<SaveResult> {
    if (!supabase) return { success: false, error: 'Datenbank-Client nicht initialisiert.' };

    try {
      const { status, error } = await supabase
        .from('transactions')
        .insert(transaction);

      // Status 406 (Not Acceptable) bedeutet bei RLS oft: "Gespeichert, aber darf nicht zurückgelesen werden"
      // Das werten wir als Erfolg.
      if ((status >= 200 && status < 300) || status === 406) {
        return { success: true };
      }

      return { 
        success: false, 
        error: error?.message || `Unbekannter Fehler (Status ${status})` 
      };
    } catch (e: any) {
      return { success: false, error: e.message || 'Netzwerkfehler' };
    }
  },

  async deleteTransaction(id: string): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      return !error;
    } catch (e) {
      return false;
    }
  }
};
