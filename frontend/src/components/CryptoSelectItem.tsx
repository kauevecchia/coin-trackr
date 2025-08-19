import { CryptoDetails } from "@/services/crypto.service";

interface CryptoSelectItemProps {
  crypto: CryptoDetails;
  showPrice?: boolean;
}

export const CryptoSelectItem = ({ crypto, showPrice = false }: CryptoSelectItemProps) => {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="w-6 h-6 rounded-full overflow-hidden bg-muted flex-shrink-0">
        {crypto.image_url ? (
          <img
            src={crypto.image_url}
            alt={crypto.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
            {crypto.symbol.charAt(0)}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{crypto.symbol}</span>
          <span className="text-muted-foreground text-xs truncate">{crypto.name}</span>
        </div>
        {showPrice && (
          <div className="text-xs text-muted-foreground">
            ${parseFloat(crypto.price).toLocaleString('en-US', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 6 
            })}
          </div>
        )}
      </div>
    </div>
  );
};