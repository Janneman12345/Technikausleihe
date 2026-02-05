
export enum TransactionType {
  LOAN = 'Ausleihe',
  RETURN = 'Rückgabe'
}

export interface Transaction {
  id: string;
  type: TransactionType;
  date: string;
  item: string;
  person: string;
  remarks: string;
  photo?: string;
  timestamp: number;
}
