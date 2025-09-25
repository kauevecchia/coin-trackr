import { useState, useEffect, useCallback } from "react";
import { cryptoService, CryptoDetails } from "../services/crypto.service";

const CRYPTO_ORDER = [
  'BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'USDC', 'XRP', 'DOGE', 'ADA', 'TRX',
  'AVAX', 'SHIB', 'LINK', 'DOT', 'LTC', 'BCH', 'UNI', 'NEAR', 'XMR', 'ICP',
  'ETC', 'FIL', 'ATOM', 'DAI', 'ARB', 'OP', 'APT', 'RNDR', 'HBAR', 'IMX',
  'XLM', 'FLOW', 'VET', 'GRT', 'INJ', 'EGLD', 'SUI', 'MKR', 'PEPE', 'THETA',
  'QNT', 'ALGO', 'SAND', 'MANA', 'FTM', 'AXS', 'CFX', 'MINA', 'TUSD', 'XTZ'
];

interface CryptoState {
  cryptos: CryptoDetails[];
  isLoading: boolean;
  error: string | null;
}

export const useCrypto = () => {
  const [state, setState] = useState<CryptoState>({
    cryptos: [],
    isLoading: false,
    error: null,
  });

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  const setCryptos = (cryptos: CryptoDetails[]) => {
    const sortedCryptos = cryptos.sort((a, b) => {
      const indexA = CRYPTO_ORDER.indexOf(a.symbol);
      const indexB = CRYPTO_ORDER.indexOf(b.symbol);
      
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      return a.symbol.localeCompare(b.symbol);
    });
    
    setState(prev => ({ ...prev, cryptos: sortedCryptos, isLoading: false, error: null }));
  };

  const fetchCryptos = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const cryptos = await cryptoService.getAllFixedCryptoDetails();
      setCryptos(cryptos);
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to fetch cryptos.";
      setError(errorMessage);
      setLoading(false);
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchCryptos();
  }, [fetchCryptos]);

  return {
    cryptos: state.cryptos,
    isLoading: state.isLoading,
    error: state.error,
    refetch: fetchCryptos
  };
};