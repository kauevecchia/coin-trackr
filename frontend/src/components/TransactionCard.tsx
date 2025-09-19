"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { Transaction } from "@/services/transactions.service";
import { useFormatters } from "@/hooks/useFormatters";

interface TransactionCardProps {
  transaction: Transaction;
  index: number;
  pnl: number;
  pnlPercentage: number;
  finalBalance: number;
  cryptoImageUrl?: string;
  onDelete: (transactionId: string) => void;
}

export default function TransactionCard({
  transaction,
  index,
  pnl,
  pnlPercentage,
  finalBalance,
  cryptoImageUrl,
  onDelete,
}: TransactionCardProps) {
  const { formatCurrency, formatCrypto, formatPercentage } = useFormatters();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 + index * 0.1, duration: 0.3 }}
      className={`bg-card rounded-lg border p-4 ${
        transaction.transaction_type === 'SELL' 
          ? 'border-red-200 bg-red-50/30 dark:border-red-800 dark:bg-red-950/30' 
          : 'hover:shadow-md'
      } transition-all duration-200`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <Image 
            src={cryptoImageUrl || ''} 
            alt={transaction.crypto_name} 
            width={32} 
            height={32} 
            className="rounded-full" 
          />
          <div>
            <div className="font-medium text-base">{transaction.crypto_name}</div>
            <div className="text-sm text-muted-foreground">
              {transaction.crypto_symbol?.toUpperCase()}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            transaction.transaction_type === 'BUY'
              ? 'bg-green-200/60 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-200/60 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {transaction.transaction_type}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(transaction.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="space-y-1">
          <div className="text-muted-foreground">Date</div>
          <div className="font-medium">
            {new Date(transaction.transaction_date).toLocaleDateString()}
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-muted-foreground">Amount</div>
          <div className="font-mono font-medium">
            {formatCurrency(parseFloat(transaction.usd_amount))}
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-muted-foreground">Quantity</div>
          <div className="font-mono">
            {formatCrypto(parseFloat(transaction.crypto_quantity), transaction.crypto_symbol?.toUpperCase() || '')}
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-muted-foreground">Price</div>
          <div className="font-mono">
            {formatCurrency(parseFloat(transaction.price_at_transaction))}
          </div>
        </div>
      </div>

      {/* P&L Section */}
      {transaction.transaction_type === 'BUY' && (
        <div className="mt-4 pt-3 border-t border-border/50">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <div className="text-muted-foreground text-sm">Profit & Loss</div>
              <div className={`font-mono font-medium ${
                pnl > 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : pnl < 0 
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-muted-foreground'
              }`}>
                {formatCurrency(pnl)} ({formatPercentage(pnlPercentage)})
              </div>
            </div>
            <div className="space-y-1 text-right">
              <div className="text-muted-foreground text-sm">Current Value</div>
              <div className="font-mono font-medium">
                {formatCurrency(finalBalance)}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}