import axios from 'axios'
import { FIXED_CRYPTO_LIST } from '../config/fixed-cryptos'
import { env } from '../env'

const COINMARKETCAP_BASE_URL = 'https://pro-api.coinmarketcap.com/v1'

const coinMarketCapClient = axios.create({
  baseURL: COINMARKETCAP_BASE_URL,
  timeout: 15000,
  headers: {
    accept: 'application/json',
    'X-CMC_PRO_API_KEY': env.COINMARKETCAP_API_KEY,
  },
})

export interface CoinMarketCapPriceData {
  symbol: string
  name: string
  price: number
}

export async function fetchFixedCryptosFromCoinMarketCap(): Promise<CoinMarketCapPriceData[]> {
  const symbols = FIXED_CRYPTO_LIST.map((c) => c.symbol).join(',')

  try {
    const response = await coinMarketCapClient.get(
      '/cryptocurrency/quotes/latest',
      {
        params: {
          symbol: symbols,
          convert: 'USD',
        },
      },
    )

    // CMC returns a single object per symbol, or an array when multiple coins share the same symbol
    const data = response.data.data as Record<
      string,
      | { quote: { USD: { price: number } } }
      | { quote: { USD: { price: number } } }[]
    >

    return FIXED_CRYPTO_LIST.map((crypto) => {
      const raw = data[crypto.symbol]
      const entry = Array.isArray(raw) ? raw[0] : raw
      const price = entry?.quote?.USD?.price ?? 0

      if (price === 0) {
        console.warn(`⚠️ No CoinMarketCap price found for ${crypto.symbol}`)
      }

      return {
        symbol: crypto.symbol,
        name: crypto.name,
        price,
      }
    })
  } catch (error) {
    console.error('Error fetching crypto prices from CoinMarketCap:', error)
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
