import { useState, useEffect } from 'react';
import { useCryptoPriceInput, useUSDInput, useCryptoAmountInput } from './useCurrencyInput';

interface UseTransactionCalculationReturn {
  cryptoPriceInput: ReturnType<typeof useCryptoPriceInput>;
  usdAmountInput: ReturnType<typeof useUSDInput>;
  cryptoAmountInput: ReturnType<typeof useCryptoAmountInput>;
  handleCryptoPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUsdAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCryptoAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearAllValues: () => void;
  resetForm: () => void;
}

export const useTransactionCalculation = (): UseTransactionCalculationReturn => {
  const cryptoPriceInput = useCryptoPriceInput();
  const usdAmountInput = useUSDInput();
  const cryptoAmountInput = useCryptoAmountInput();

  const [lastModifiedField, setLastModifiedField] = useState<'price' | 'usd' | 'crypto' | null>(null);

  useEffect(() => {
    const cryptoPrice = cryptoPriceInput.numericValue;
    const usdAmount = usdAmountInput.numericValue;
    const cryptoAmount = cryptoAmountInput.numericValue;

    if (!lastModifiedField) {
      return;
    }

    const hasPrice = cryptoPrice > 0;
    const hasUsdAmount = usdAmount > 0;
    const hasCryptoAmount = cryptoAmount > 0;

    const filledFieldsCount = [hasPrice, hasUsdAmount, hasCryptoAmount].filter(Boolean).length;

    if (filledFieldsCount < 2) {
      return;
    }

    const tolerance = 0.00000001;

    try {
      if ((lastModifiedField === 'price' || lastModifiedField === 'usd') && hasPrice && hasUsdAmount) {
        const calculatedCryptoAmount = usdAmount / cryptoPrice;
        
        if (Math.abs(calculatedCryptoAmount - cryptoAmount) > tolerance) {
          const formattedAmount = parseFloat(calculatedCryptoAmount.toFixed(8));
          cryptoAmountInput.setValue(formattedAmount.toString());
        }
      }
      else if (lastModifiedField === 'crypto' && hasCryptoAmount) {
        if (hasPrice) {
          const calculatedUsdAmount = cryptoPrice * cryptoAmount;
          
          if (Math.abs(calculatedUsdAmount - usdAmount) > tolerance) {
            const formattedAmount = parseFloat(calculatedUsdAmount.toFixed(2));
            usdAmountInput.setValue(formattedAmount.toString());
          }
        }
        else if (hasUsdAmount) {
          const calculatedPrice = usdAmount / cryptoAmount;
          
          if (Math.abs(calculatedPrice - cryptoPrice) > tolerance) {
            const formattedPrice = parseFloat(calculatedPrice.toFixed(6));
            cryptoPriceInput.setValue(formattedPrice.toString());
          }
        }
      }
    } catch (error) {
      console.warn('Error in automatic calculation:', error);
    }
  }, [
    cryptoPriceInput.numericValue, 
    usdAmountInput.numericValue, 
    cryptoAmountInput.numericValue, 
    lastModifiedField,
    cryptoPriceInput, 
    usdAmountInput, 
    cryptoAmountInput
  ]);

  const handleCryptoPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    cryptoPriceInput.handleChange(e);
    setLastModifiedField('price');
    
    if (e.target.value === '' || e.target.value === '$') {
      setLastModifiedField(null);
    }
  };

  const handleUsdAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    usdAmountInput.handleChange(e);
    setLastModifiedField('usd');
    
    if (e.target.value === '' || e.target.value === '$') {
      setLastModifiedField(null);
    }
  };

  const handleCryptoAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    cryptoAmountInput.handleChange(e);
    setLastModifiedField('crypto');
    
    if (e.target.value === '') {
      setLastModifiedField(null);
    }
  };

  const clearAllValues = () => {
    cryptoPriceInput.clear();
    usdAmountInput.clear();
    cryptoAmountInput.clear();
    setLastModifiedField(null);
  };

  const resetForm = () => {
    clearAllValues();
  };

  return {
    cryptoPriceInput,
    usdAmountInput,
    cryptoAmountInput,
    handleCryptoPriceChange,
    handleUsdAmountChange,
    handleCryptoAmountChange,
    clearAllValues,
    resetForm
  };
};