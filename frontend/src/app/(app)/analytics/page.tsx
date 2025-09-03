"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTransactionsContext } from "@/contexts/TransactionsContext";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useCrypto } from "@/hooks/useCrypto";
import { AnalyticsCards } from "@/components/analytics/AnalyticsCards";
import { PortfolioDistributionChart } from "@/lib/recharts/PortfolioDistributionChart";
import { PnLChart } from "@/lib/recharts/PnLChart";
import { TradingSummary } from "@/components/analytics/TradingSummary";

const COLORS = [
  '#8b5cf6',
  '#06b6d4',
  '#f97316',
  '#3b82f6',
  '#ec4899',
  '#84cc16',
  '#6366f1',
  '#8b5b29',
  '#ef4444',
  '#10b981',
  '#14b8a6',
  '#f472b6',
  '#a78bfa',
  '#fbbf24',
  '#fb7185',
  '#34d399',
  '#60a5fa',
  '#a3a3a3',
  '#fde047',
  '#f59e0b',
  '#c084fc',
  '#67e8f9',
  '#fdba74',
  '#86efac',
  '#93c5fd',
  '#fda4af',
  '#fef3c7',
];

export default function Analytics() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { 
    transactions, 
    isLoading: transactionsLoading, 
    error, 
    fetchTransactions 
  } = useTransactionsContext();
  const { cryptos: cryptoDetails, isLoading: cryptoLoading } = useCrypto();

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

  const portfolioDistribution = portfolio.map((crypto, index) => ({
    name: crypto.symbol.toUpperCase(),
    value: crypto.currentValue,
    percentage: totalValue > 0 ? (crypto.currentValue / totalValue) * 100 : 0,
    color: COLORS[index % COLORS.length]
  }));

  const pnlData = portfolio.map((crypto) => ({
    name: crypto.symbol.toUpperCase(),
    pnl: crypto.unrealizedPnL,
    percentage: crypto.unrealizedPnLPercentage
  }));



  const buyTransactions = transactions?.filter(t => t.transaction_type === 'BUY') || [];
  const sellTransactions = transactions?.filter(t => t.transaction_type === 'SELL') || [];
  const totalTransactions = transactions?.length || 0;
  


  const cryptoCount = portfolio.length;
  
  const bestPerformer = portfolio.length > 0 
    ? portfolio.reduce((best, current) => 
        current.unrealizedPnLPercentage > best.unrealizedPnLPercentage ? current : best
      )
    : null;

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please log in to access analytics.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-500">Error loading analytics: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isLoading = transactionsLoading || cryptoLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (portfolio.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Portfolio insights and performance metrics
          </p>
        </div>
        
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              No data to analyze yet. Start by adding some transactions to see your portfolio analytics.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Portfolio insights and performance metrics
        </p>
      </div>

      <AnalyticsCards 
        totalValue={totalValue}
        totalInvested={totalInvested}
        totalPnL={totalPnL}
        totalPnLPercentage={totalPnLPercentage}
        cryptoCount={cryptoCount}
        bestPerformer={bestPerformer}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PortfolioDistributionChart data={portfolioDistribution} />
        <PnLChart data={pnlData} />
      </div>

      <TradingSummary 
        buyTransactions={buyTransactions.length}
        sellTransactions={sellTransactions.length}
        totalTransactions={totalTransactions}
      />
    </div>
  );
}