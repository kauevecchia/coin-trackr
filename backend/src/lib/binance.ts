import axios from 'axios'
import { FIXED_CRYPTO_LIST } from '../config/fixed-cryptos'

const BINANCE_API_BASE_URL = 'https://api.binance.com'

const binanceApiClient = axios.create({
  baseURL: BINANCE_API_BASE_URL,
  headers: {
    accept: 'application/json',
  },
})

// USDT has no USDTUSDT pair on Binance — hardcode as 1.0
const HARDCODED_PRICES: Record<string, number> = {
  USDT: 1.0,
}

export interface BinanceCryptoData {
  symbol: string
  name: string
  price: number
}

export async function fetchFixedCryptosFromBinance(): Promise<BinanceCryptoData[]> {
  const symbolsToFetch = FIXED_CRYPTO_LIST
    .filter((crypto) => !(crypto.symbol in HARDCODED_PRICES))
    .map((crypto) => `${crypto.symbol}USDT`)

  try {
    const response = await binanceApiClient.get('/api/v3/ticker/price', {
      params: {
        symbols: JSON.stringify(symbolsToFetch),
      },
    })

    const priceMap: Record<string, number> = {}
    for (const item of response.data as { symbol: string; price: string }[]) {
      priceMap[item.symbol] = parseFloat(item.price)
    }

    return FIXED_CRYPTO_LIST.map((crypto) => {
      const price =
        HARDCODED_PRICES[crypto.symbol] ??
        priceMap[`${crypto.symbol}USDT`] ??
        0

      return {
        symbol: crypto.symbol,
        name: crypto.name,
        price,
      }
    })
  } catch (error) {
    console.error('Error fetching crypto prices from Binance:', error)
    if (axios.isAxiosError(error)) {
      console.error(
        'Axios error details:',
        error.response?.status,
        error.response?.data,
      )
    }
    throw error
  }
}
