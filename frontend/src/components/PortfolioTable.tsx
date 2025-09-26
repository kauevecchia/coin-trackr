"use client";

import { PortfolioCrypto } from "@/hooks/usePortfolio";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { ChevronDownIcon, ChevronUpIcon, DollarSign, Banknote, TrendingUp } from "lucide-react";
import { useFormatters } from "@/hooks/useFormatters";
import { motion } from "framer-motion";
import { StaggerContainer } from "@/components/PageTransition";

interface PortfolioTableProps {
  portfolio: PortfolioCrypto[];
  isLoading?: boolean;
  onCryptoClick?: (cryptoSymbol: string) => void;
}

export function PortfolioTable({ portfolio, isLoading = false, onCryptoClick }: PortfolioTableProps) {
  const { formatCurrency, formatCrypto, formatPercentage, getPnLColorClass } = useFormatters();

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-8">
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
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (portfolio.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-8">
              <motion.p 
                className="text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                No cryptocurrencies in your portfolio yet. Start by adding your first transaction.
              </motion.p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const totalPortfolioValue = portfolio.reduce((sum, crypto) => sum + crypto.currentValue, 0);
  const totalInvested = portfolio.reduce((sum, crypto) => sum + crypto.totalInvested, 0);
  const totalUnrealizedPnL = portfolio.reduce((sum, crypto) => sum + crypto.unrealizedPnL, 0);
  const totalUnrealizedPnLPercentage = totalInvested > 0 ? (totalUnrealizedPnL / totalInvested) * 100 : 0;

  return (
    <div className="space-y-6">
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
                {formatCurrency(totalPortfolioValue)}
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
                className={`text-2xl font-semibold flex items-center gap-2 ${getPnLColorClass(totalUnrealizedPnL)}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                {formatCurrency(totalUnrealizedPnL)} 
                <motion.span 
                  className={`text-sm px-1.5 py-0.5 rounded-lg bg-opacity-10 ${
                          totalUnrealizedPnL > 0 
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                            : totalUnrealizedPnL < 0 
                            ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        } ${getPnLColorClass(totalUnrealizedPnLPercentage)}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                >
                  {formatPercentage(totalUnrealizedPnLPercentage)}
                </motion.span>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </StaggerContainer>
    
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <CardTitle>Holdings</CardTitle>
            </motion.div>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="overflow-hidden"
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Cryptocurrency</TableHead>
                    <TableHead className="text-right">Current Price</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Total Invested</TableHead>
                    <TableHead className="text-right">Current Value</TableHead>
                    <TableHead className="text-right">Avg. Cost</TableHead>
                    <TableHead className="text-right">Unrealized P&L</TableHead>
                    <TableHead className="text-right">Unrealized P&L %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portfolio.map((crypto, index) => (
                    <motion.tr
                      key={crypto.symbol}
                      className={`${onCryptoClick ? "cursor-pointer hover:bg-muted/50" : ""} transition-colors duration-200`}
                      onClick={() => onCryptoClick?.(crypto.symbol)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ 
                        delay: 1.2 + index * 0.1, 
                        duration: 0.3,
                        ease: "easeOut"
                      }}
                    >
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {crypto.image_url && (
                        <div className="relative h-8 w-8">
                          <Image
                            src={crypto.image_url}
                            alt={crypto.name}
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{crypto.name}</div>
                        <div className="text-sm text-muted-foreground">{crypto.symbol.toUpperCase()}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(crypto.currentPrice)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCrypto(crypto.quantity, crypto.symbol.toUpperCase())}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(crypto.totalInvested)}
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium">
                    {formatCurrency(crypto.currentValue)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(crypto.averageCost)}
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium">
                    <span className={`inline-flex items-center gap-1 text-sm px-2 py-0.5 rounded-md ${
                      crypto.unrealizedPnL > 0 
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                        : crypto.unrealizedPnL < 0 
                        ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}>
                      {formatCurrency(crypto.unrealizedPnL)}
                      {crypto.unrealizedPnL > 0 && (
                        <ChevronUpIcon className="w-3 h-3" />
                      )}
                      {crypto.unrealizedPnL < 0 && (
                        <ChevronDownIcon className="w-3 h-3" />
                      )}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium">
                    <span className={`inline-flex items-center gap-1 text-sm px-2 py-0.5 rounded-md ${
                      crypto.unrealizedPnLPercentage > 0 
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                        : crypto.unrealizedPnLPercentage < 0 
                        ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}>
                      {formatPercentage(crypto.unrealizedPnLPercentage)}
                      {crypto.unrealizedPnLPercentage > 0 && (
                        <ChevronUpIcon className="w-3 h-3" />
                      )}
                      {crypto.unrealizedPnLPercentage < 0 && (
                        <ChevronDownIcon className="w-3 h-3" />
                      )}
                    </span>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      </CardContent>
    </Card>
  </motion.div>
    </div>
  );
}