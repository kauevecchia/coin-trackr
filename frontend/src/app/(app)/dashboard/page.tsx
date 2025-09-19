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
import { motion } from "framer-motion";
import { StaggerContainer, FadeInUp, ScaleIn } from "@/components/PageTransition";

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
            Loading dashboard...
          </motion.p>
        </div>
      </motion.div>
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
      <FadeInUp>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.name}!
        </p>
      </FadeInUp>

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
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                {formatCurrency(totalInvested)}
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
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                {formatCurrency(totalValue)}
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
                className={`text-2xl font-semibold flex items-center gap-2 ${getPnLColorClass(totalPnL)}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                {formatCurrency(totalPnL)} 
                <motion.span 
                  className={`text-sm px-1.5 py-0.5 rounded-lg bg-opacity-10 ${
                          totalPnL > 0 
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                            : totalPnL < 0 
                            ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        } ${getPnLColorClass(totalPnLPercentage)}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                >
                  {formatPercentage(totalPnLPercentage)}
                </motion.span>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </StaggerContainer>

      {portfolio && portfolio.length > 0 && (
        <FadeInUp delay={0.4}>
          <h2 className="text-2xl font-bold mb-4">Portfolio Overview</h2>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {portfolio.map((crypto) => (
              <motion.div
                key={crypto.symbol}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <CryptoPortfolioCard crypto={crypto} />
              </motion.div>
            ))}
          </StaggerContainer>
        </FadeInUp>
      )}

      {portfolio && portfolio.length === 0 && (
        <ScaleIn>
          <div className="text-center py-12">
            <motion.div 
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.p 
                className="text-lg mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Your portfolio is empty
              </motion.p>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Start by adding your first transaction!
              </motion.p>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  className="mt-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80" 
                  onClick={() => setIsOpen(true)}
                >
                  <CirclePlus className="w-4 h-4" />
                  New Transaction
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </ScaleIn>
      )}
    </div>
  );
}