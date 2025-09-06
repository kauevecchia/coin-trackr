"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TradingSummaryProps {
  buyTransactions: number;
  sellTransactions: number;
  totalTransactions: number;
}

export function TradingSummary({ 
  buyTransactions, 
  sellTransactions, 
  totalTransactions 
}: TradingSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trading Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{buyTransactions}</div>
            <p className="text-sm text-muted-foreground">Buy Transactions</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{sellTransactions}</div>
            <p className="text-sm text-muted-foreground">Sell Transactions</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-sm text-muted-foreground">Total Transactions</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}