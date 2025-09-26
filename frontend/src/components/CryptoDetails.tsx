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
import { motion } from "framer-motion"
import { StaggerContainer } from "@/components/PageTransition"

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent className="p-6 text-center">
              <motion.p 
                className="text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                No data found for {cryptoSymbol}. You may not have any holdings for this cryptocurrency.
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
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
      <motion.div 
        className="flex items-center space-x-4 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {selectedCrypto.image_url && (
          <motion.div 
            className="relative h-12 w-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Image
              src={selectedCrypto.image_url}
              alt={selectedCrypto.name}
              fill
              className="rounded-full object-cover"
            />
          </motion.div>
        )}
        <motion.div 
          className="flex flex-col gap-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-2">
            <motion.h1 
              className="text-2xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {selectedCrypto.name}
            </motion.h1>
            <motion.p 
              className="text-muted-foreground px-2 py-1 rounded-2xl bg-muted"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              {selectedCrypto.symbol.toUpperCase()}
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-2xl font-bold">{formatCurrency(selectedCrypto.currentPrice)}</div>
          </motion.div>
        </motion.div>
      </motion.div>

      <StaggerContainer className="flex flex-col md:flex-row flex-grow gap-4">
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="flex-1"
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-muted-foreground font-normal">Holdings</CardTitle>
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Wallet className="size-5 text-muted-foreground" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-2xl font-semibold"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                {formatCrypto(selectedCrypto.quantity, selectedCrypto.symbol.toUpperCase())}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="flex-1"
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-muted-foreground font-normal">Total Invested</CardTitle>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <DollarSign className="size-5 text-muted-foreground" />
                </motion.div>
              </CardHeader>
            <CardContent>
              <motion.div 
                className="text-2xl font-semibold"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                {formatCurrency(selectedCrypto.totalInvested)}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="flex-1"
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-muted-foreground font-normal">Current Value</CardTitle>
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Banknote className="size-5 text-muted-foreground" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-2xl font-semibold"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                {formatCurrency(selectedCrypto.currentValue)}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="flex-1"
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-muted-foreground font-normal">Unrealized P&L</CardTitle>
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <TrendingUp className="size-5 text-muted-foreground" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div 
                className={`text-2xl font-semibold flex items-center gap-2 ${getPnLColorClass(selectedCrypto.unrealizedPnL)}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                {formatCurrency(selectedCrypto.unrealizedPnL)} 
                <motion.span 
                  className={`text-sm px-1.5 py-0.5 rounded-lg bg-opacity-10 ${
                          selectedCrypto.unrealizedPnL > 0 
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                            : selectedCrypto.unrealizedPnL < 0 
                            ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        } ${getPnLColorClass(selectedCrypto.unrealizedPnLPercentage)}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                >
                  {formatPercentage(selectedCrypto.unrealizedPnLPercentage)}
                </motion.span>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="flex-1"
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-muted-foreground font-normal">Average Cost</CardTitle>
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Calculator className="size-5 text-muted-foreground" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-2xl font-semibold"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                {formatCurrency(selectedCrypto.averageCost)}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </StaggerContainer>
    
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              <CardTitle>Transaction History - {selectedCrypto.symbol}</CardTitle>
            </motion.div>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="overflow-hidden"
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
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
                  {transactions
                    .filter(transaction => transaction.crypto_symbol === cryptoSymbol)
                    .sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime())
                    .map((transaction, index) => {
                      const { pnl, pnlPercentage, finalBalance } = calculateTransactionPnL(transaction)
                      
                      return (
                        <motion.tr
                          key={transaction.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.3 + index * 0.05, duration: 0.3 }}
                          className={`${transaction.transaction_type === 'SELL' 
                            ? 'bg-red-100/70 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-950/60' 
                            : 'hover:bg-muted/50'
                          } transition-colors duration-200`}
                        >
                      <TableCell>
                        {new Date(transaction.transaction_date).toLocaleDateString()}
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
                        {formatCrypto(parseFloat(transaction.crypto_quantity), selectedCrypto.symbol.toUpperCase())}
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
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteTransaction(transaction.id)
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                        </motion.tr>
                      )
                    })}
                </TableBody>
              </Table>
              
              {transactions.filter(transaction => transaction.crypto_symbol === cryptoSymbol).length === 0 && (
                <motion.div 
                  className="text-center py-8 text-muted-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                >
                  No transactions found for {selectedCrypto.name}
                </motion.div>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <DeleteTransactionModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        isLoading={isLoading}
      />
    </div>
  )
}