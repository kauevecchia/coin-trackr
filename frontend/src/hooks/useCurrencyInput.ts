import { useState, useCallback } from 'react';

interface UseCurrencyInputProps {
  initialValue?: string;
  prefix?: string;
  allowDecimal?: boolean;
  maxDecimalPlaces?: number;
}

interface UseCurrencyInputReturn {
  displayValue: string;
  rawValue: string;
  numericValue: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: (value: string | number) => void;
  clear: () => void;
}

export const useCurrencyInput = ({
  initialValue = '',
  prefix = '$',
  allowDecimal = true,
  maxDecimalPlaces = 2
}: UseCurrencyInputProps = {}): UseCurrencyInputReturn => {
  const [rawValue, setRawValue] = useState(initialValue);

  const formatDisplayValue = useCallback((value: string): string => {
    if (!value) return '';
    
    let cleanValue = value.replace(/[^\d.]/g, '');
    
    if (!allowDecimal) {
      cleanValue = cleanValue.replace(/\./g, '');
    } else {
      const parts = cleanValue.split('.');
      if (parts.length > 2) {
        cleanValue = parts[0] + '.' + parts.slice(1).join('');
      }
      
      if (parts[1] && parts[1].length > maxDecimalPlaces) {
        cleanValue = parts[0] + '.' + parts[1].substring(0, maxDecimalPlaces);
      }
    }
    
    if (!cleanValue) return '';
    
    const [integerPart, decimalPart] = cleanValue.split('.');
    
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    let formattedValue = formattedInteger;
    if (allowDecimal && decimalPart !== undefined) {
      formattedValue += '.' + decimalPart;
    }
    
    return prefix + formattedValue;
  }, [allowDecimal, maxDecimalPlaces, prefix]);

  const getNumericValue = useCallback((value: string): number => {
    const cleanValue = value.replace(/[^\d.]/g, '');
    return cleanValue ? parseFloat(cleanValue) : 0;
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (inputValue === '' || inputValue === prefix) {
      setRawValue('');
      return;
    }
    
    const valueWithoutPrefix = inputValue.startsWith(prefix) 
      ? inputValue.slice(prefix.length) 
      : inputValue;
    
    let cleanValue = valueWithoutPrefix.replace(/[^\d.]/g, '');
    
    if (!allowDecimal) {
      cleanValue = cleanValue.replace(/\./g, '');
    } else {
      const parts = cleanValue.split('.');
      if (parts.length > 2) {
        cleanValue = parts[0] + '.' + parts.slice(1).join('');
      }
      
      if (parts[1] && parts[1].length > maxDecimalPlaces) {
        cleanValue = parts[0] + '.' + parts[1].substring(0, maxDecimalPlaces);
      }
    }
    
    setRawValue(cleanValue);
  }, [allowDecimal, maxDecimalPlaces, prefix]);

  const setValue = useCallback((value: string | number) => {
    const stringValue = typeof value === 'number' ? value.toString() : value;
    setRawValue(stringValue);
  }, []);

  const clear = useCallback(() => {
    setRawValue('');
  }, []);

  return {
    displayValue: formatDisplayValue(rawValue),
    rawValue,
    numericValue: getNumericValue(rawValue),
    handleChange,
    setValue,
    clear
  };
};

export const useUSDInput = (initialValue?: string) => {
  return useCurrencyInput({
    initialValue,
    prefix: '$',
    allowDecimal: true,
    maxDecimalPlaces: 2
  });
};

export const useCryptoAmountInput = (initialValue?: string) => {
  return useCurrencyInput({
    initialValue,
    prefix: '',
    allowDecimal: true,
    maxDecimalPlaces: 8
  });
};

export const useCryptoPriceInput = (initialValue?: string) => {
  return useCurrencyInput({
    initialValue,
    prefix: '$',
    allowDecimal: true,
    maxDecimalPlaces: 6
  });
};