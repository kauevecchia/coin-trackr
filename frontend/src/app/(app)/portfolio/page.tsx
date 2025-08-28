"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTransactionsContext } from "@/contexts/TransactionsContext";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useCrypto } from "@/hooks/useCrypto";
import { PortfolioTable } from "@/components/PortfolioTable";
import { CryptoDetails } from "@/components/CryptoDetails";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Portfolio() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { 
    transactions, 
    isLoading: transactionsLoading, 
    error, 
    fetchTransactions 
  } = useTransactionsContext();
  const { cryptos, isLoading: cryptoLoading, error: cryptoError } = useCrypto();
  const portfolio = usePortfolio(transactions, cryptos);

  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions();
    }
  }, [isAuthenticated, fetchTransactions]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please log in to access your portfolio.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-500">Error loading portfolio: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (cryptoError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-500">Error loading crypto data: {cryptoError}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isLoading = transactionsLoading || cryptoLoading;

  const handleCryptoClick = (cryptoSymbol: string) => {
    setSelectedCrypto(cryptoSymbol);
  };

  const handleBackToPortfolio = () => {
    setSelectedCrypto(null);
  };

  if (selectedCrypto) {
    const crypto = portfolio.find(p => p.symbol === selectedCrypto);
    
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-start gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBackToPortfolio}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Portfolio
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {crypto ? `${crypto.name} Details` : `${selectedCrypto.toUpperCase()} Details`}
            </h1>
            <p className="text-muted-foreground">
              Detailed view of your {selectedCrypto.toUpperCase()} holdings
            </p>
          </div>
        </div>

        <CryptoDetails 
          cryptoSymbol={selectedCrypto}
          cryptoDetails={cryptos || []}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Portfolio</h1>
        <p className="text-muted-foreground">
          Your cryptocurrency investments
        </p>
      </div>

      <PortfolioTable 
        portfolio={portfolio} 
        isLoading={isLoading}
        onCryptoClick={handleCryptoClick}
      />
    </div>
  );
}
