"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTransactions } from "@/hooks/useTransactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CirclePlus, PlusCircle, Trash2 } from "lucide-react";
import { useFormatters } from "@/hooks/useFormatters";
import { useCrypto } from "@/hooks/useCrypto";
import { Transaction } from "@/services/transactions.service";
import DeleteTransactionModal from "@/components/DeleteTransactionModal";
import { toast } from "sonner";
import Image from "next/image";
import NewTransactionModal from "@/components/NewTransactionModal";
import TransactionFilter from "@/components/TransactionFilter";

export default function Transactions() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { 
    transactions, 
    isLoading: transactionsLoading, 
    error, 
    fetchTransactions,
    deleteTransaction
  } = useTransactions();
  const { cryptos, isLoading: cryptoLoading } = useCrypto();
  const { formatCurrency, formatCrypto, formatPercentage } = useFormatters();
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCryptos, setSelectedCryptos] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<('BUY' | 'SELL')[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions();
    }
  }, [isAuthenticated, fetchTransactions]);

  const handleDeleteTransaction = (transactionId: string) => {
    setTransactionToDelete(transactionId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!transactionToDelete) return;
    
    try {
      await deleteTransaction(transactionToDelete);
      toast.success("Transaction deleted successfully!");
      setIsDeleteModalOpen(false);
      setTransactionToDelete(null);
    } catch {
      toast.error("Failed to delete transaction. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
    setTransactionToDelete(null);
  };

  // Calculate unique cryptos for filter
  const uniqueCryptos = transactions?.reduce((acc, transaction) => {
    const existing = acc.find(crypto => crypto.symbol === transaction.crypto_symbol);
    if (existing) {
      existing.count++;
    } else {
      acc.push({
        symbol: transaction.crypto_symbol,
        name: transaction.crypto_name,
        count: 1
      });
    }
    return acc;
  }, [] as Array<{ symbol: string; name: string; count: number }>) || [];

  // Filter transactions based on selected cryptos and types
  const filteredTransactions = (transactions || []).filter(transaction => {
    const cryptoMatch = selectedCryptos.length === 0 || selectedCryptos.includes(transaction.crypto_symbol);
    const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(transaction.transaction_type as 'BUY' | 'SELL');
    return cryptoMatch && typeMatch;
  });

  const calculateTransactionPnL = (transaction: Transaction) => {
    const transactionPrice = parseFloat(transaction.price_at_transaction);
    const quantity = parseFloat(transaction.crypto_quantity);
    const cryptoDetail = cryptos?.find(crypto => crypto.symbol === transaction.crypto_symbol);
    
    if (!cryptoDetail) {
      return { pnl: 0, pnlPercentage: 0, finalBalance: parseFloat(transaction.usd_amount) };
    }
    
    const currentPrice = parseFloat(cryptoDetail.price);
    
    if (transaction.transaction_type === 'BUY') {
      const pnl = (currentPrice - transactionPrice) * quantity;
      const pnlPercentage = ((currentPrice - transactionPrice) / transactionPrice) * 100;
      const finalBalance = parseFloat(transaction.usd_amount) + pnl;
      return { pnl, pnlPercentage, finalBalance };
    } else {
      const finalBalance = parseFloat(transaction.usd_amount);
      return { pnl: 0, pnlPercentage: 0, finalBalance };
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please log in to access your transactions.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-500">Error loading transactions: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    
    <div className="space-y-6">
      { isOpen && 
       <NewTransactionModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      />
    }
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">
            Your cryptocurrency buy and sell history
          </p>
        </div>
        <Button
            className="bg-gradient-to-r from-primary to-primary-glow text-muted dark:text-foreground hover:text-muted hover:scale-[1.03] transition-all cursor-pointer min-w-8 duration-200 ease-linear"
            onClick={() => {setIsOpen(true)}}
          >
            <CirclePlus />
            <span className="font-medium">New Transaction</span>
          </Button>
      </div>

      {transactionsLoading || cryptoLoading ? (
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2">Loading transactions...</p>
          </div>
        </div>
      ) : transactions.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">
              No transactions found. Start by adding your first cryptocurrency transaction.
            </p>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add First Transaction
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <TransactionFilter
            uniqueCryptos={uniqueCryptos}
            selectedCryptos={selectedCryptos}
            onSelectedCryptosChange={setSelectedCryptos}
            selectedTypes={selectedTypes}
            onSelectedTypesChange={setSelectedTypes}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>
                Transaction History
                {selectedCryptos.length > 0 && (
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    ({filteredTransactions.length} of {transactions.length} transactions)
                  </span>
                    )}
                  {transactions.length > 0 && (
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      ({transactions.length} transactions)
                    </span>
                  )}
              </CardTitle>
            </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Cryptocurrency</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Deposit/Withdrawal</TableHead>
                  <TableHead className="text-right">Price at Transaction</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">P&L</TableHead>
                  <TableHead className="text-right">P&L %</TableHead>
                  <TableHead className="text-right">Final Balance</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions
                  .sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime())
                  .map((transaction) => {
                    const { pnl, pnlPercentage, finalBalance } = calculateTransactionPnL(transaction);
                    
                    return (
                      <TableRow 
                        key={transaction.id}
                        className={transaction.transaction_type === 'SELL' ? 'bg-red-50 dark:bg-red-950/20' : ''}
                      >
                        <TableCell>
                          {new Date(transaction.transaction_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span><Image src={cryptos?.find(crypto => crypto.symbol === transaction.crypto_symbol)?.image_url || ''} alt={transaction.crypto_name} width={20} height={20} className="rounded-full" /></span>
                            <span className="font-medium">{transaction.crypto_name}</span>
                            <span className="text-sm text-muted-foreground">{transaction.crypto_symbol?.toUpperCase()}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.transaction_type === 'BUY'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          }`}>
                            {transaction.transaction_type}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-mono font-medium">
                          {formatCurrency(parseFloat(transaction.usd_amount))}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(parseFloat(transaction.price_at_transaction))}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCrypto(parseFloat(transaction.crypto_quantity), transaction.crypto_symbol?.toUpperCase() || '')}
                        </TableCell>
                        <TableCell className="text-right font-mono font-medium">
                          {transaction.transaction_type === 'SELL' ? (
                            <span className="inline-flex items-center gap-1 text-sm px-2 py-0.5 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                              $0.00
                            </span>
                          ) : (
                            <span className={`inline-flex items-center gap-1 text-sm px-2 py-0.5 rounded-md ${
                              pnl > 0 
                                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                                : pnl < 0 
                                ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                            }`}>
                              {formatCurrency(pnl)}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-mono font-medium">
                          {transaction.transaction_type === 'SELL' ? (
                            <span className="inline-flex items-center gap-1 text-sm px-2 py-0.5 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                              0.00%
                            </span>
                          ) : (
                            <span className={`inline-flex items-center gap-1 text-sm px-2 py-0.5 rounded-md ${
                          pnlPercentage > 0 
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                            : pnlPercentage < 0 
                            ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                              }`}>
                              {formatPercentage(pnlPercentage)}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-mono font-medium">
                          {formatCurrency(finalBalance)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTransaction(transaction.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
            
            {filteredTransactions.length === 0 && transactions.length > 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No transactions found matching the current filter
              </div>
            )}
          </CardContent>
        </Card>
        </>
      )}

      <DeleteTransactionModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        isLoading={transactionsLoading}
      />
    </div>
  );
}
