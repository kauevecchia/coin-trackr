import { useMemo } from 'react';
import { Transaction } from '@/services/transactions.service';
import { CryptoDetails } from '@/services/crypto.service';

export interface PortfolioCrypto {
  symbol: string;
  name: string;
  image_url: string | null;
  currentPrice: number;
  quantity: number;
  averageCost: number;
  totalInvested: number;
  currentValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercentage: number;
}

export const usePortfolio = (transactions: Transaction[], cryptoDetails: CryptoDetails[]) => {
  return useMemo(() => {
    if (!transactions || !cryptoDetails) {
      return [];
    }
    
    const cryptoGroups = transactions.reduce((acc, transaction) => {
      const symbol = transaction.crypto_symbol;
      if (!acc[symbol]) {
        acc[symbol] = [];
      }
      acc[symbol].push(transaction);
      return acc;
    }, {} as Record<string, Transaction[]>);

    const portfolio: PortfolioCrypto[] = Object.entries(cryptoGroups).map(([symbol, cryptoTransactions]) => {
      const cryptoDetail = cryptoDetails.find(crypto => crypto.symbol === symbol);
      
      if (!cryptoDetail) {
        console.warn(`Crypto details not found for symbol: ${symbol}`);
        return null;
      }

      let totalQuantity = 0;
      let totalInvested = 0;
      let totalQuantityBought = 0;
      let totalInvestedBought = 0;

      // First, calculate total bought
      cryptoTransactions.forEach(transaction => {
        const quantity = parseFloat(transaction.crypto_quantity);
        const usdAmount = parseFloat(transaction.usd_amount);

        if (transaction.transaction_type === 'BUY') {
          totalQuantityBought += quantity;
          totalInvestedBought += usdAmount;
        }
      });

      // Then calculate current holdings
      totalQuantity = totalQuantityBought;
      cryptoTransactions.forEach(transaction => {
        const quantity = parseFloat(transaction.crypto_quantity);

        if (transaction.transaction_type === 'SELL') {
          totalQuantity -= quantity;
        }
      });

      // Calculate invested amount for remaining holdings (proportional to what is left)
      if (totalQuantityBought > 0) {
        const remainingRatio = totalQuantity / totalQuantityBought;
        totalInvested = totalInvestedBought * remainingRatio;
      }

      if (totalQuantity <= 0) {
        return null;
      }

      const currentPrice = parseFloat(cryptoDetail.price);
      const averageCost = totalInvested / totalQuantity;
      const currentValue = totalQuantity * currentPrice;
      const unrealizedPnL = currentValue - totalInvested;
      const unrealizedPnLPercentage = (unrealizedPnL / totalInvested) * 100;

      return {
        symbol: cryptoDetail.symbol,
        name: cryptoDetail.name,
        image_url: cryptoDetail.image_url,
        currentPrice,
        quantity: totalQuantity,
        averageCost,
        totalInvested,
        currentValue,
        unrealizedPnL,
        unrealizedPnLPercentage
      };
    }).filter(Boolean) as PortfolioCrypto[];

    return portfolio;
  }, [transactions, cryptoDetails]);
};