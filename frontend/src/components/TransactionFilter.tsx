"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Filter, X } from "lucide-react";

interface UniqueCrypto {
  symbol: string;
  name: string;
  count: number;
}

interface TransactionFilterProps {
  uniqueCryptos: UniqueCrypto[];
  selectedCryptos: string[];
  onSelectedCryptosChange: (selected: string[]) => void;
}

export default function TransactionFilter({
  uniqueCryptos,
  selectedCryptos,
  onSelectedCryptosChange,
}: TransactionFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCryptoToggle = (symbol: string) => {
    if (selectedCryptos.includes(symbol)) {
      onSelectedCryptosChange(selectedCryptos.filter(s => s !== symbol));
    } else {
      onSelectedCryptosChange([...selectedCryptos, symbol]);
    }
  };

  const handleSelectAll = () => {
    if (selectedCryptos.length === uniqueCryptos.length) {
      onSelectedCryptosChange([]);
    } else {
      onSelectedCryptosChange(uniqueCryptos.map(crypto => crypto.symbol));
    }
  };

  const handleClearFilters = () => {
    onSelectedCryptosChange([]);
  };

  const getFilterText = () => {
    if (selectedCryptos.length === 0) {
      return "All Cryptocurrencies";
    } else if (selectedCryptos.length === 1) {
      const crypto = uniqueCryptos.find(c => c.symbol === selectedCryptos[0]);
      return crypto?.name || selectedCryptos[0];
    } else {
      return `${selectedCryptos.length} cryptocurrencies selected`;
    }
  };

  const isAllSelected = selectedCryptos.length === uniqueCryptos.length && uniqueCryptos.length > 0;
  const hasFilters = selectedCryptos.length > 0;

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="min-w-[200px] justify-between"
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>{getFilterText()}</span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[300px]" align="start">
          <DropdownMenuLabel>Filter by Cryptocurrency</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={handleSelectAll}
            className="font-medium"
          >
            <div className="flex items-center justify-between w-full">
              <span>{isAllSelected ? "Clear All" : "Select All"}</span>
              <span className="text-sm text-muted-foreground">
                {uniqueCryptos.length} cryptos
              </span>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {uniqueCryptos.map((crypto) => (
            <DropdownMenuItem
              key={crypto.symbol}
              onClick={() => handleCryptoToggle(crypto.symbol)}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center ${
                    selectedCryptos.includes(crypto.symbol)
                      ? 'bg-primary border-primary'
                      : 'border-muted-foreground'
                  }`}>
                    {selectedCryptos.includes(crypto.symbol) && (
                      <div className="w-2 h-2 bg-primary-foreground rounded-sm" />
                    )}
                  </div>
                  <div>
                    <span className="font-medium">{crypto.name}</span>
                    <span className="text-sm text-muted-foreground ml-1">
                      ({crypto.symbol.toUpperCase()})
                    </span>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {crypto.count} transactions
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          className="h-10 px-3"
        >
          <X className="h-4 w-4 mr-1" />
          Clear filters
        </Button>
      )}
    </div>
  );
}