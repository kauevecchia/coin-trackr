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

type TransactionType = 'BUY' | 'SELL';

interface TransactionFilterProps {
  uniqueCryptos: UniqueCrypto[];
  selectedCryptos: string[];
  onSelectedCryptosChange: (selected: string[]) => void;
  selectedTypes: TransactionType[];
  onSelectedTypesChange: (selected: TransactionType[]) => void;
}

export default function TransactionFilter({
  uniqueCryptos,
  selectedCryptos,
  onSelectedCryptosChange,
  selectedTypes,
  onSelectedTypesChange,
}: TransactionFilterProps) {
  const [isCryptoOpen, setIsCryptoOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);

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

  const handleTypeToggle = (type: TransactionType) => {
    if (selectedTypes.includes(type)) {
      onSelectedTypesChange(selectedTypes.filter(t => t !== type));
    } else {
      onSelectedTypesChange([...selectedTypes, type]);
    }
  };

  const handleSelectAllTypes = () => {
    const allTypes: TransactionType[] = ['BUY', 'SELL'];
    if (selectedTypes.length === allTypes.length) {
      onSelectedTypesChange([]);
    } else {
      onSelectedTypesChange(allTypes);
    }
  };

  const handleClearFilters = () => {
    onSelectedCryptosChange([]);
    onSelectedTypesChange([]);
  };

  const getCryptoFilterText = () => {
    if (selectedCryptos.length === 0) {
      return "All Cryptocurrencies";
    } else if (selectedCryptos.length === 1) {
      const crypto = uniqueCryptos.find(c => c.symbol === selectedCryptos[0]);
      return crypto?.name || selectedCryptos[0];
    } else {
      return `${selectedCryptos.length} cryptocurrencies selected`;
    }
  };

  const getTypeFilterText = () => {
    if (selectedTypes.length === 0) {
      return "All Transaction Types";
    } else if (selectedTypes.length === 1) {
      return selectedTypes[0] === 'BUY' ? 'Buy Transactions' : 'Sell Transactions';
    } else {
      return "Buy & Sell Transactions";
    }
  };

  const isAllCryptosSelected = selectedCryptos.length === uniqueCryptos.length && uniqueCryptos.length > 0;
  const isAllTypesSelected = selectedTypes.length === 2;
  const hasFilters = selectedCryptos.length > 0 || selectedTypes.length > 0;

  return (
    <div className="flex items-center gap-2">
      {/* Cryptocurrency Filter */}
      <DropdownMenu open={isCryptoOpen} onOpenChange={setIsCryptoOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="min-w-[200px] justify-between"
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>{getCryptoFilterText()}</span>
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
              <span>{isAllCryptosSelected ? "Clear All" : "Select All"}</span>
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

      {/* Transaction Type Filter */}
      <DropdownMenu open={isTypeOpen} onOpenChange={setIsTypeOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="min-w-[180px] justify-between"
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>{getTypeFilterText()}</span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[250px]" align="start">
          <DropdownMenuLabel>Filter by Transaction Type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={handleSelectAllTypes}
            className="font-medium"
          >
            <div className="flex items-center justify-between w-full">
              <span>{isAllTypesSelected ? "Clear All" : "Select All"}</span>
              <span className="text-sm text-muted-foreground">
                2 types
              </span>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            onClick={() => handleTypeToggle('BUY')}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center ${
                  selectedTypes.includes('BUY')
                    ? 'bg-primary border-primary'
                    : 'border-muted-foreground'
                }`}>
                  {selectedTypes.includes('BUY') && (
                    <div className="w-2 h-2 bg-primary-foreground rounded-sm" />
                  )}
                </div>
                <span className="font-medium">Buy Transactions</span>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                BUY
              </span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleTypeToggle('SELL')}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center ${
                  selectedTypes.includes('SELL')
                    ? 'bg-primary border-primary'
                    : 'border-muted-foreground'
                }`}>
                  {selectedTypes.includes('SELL') && (
                    <div className="w-2 h-2 bg-primary-foreground rounded-sm" />
                  )}
                </div>
                <span className="font-medium">Sell Transactions</span>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                SELL
              </span>
            </div>
          </DropdownMenuItem>
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