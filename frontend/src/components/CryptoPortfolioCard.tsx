import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { PortfolioCrypto } from "@/hooks/usePortfolio";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useFormatters } from "@/hooks/useFormatters";
import { motion } from "framer-motion";

interface CryptoPortfolioCardProps {
  crypto: PortfolioCrypto;
}

export const CryptoPortfolioCard = ({ crypto }: CryptoPortfolioCardProps) => {
  const router = useRouter();
  const { formatCurrency, formatPercentage, getPnLColorClass } = useFormatters();
  const isPositive = crypto.unrealizedPnL >= 0;

  const handleViewDetails = () => {
    router.push(`/portfolio?crypto=${crypto.symbol}`);
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {crypto.image_url ? (
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src={crypto.image_url}
                  alt={crypto.name || "Crypto"}
                  width={32}
                  height={32}
                  className="rounded-full"
                  onError={() => console.log('Image failed to load:', crypto.image_url)}
                />
              </motion.div>
            ) : (
              <motion.div 
                className="w-8 h-8 bg-muted rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-xs font-medium">
                  {crypto.symbol?.slice(0, 2) || "??"}
                </span>
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="font-medium">{crypto.name}</div>
              <div className="text-sm text-muted-foreground">{crypto.symbol}</div>
            </motion.div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <motion.div 
          className="flex justify-between items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-sm text-muted-foreground">Current Price</span>
          <motion.span 
            className="font-medium"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            {formatCurrency(crypto.currentPrice)}
          </motion.span>
        </motion.div>

        <motion.div 
          className="flex justify-between items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-sm text-muted-foreground">Average Cost</span>
          <motion.span 
            className="font-medium"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          >
            {formatCurrency(crypto.averageCost)}
          </motion.span>
        </motion.div>

        <motion.div 
          className="border-t pt-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Unrealized P&L</span>
            <div className="flex items-center gap-1">
              <motion.div 
                className={`flex items-center gap-1 font-medium ${getPnLColorClass(crypto.unrealizedPnL)}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                <motion.div
                  animate={{ 
                    y: isPositive ? [-1, 1, -1] : [1, -1, 1],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                </motion.div>
                {formatCurrency(crypto.unrealizedPnL)}
              </motion.div>
              <motion.div 
                className={`inline-flex items-center text-xs px-1.5 py-0.5 rounded-lg bg-opacity-10 ${
                  crypto.unrealizedPnL > 0 
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                    : crypto.unrealizedPnL < 0 
                    ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              >
                {formatPercentage(crypto.unrealizedPnLPercentage)}
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleViewDetails}
            className="w-full mt-4 transition-colors duration-200"
          >
            View Details
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
};