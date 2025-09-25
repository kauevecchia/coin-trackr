"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTransactionsContext } from "@/contexts/TransactionsContext";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useCrypto } from "@/hooks/useCrypto";
import { usePriceUpdates } from "@/hooks/usePriceUpdates";
import ConnectionStatus from "@/components/ConnectionStatus";
import { PortfolioTable } from "@/components/PortfolioTable";
import { CryptoDetails } from "@/components/CryptoDetails";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { FadeInUp } from "@/components/PageTransition";

const Portfolio = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { 
    transactions, 
    isLoading: transactionsLoading, 
    error, 
    fetchTransactions 
  } = useTransactionsContext();
  const { cryptos, isLoading: cryptoLoading, error: cryptoError, refetch: refetchCryptos } = useCrypto();
  const portfolio = usePortfolio(transactions, cryptos);
  const { isConnected, connectionError, lastUpdateTime } = usePriceUpdates(refetchCryptos);

  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions();
    }
  }, [isAuthenticated, fetchTransactions]);

  if (authLoading) {
    return (
      <motion.div 
        className="flex items-center justify-center min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          <motion.div 
            className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p 
            className="mt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Loading portfolio...
          </motion.p>
        </div>
      </motion.div>
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
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBackToPortfolio}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Portfolio
            </Button>
          </motion.div>
          <FadeInUp delay={0.2}>
            <h1 className="text-3xl font-bold">
              {crypto ? `${crypto.name} Details` : `${selectedCrypto.toUpperCase()} Details`}
            </h1>
            <p className="text-muted-foreground">
              Detailed view of your {selectedCrypto.toUpperCase()} holdings
            </p>
          </FadeInUp>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <CryptoDetails 
            cryptoSymbol={selectedCrypto}
            cryptoDetails={cryptos || []}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FadeInUp>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold">Portfolio</h1>
            <p className="text-muted-foreground">
              Your cryptocurrency investments
            </p>
          </div>
          <ConnectionStatus
            isConnected={isConnected}
            connectionError={connectionError}
            lastUpdateTime={lastUpdateTime}
            className="self-start sm:self-center"
          />
        </div>
      </FadeInUp>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <PortfolioTable 
          portfolio={portfolio} 
          isLoading={isLoading}
          onCryptoClick={handleCryptoClick}
        />
      </motion.div>
    </div>
  );
}

export default Portfolio;
