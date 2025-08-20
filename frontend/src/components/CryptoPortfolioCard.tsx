import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { PortfolioCrypto } from "@/hooks/usePortfolio";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface CryptoPortfolioCardProps {
  crypto: PortfolioCrypto;
}

export const CryptoPortfolioCard = ({ crypto }: CryptoPortfolioCardProps) => {
  const router = useRouter();
  const isPositive = crypto.unrealizedPnL >= 0;

  const handleViewDetails = () => {
    router.push(`/portfolio?crypto=${crypto.symbol}`);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {crypto.image_url ? (
              <Image
                src={crypto.image_url}
                alt={crypto.name || "Crypto"}
                width={32}
                height={32}
                className="rounded-full"
                onError={() => console.log('Image failed to load:', crypto.image_url)}
              />
            ) : (
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <span className="text-xs font-medium">
                  {crypto.symbol?.slice(0, 2) || "??"}
                </span>
              </div>
            )}
            <div>
              <div className="font-medium">{crypto.name}</div>
              <div className="text-sm text-muted-foreground">{crypto.symbol}</div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Current Price</span>
          <span className="font-medium">${crypto.currentPrice.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Average Cost</span>
          <span className="font-medium">${crypto.averageCost.toFixed(2)}</span>
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Unrealized P&L</span>
            <div className="text-right">
              <div className={`flex items-center gap-1 font-medium ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                ${Math.abs(crypto.unrealizedPnL).toFixed(2)}
              </div>
              <div className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '+' : ''}{crypto.unrealizedPnLPercentage.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleViewDetails}
          className="w-full mt-4"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};