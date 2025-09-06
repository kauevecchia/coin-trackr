import { api } from "./api";

export interface CryptoDetails {
  id: string;
  symbol: string;
  name: string;
  price: string;
  image_url: string | null;
  last_updated: string;
}

export const cryptoService = {
  async getAllFixedCryptoDetails(): Promise<CryptoDetails[]> {
    const response = await api.get<CryptoDetails[]>("/cryptos/fixed-crypto-details");
    return response.data;
  }
};