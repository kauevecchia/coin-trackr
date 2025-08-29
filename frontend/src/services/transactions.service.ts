import { api } from "./api";

export interface Transaction {
  id: string;
  crypto_symbol: string;
  crypto_name: string;
  crypto_quantity: string;
  usd_amount: string;
  price_at_transaction: string;
  transaction_type: "BUY" | "SELL";
  transaction_date: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTransactionRequest {
  cryptoSymbol: string;
  cryptoQuantity: number;
  usdAmount: number;
  unitPriceAtTransaction: number;
  transactionDate: Date;
}

export interface CreateTransactionResponse {
  message: string;
  transaction: Transaction;
}

export const transactionsService = {
  async getUserTransactions(): Promise<Transaction[]> {
    const response = await api.get<{ transactions: Transaction[] }>("/transactions/list");
    return response.data.transactions;
  },

  async createBuyTransaction(data: CreateTransactionRequest): Promise<CreateTransactionResponse> {
    const response = await api.post<CreateTransactionResponse>("/transactions/buy", data);
    return response.data;
  },

  async createSellTransaction(data: CreateTransactionRequest): Promise<CreateTransactionResponse> {
    const response = await api.post<CreateTransactionResponse>("/transactions/sell", data);
    return response.data;
  },

  async deleteTransaction(transactionId: string): Promise<void> {
    await api.delete("/transactions/delete", {
      data: { transactionId }
    });
  }
}; 