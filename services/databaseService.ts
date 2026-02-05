
import { createClient } from '@supabase/supabase-js';
import { Transaction } from '../types';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const databaseService = {
  async fetchTransactions(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Fehler beim Laden:', error);
      return [];
    }
    return data as Transaction[];
  },

  async saveTransaction(transaction: Transaction): Promise<boolean> {
    const { error } = await supabase
      .from('transactions')
      .insert([transaction]);

    if (error) {
      console.error('Fehler beim Speichern:', error);
      return false;
    }
    return true;
  },

  async deleteTransaction(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Fehler beim Löschen:', error);
      return false;
    }
    return true;
  }
};
