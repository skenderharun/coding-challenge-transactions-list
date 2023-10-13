export interface Transaction {
  gasLimit: string;
  gasPrice: string;
  to: string;
  from: string;
  value: string;
  data?: string;
  chainId: string;
  hash: string;
}

// harun:comment - Extending the global Window object to include a new method 'close' under the property 'HSOverlay',
// which accepts an HTMLInputElement as its parameter so Typescript doesnt yell at us
declare global {
  interface Window {
    HSOverlay: { close: (e: HTMLInputElement) => void };
  }
}

export interface TransactionsData {
  getAllTransactions: Transaction[];
}

export interface SingleTransactionData {
  getTransaction: Transaction;
}

export type Action<P> = {
  type: Actions,
  payload: P,
};

export enum Actions {
  SendTransaction = 'SEND_TRANSACTION',
};
