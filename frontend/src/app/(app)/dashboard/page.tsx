"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CryptoPortfolioCard } from "@/components/CryptoPortfolioCard";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useTransactionsContext } from "@/contexts/TransactionsContext";
import { useCrypto } from "@/hooks/useCrypto";
import { Button } from "@/components/ui/button";
import { CirclePlus, DollarSign, Banknote, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { NewTransactionModal } from "@/components/NewTransactionModal";
import { useFormatters } from "@/hooks/useFormatters";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { transactions, isLoading: transactionsLoading, fetchTransactions } = useTransactionsContext();
  const { cryptos: cryptoDetails, isLoading: cryptoLoading } = useCrypto();
  const { formatCurrency, formatPercentage, getPnLColorClass } = useFormatters();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions();
    }
  }, [isAuthenticated, fetchTransactions]);

  const portfolio = usePortfolio(transactions || [], cryptoDetails || []);

  const totalInvested = portfolio.reduce((acc, crypto) => acc + crypto.totalInvested, 0);
  const totalValue = portfolio.reduce((acc, crypto) => acc + crypto.currentValue, 0);
  const totalPnL = totalValue - totalInvested;
  const totalPnLPercentage = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  if (isLoading || transactionsLoading || cryptoLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please log in to access the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <NewTransactionModal 
        isOpen={isOpen} 
        onOpenChange={setIsOpen}
      />
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.name}!
        </p>
      </div>

      <div className="flex flex-col md:flex-row flex-grow gap-4">
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-muted-foreground font-normal">Total Invested</CardTitle>
            <DollarSign className="size-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{formatCurrency(totalInvested)}</div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-muted-foreground font-normal">Current Value</CardTitle>
            <Banknote className="size-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{formatCurrency(totalValue)}</div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-muted-foreground font-normal">Unrealized P&L</CardTitle>
            <TrendingUp className="size-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-semibold flex items-center gap-2 ${getPnLColorClass(totalPnL)}`}>
              {formatCurrency(totalPnL)} 
              <span className={`text-sm px-1.5 py-0.5 rounded-lg bg-opacity-10 ${
                      totalPnL > 0 
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                        : totalPnL < 0 
                        ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    } ${getPnLColorClass(totalPnLPercentage)}`}>{formatPercentage(totalPnLPercentage)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {portfolio && portfolio.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Portfolio Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {portfolio.map((crypto) => (
              <CryptoPortfolioCard key={crypto.symbol} crypto={crypto} />
            ))}
          </div>
        </div>
      )}

      {portfolio && portfolio.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <p className="text-lg mb-2">Your portfolio is empty</p>
            <p>Start by adding your first transaction!</p>
            <Button className="mt-4 bg-gradient-to-r from-primary to-primary-glow text-muted dark:text-foreground hover:text-muted hover:scale-[1.03] transition-all cursor-pointer min-w-8 duration-200 ease-linear" onClick={() => setIsOpen(true)}>
              <CirclePlus className="w-4 h-4" />
              New Transaction
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}