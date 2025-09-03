"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, Activity } from "lucide-react";
import { useFormatters } from "@/hooks/useFormatters";
import Image from "next/image";

interface PortfolioItem {
  symbol: string;
  currentValue: number;
  totalInvested: number;
  unrealizedPnL: number;
  unrealizedPnLPercentage: number;
  image_url: string;
  }

interface AnalyticsCardsProps {
  totalValue: number;
  totalInvested: number;
  totalPnL: number;
  totalPnLPercentage: number;
  cryptoCount: number;
  bestPerformer: PortfolioItem | null;
}

export function AnalyticsCards({
  totalValue,
  totalInvested,
  totalPnL,
  totalPnLPercentage,
  cryptoCount,
  bestPerformer
}: AnalyticsCardsProps) {
  const { formatCurrency, formatPercentage, getPnLColorClass } = useFormatters();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-muted-foreground font-normal">Total Return</CardTitle>
          <TrendingUp className="size-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-semibold ${getPnLColorClass(totalPnL)}`}>
            {formatPercentage(totalPnLPercentage)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {formatCurrency(totalPnL)} total P&L
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-muted-foreground font-normal">Diversification</CardTitle>
          <Target className="size-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{cryptoCount}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Cryptocurrencies held
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-muted-foreground font-normal">Portfolio Value</CardTitle>
          <Activity className="size-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{formatCurrency(totalValue)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {formatCurrency(totalInvested)} invested
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-muted-foreground font-normal">Best Performer</CardTitle>
          <TrendingUp className="size-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-semibold ${bestPerformer ? getPnLColorClass(bestPerformer.unrealizedPnL) : ''}`}>
            {bestPerformer ? formatPercentage(bestPerformer.unrealizedPnLPercentage) : 'N/A'}
          </div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
            {bestPerformer ? <Image src={bestPerformer.image_url} alt={bestPerformer.symbol} width={20} height={20} className="rounded-full" /> : null}
            {bestPerformer ? bestPerformer.symbol.toUpperCase() : 'No data'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}