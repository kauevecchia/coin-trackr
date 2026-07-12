import axios from 'axios'
import { FIXED_CRYPTO_LIST } from '../config/fixed-cryptos'

const COINCAP_BASE_URL = 'https://api.coincap.io/v2'

const coinCapClient = axios.create({
  baseURL: COINCAP_BASE_URL,
  headers: {
    accept: 'application/json',
  },
})

export interface CoinCapPriceData {
  symbol: string
  name: string
  price: number
}

export async function fetchFixedCryptosFromCoinCap(): Promise<CoinCapPriceData[]> {
  try {
    // Fetch top 500 assets by market cap — covers all coins in our fixed list
    const response = await coinCapClient.get('/assets', {
      params: { limit: 500 },
    })

    const assets = response.data.data as {
      symbol: string
      priceUsd: string | null
    }[]

    // Use only the first occurrence of each symbol (highest market cap rank)
    const priceMap: Record<string, number> = {}
    for (const asset of assets) {
      const symbol = asset.symbol.toUpperCase()
      if (!(symbol in priceMap)) {
        priceMap[symbol] = parseFloat(asset.priceUsd ?? '0')
      }
    }

    return FIXED_CRYPTO_LIST.map((crypto) => {
      const price = priceMap[crypto.symbol] ?? 0

      if (price === 0) {
        console.warn(`⚠️ No CoinCap price found for ${crypto.symbol}`)
      }

      return {
        symbol: crypto.symbol,
        name: crypto.name,
        price,
      }
    })
  } catch (error) {
    console.error('Error fetching crypto prices from CoinCap:', error)
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
