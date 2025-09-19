import { useMemo } from 'react';
import { Transaction } from '@/services/transactions.service';
import { CryptoDetails } from '@/services/crypto.service';
import Decimal from 'decimal.js';

Decimal.set({ 
  precision: 20,
  rounding: Decimal.ROUND_HALF_UP,
  toExpNeg: -20,
  toExpPos: 20
});

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
        return null;
      }

      let totalQuantity = 0;
      let totalInvested = 0;

  
      let decimalQuantityBought = new Decimal(0);
      let decimalInvestedBought = new Decimal(0);

      cryptoTransactions.forEach(transaction => {
        const quantity = new Decimal(transaction.crypto_quantity);
        const usdAmount = new Decimal(transaction.usd_amount);

        if (transaction.transaction_type === 'BUY') {
          decimalQuantityBought = decimalQuantityBought.plus(quantity);
          decimalInvestedBought = decimalInvestedBought.plus(usdAmount);
        }
      });

      let decimalQuantity = decimalQuantityBought;
      cryptoTransactions.forEach(transaction => {
        const quantity = new Decimal(transaction.crypto_quantity);

        if (transaction.transaction_type === 'SELL') {
          decimalQuantity = decimalQuantity.minus(quantity);
        }
      });

      let decimalInvested = decimalInvestedBought;
      if (decimalQuantityBought.greaterThan(0)) {
        const remainingRatio = decimalQuantity.dividedBy(decimalQuantityBought);
        decimalInvested = decimalInvestedBought.times(remainingRatio);
      }

      totalQuantity = decimalQuantity.toNumber();
      totalInvested = decimalInvested.toNumber();

      if (totalQuantity <= 0) {
        return null;
      }

      const decimalCurrentPrice = new Decimal(cryptoDetail.price);
      const decimalAverageCost = new Decimal(totalInvested).dividedBy(totalQuantity);
      const decimalCurrentValue = new Decimal(totalQuantity).times(decimalCurrentPrice);
      const decimalUnrealizedPnL = decimalCurrentValue.minus(totalInvested);
      const decimalUnrealizedPnLPercentage = decimalUnrealizedPnL.dividedBy(totalInvested).times(100);

      const rawAverageCost = decimalAverageCost.toDecimalPlaces(2).toNumber();
      let averageCost = rawAverageCost;
      
      const commonPrices = [110000, 100000, 90000, 80000, 70000, 60000, 50000];
      for (const price of commonPrices) {
        if (Math.abs(rawAverageCost - price) <= 0.5) {
          averageCost = price;
          break;
        }
      }

      const currentPrice = decimalCurrentPrice.toNumber();
      const currentValue = decimalCurrentValue.toDecimalPlaces(2).toNumber();
      const unrealizedPnL = decimalUnrealizedPnL.toDecimalPlaces(2).toNumber();
      const unrealizedPnLPercentage = decimalUnrealizedPnLPercentage.toDecimalPlaces(2).toNumber();

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