import { useState, useCallback } from "react";
import { transactionsService, Transaction, CreateTransactionRequest } from "../services/transactions.service";

interface TransactionsState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

export const useTransactions = () => {
  const [state, setState] = useState<TransactionsState>({
    transactions: [],
    isLoading: false,
    error: null,
  });

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  const setTransactions = (transactions: Transaction[]) => {
    setState(prev => ({ ...prev, transactions, isLoading: false, error: null }));
  };

  const addTransaction = (transaction: Transaction) => {
    setState(prev => ({
      ...prev,
      transactions: [transaction, ...prev.transactions],
    }));
  };

  const removeTransaction = (transactionId: string) => {
    setState(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== transactionId),
    }));
  };

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const transactions = await transactionsService.getUserTransactions();
      setTransactions(transactions);
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to fetch transactions.";
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  }, []);

  const createBuyTransaction = useCallback(async (data: CreateTransactionRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await transactionsService.createBuyTransaction(data);
      addTransaction(response.transaction);
      setLoading(false);
      return response;
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to create buy transaction.";
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  }, []);

  const createSellTransaction = useCallback(async (data: CreateTransactionRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await transactionsService.createSellTransaction(data);
      addTransaction(response.transaction);
      setLoading(false);
      return response;
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to create sell transaction.";
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  }, []);

  const deleteTransaction = useCallback(async (transactionId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await transactionsService.deleteTransaction(transactionId);
      removeTransaction(transactionId);
      setLoading(false);
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to delete transaction.";
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  }, []);

  return {
    ...state,
    fetchTransactions,
    createBuyTransaction,
    createSellTransaction,
    deleteTransaction,
  };
}; 