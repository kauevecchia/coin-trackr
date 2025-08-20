"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CryptoPortfolioCard } from "@/components/CryptoPortfolioCard";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useTransactionsContext } from "@/contexts/TransactionsContext";
import { useCrypto } from "@/hooks/useCrypto";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { useState, useEffect } from "react";
import { NewTransactionModal } from "@/components/NewTransactionModal";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { transactions, isLoading: transactionsLoading, fetchTransactions } = useTransactionsContext();
  const { cryptos: cryptoDetails, isLoading: cryptoLoading } = useCrypto();
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

      <div className="flex flex-col md:flex-row gap-4 flex-grow">
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalInvested.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Total amount invested in cryptocurrencies
            </p>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Current value of your portfolio
            </p>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total unrealized profit/loss
            </p>
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