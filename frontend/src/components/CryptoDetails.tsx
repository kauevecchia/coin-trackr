"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Banknote, Calculator, DollarSign, Trash2, TrendingUp, Wallet } from "lucide-react"
import Image from "next/image"
import { useFormatters } from "@/hooks/useFormatters"
import { usePortfolio } from "@/hooks/usePortfolio"
import { useTransactionsContext } from "@/contexts/TransactionsContext"
import { Transaction } from "@/services/transactions.service"
import { CryptoDetails as CryptoDetailsType } from "@/services/crypto.service"
import DeleteTransactionModal from "@/components/DeleteTransactionModal"
import { useState } from "react"
import { toast } from "sonner"

interface CryptoDetailsProps {
  cryptoSymbol: string;
  cryptoDetails: CryptoDetailsType[];
}

export const CryptoDetails = ({ cryptoSymbol, cryptoDetails }: CryptoDetailsProps) => {
  const { formatCurrency, formatCrypto, formatPercentage, getPnLColorClass } = useFormatters()
  const { transactions, deleteTransaction, isLoading } = useTransactionsContext()
  
  const portfolio = usePortfolio(transactions, cryptoDetails)
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null)

  const selectedCrypto = portfolio.find(crypto => crypto.symbol === cryptoSymbol)
  
  if (!selectedCrypto) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              No data found for {cryptoSymbol}. You may not have any holdings for this cryptocurrency.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleDeleteTransaction = (transactionId: string) => {
    setTransactionToDelete(transactionId)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!transactionToDelete) return
    
    try {
      await deleteTransaction(transactionToDelete)
      toast.success("Transaction deleted successfully!")
      setIsDeleteModalOpen(false)
      setTransactionToDelete(null)
    } catch {
      toast.error("Failed to delete transaction. Please try again.")
    }
  }

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false)
    setTransactionToDelete(null)
  }

  const calculateTransactionPnL = (transaction: Transaction) => {
    const transactionPrice = parseFloat(transaction.price_at_transaction)
    const quantity = parseFloat(transaction.crypto_quantity)
    const currentPrice = selectedCrypto.currentPrice
    
    if (transaction.transaction_type === 'BUY') {
      // For BUY transactions, calculate unrealized P&L based on current price
      const pnl = (currentPrice - transactionPrice) * quantity
      const pnlPercentage = ((currentPrice - transactionPrice) / transactionPrice) * 100
      const finalBalance = parseFloat(transaction.usd_amount) + pnl
      return { pnl, pnlPercentage, finalBalance }
    } else {
      // For SELL transactions, don't calculate P&L as it's already realized
      // The final balance is just the amount received from the sale
      const finalBalance = parseFloat(transaction.usd_amount)
      return { pnl: 0, pnlPercentage: 0, finalBalance }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        {selectedCrypto.image_url && (
          <div className="relative h-12 w-12">
            <Image
              src={selectedCrypto.image_url}
              alt={selectedCrypto.name}
              fill
              className="rounded-full object-cover"
            />
          </div>
        )}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-bold">{selectedCrypto.name}</h1>
            <p className="text-muted-foreground px-2 py-1 rounded-2xl bg-muted">{selectedCrypto.symbol.toUpperCase()}</p>
          </div>
          <div>
            <div className="text-2xl font-bold">{formatCurrency(selectedCrypto.currentPrice)}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-grow gap-4">
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-muted-foreground font-normal">Holdings</CardTitle>
            <Wallet className="size-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{formatCrypto(selectedCrypto.quantity, selectedCrypto.symbol.toUpperCase())}</div>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-muted-foreground font-normal">Total Invested</CardTitle>
              <DollarSign className="size-5 text-muted-foreground" />
            </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{formatCurrency(selectedCrypto.totalInvested)}</div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-muted-foreground font-normal">Current Value</CardTitle>
            <Banknote className="size-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{formatCurrency(selectedCrypto.currentValue)}</div>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-muted-foreground font-normal">Unrealized P&L</CardTitle>
            <TrendingUp className="size-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-semibold flex items-center gap-2 ${getPnLColorClass(selectedCrypto.unrealizedPnL)}`}>
              {formatCurrency(selectedCrypto.unrealizedPnL)} 
              <span className={`text-sm px-1.5 py-0.5 rounded-lg bg-opacity-10 ${
                      selectedCrypto.unrealizedPnL > 0 
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                        : selectedCrypto.unrealizedPnL < 0 
                        ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                        : 'bg-gray-200 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400'
                    } ${getPnLColorClass(selectedCrypto.unrealizedPnLPercentage)}`}>{formatPercentage(selectedCrypto.unrealizedPnLPercentage)}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-muted-foreground font-normal">Average Cost</CardTitle>
            <Calculator className="size-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{formatCurrency(selectedCrypto.averageCost)}</div>
          </CardContent>
        </Card>
      </div>
    
      <Card>
        <CardHeader>
          <CardTitle>Transaction History - {selectedCrypto.symbol}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Investment</TableHead>
                <TableHead className="text-right">Price at Transaction</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">P&L</TableHead>
                <TableHead className="text-right">P&L %</TableHead>
                <TableHead className="text-right">Final Balance</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions
                .filter(transaction => transaction.crypto_symbol === cryptoSymbol)
                .sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime())
                .map((transaction) => {
                  const { pnl, pnlPercentage, finalBalance } = calculateTransactionPnL(transaction)
                  
                  return (
                    <TableRow 
                      key={transaction.id}
                      className={transaction.transaction_type === 'SELL' ? 'bg-red-200/60 hover:bg-red-200/70 dark:bg-red-950/30' : ''}
                    >
                      <TableCell>
                        {new Date(transaction.transaction_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.transaction_type === 'BUY'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-red-200/80 text-red-800 dark:bg-red-900/20 dark:text-red-400'
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
                        {formatCrypto(parseFloat(transaction.crypto_quantity), selectedCrypto.symbol.toUpperCase())}
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium">
                        {transaction.transaction_type === 'SELL' ? (
                          <span className="inline-flex items-center gap-1 text-sm px-2 py-0.5 rounded-md bg-gray-300/80 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400">
                            $0.00
                          </span>
                        ) : (
                          <span className={`inline-flex items-center gap-1 text-sm px-2 py-0.5 rounded-md ${
                            pnl > 0 
                              ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                              : pnl < 0 
                              ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                              : 'bg-gray-200 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400'
                          }`}>
                            {formatCurrency(pnl)}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium">
                        {transaction.transaction_type === 'SELL' ? (
                          <span className="inline-flex items-center gap-1 text-sm px-2 py-0.5 rounded-md bg-gray-300/80 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400">
                            0.00%
                          </span>
                        ) : (
                          <span className={`inline-flex items-center gap-1 text-sm px-2 py-0.5 rounded-md ${
                        pnlPercentage > 0 
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                          : pnlPercentage < 0 
                          ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                          : 'bg-gray-200 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400'
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
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteTransaction(transaction.id)
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
          
          {transactions.filter(transaction => transaction.crypto_symbol === cryptoSymbol).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No transactions found for {selectedCrypto.name}
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteTransactionModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        isLoading={isLoading}
      />
    </div>
  )
}