import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ChevronDown, Search } from "lucide-react";
import { CryptoSelectItem } from "./CryptoSelectItem";
import { useState, useMemo, useRef, useEffect } from "react";
import { CryptoDetails } from "@/services/crypto.service";

interface CryptoSelectorProps {
  cryptos: CryptoDetails[];
  isLoading: boolean;
  error: unknown;
  selectedCrypto: string;
  onCryptoSelect: (cryptoId: string) => void;
  label?: string;
  placeholder?: string;
}

export const CryptoSelector = ({ 
  cryptos, 
  isLoading, 
  error, 
  selectedCrypto, 
  onCryptoSelect,
  label = "Cryptocurrency",
  placeholder = "Search cryptocurrency..."
}: CryptoSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isComboboxOpen, setIsComboboxOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  
  const filteredCryptos = useMemo(() => {
    if (!searchTerm) return cryptos;
    
    return cryptos.filter(crypto => 
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cryptos, searchTerm]);

  const selectedCryptoData = cryptos.find(crypto => crypto.id === selectedCrypto);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(event.target as Node) &&
          listRef.current && !listRef.current.contains(event.target as Node)) {
        setIsComboboxOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCryptoSelect = (crypto: CryptoDetails) => {
    onCryptoSelect(crypto.id);
    setSearchTerm("");
    setIsComboboxOpen(false);
  };

  const handleInputFocus = () => {
    setIsComboboxOpen(true);
    setSearchTerm("");
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      
      <div className="relative">
        <div className="relative">
          {selectedCryptoData && !isComboboxOpen && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 z-10">
              <div className="w-5 h-5 rounded-full overflow-hidden bg-muted flex-shrink-0">
                {selectedCryptoData.image_url ? (
                  <img
                    src={selectedCryptoData.image_url}
                    alt={selectedCryptoData.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                    {selectedCryptoData.symbol.charAt(0)}
                  </div>
                )}
              </div>
            </div>
          )}
          
          <Input
            ref={inputRef}
            type="text"
            placeholder={isLoading ? "Loading..." : placeholder}
            value={isComboboxOpen ? searchTerm : (selectedCryptoData ? `${selectedCryptoData.symbol} - ${selectedCryptoData.name}` : "")}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleInputFocus}
            className={`pr-10 ${selectedCryptoData && !isComboboxOpen ? 'pl-11' : ''}`}
            disabled={isLoading}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {isComboboxOpen ? (
              <Search className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown 
                className="h-4 w-4 text-muted-foreground cursor-pointer" 
                onClick={() => setIsComboboxOpen(!isComboboxOpen)}
              />
            )}
          </div>
        </div>

        {isComboboxOpen && (
          <div 
            ref={listRef}
            className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-80 overflow-auto"
          >
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  Loading cryptocurrencies...
                </div>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">
                Error loading cryptos
              </div>
            ) : filteredCryptos.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No cryptocurrencies found
              </div>
            ) : (
              filteredCryptos.map((crypto) => (
                <div
                  key={crypto.id}
                  className="p-3 hover:bg-accent cursor-pointer border-b border-border last:border-b-0"
                  onClick={() => handleCryptoSelect(crypto)}
                >
                  <CryptoSelectItem crypto={crypto} showPrice={true} />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};