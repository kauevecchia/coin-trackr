import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useCrypto } from "@/hooks/useCrypto";
import { CryptoSelector } from "./CryptoSelector";
import { useState, useEffect } from "react";
import { Label } from "./ui/label";
import { useTransactionCalculation } from "@/hooks/useTransactionCalculation";
import { useTransactionsContext } from "@/contexts/TransactionsContext";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface NewTransactionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewTransactionModal = ({ isOpen, onOpenChange }: NewTransactionModalProps) => {
  const { cryptos, isLoading, error } = useCrypto();
  const { createBuyTransaction, createSellTransaction } = useTransactionsContext();
  const [selectedCrypto, setSelectedCrypto] = useState<string>("");
  const [transactionType, setTransactionType] = useState<string>("");
  const [transactionDate, setTransactionDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    cryptoPriceInput,
    usdAmountInput,
    cryptoAmountInput,
    handleCryptoPriceChange,
    handleUsdAmountChange,
    handleCryptoAmountChange,
    resetForm
  } = useTransactionCalculation();

  useEffect(() => {
    if (!isOpen) {
      setSelectedCrypto("");
      setTransactionType("");
      setTransactionDate(new Date().toISOString().split('T')[0]);
      resetForm();
    }
  }, [isOpen, resetForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCrypto || !transactionType || !cryptoPriceInput.numericValue || !usdAmountInput.numericValue || !cryptoAmountInput.numericValue) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const selectedCryptoData = cryptos.find(crypto => crypto.id === selectedCrypto);
      if (!selectedCryptoData) {
        toast.error('Selected cryptocurrency not found');
        return;
      }

      const transactionData = {
        cryptoSymbol: selectedCryptoData.symbol,
        cryptoQuantity: cryptoAmountInput.numericValue,
        usdAmount: usdAmountInput.numericValue,
        unitPriceAtTransaction: cryptoPriceInput.numericValue,
        transactionDate: new Date(transactionDate),
      };

      let response;
      if (transactionType === 'BUY') {
        response = await createBuyTransaction(transactionData);
      } else {
        response = await createSellTransaction(transactionData);
      }

      toast.success(response.message);
      resetForm();
      onOpenChange(false);
      
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || 'Unknown error occurred';
        toast.error(message);
      } else {
        toast.error('Failed to create transaction. Please try again.');
      }

    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">New Transaction</DialogTitle>
        </DialogHeader>
        <DialogDescription className="-mt-2 mb-4">
          Create a new cryptocurrency transaction.
        </DialogDescription>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 w-full">
              <Label>Transaction Type</Label>
              <Select value={transactionType} onValueChange={setTransactionType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Transaction Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BUY">Buy</SelectItem>
                  <SelectItem value="SELL">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <CryptoSelector
              cryptos={cryptos}
              isLoading={isLoading}
              error={error}
              selectedCrypto={selectedCrypto}
              onCryptoSelect={setSelectedCrypto}
            />
            <div className="flex flex-col gap-2">
              <Label>Crypto Price</Label>
              <Input 
                type="text" 
                placeholder="$0.00"
                value={cryptoPriceInput.displayValue}
                onChange={handleCryptoPriceChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Date</Label>
              <Input 
                type="date" 
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>USD Amount ($)</Label>
              <Input 
                type="text" 
                placeholder="$0.00"
                value={usdAmountInput.displayValue}
                onChange={handleUsdAmountChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Crypto Amount</Label>
              <Input 
                type="text" 
                placeholder="0.00000000"
                value={cryptoAmountInput.displayValue}
                onChange={handleCryptoAmountChange}
              />
            </div>
            
          </div>
        
          <DialogFooter>
            <Button 
              type="submit" 
              className="text-muted dark:text-foreground mt-4" 
              disabled={!selectedCrypto || !transactionType || isSubmitting || !cryptoPriceInput.numericValue || !usdAmountInput.numericValue || !cryptoAmountInput.numericValue}
            >
              {isSubmitting ? "Creating..." : "Create Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default NewTransactionModal;