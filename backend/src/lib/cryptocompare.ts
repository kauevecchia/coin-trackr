import axios from 'axios'
import { FIXED_CRYPTO_LIST } from '../config/fixed-cryptos'

const CRYPTOCOMPARE_BASE_URL = 'https://min-api.cryptocompare.com'

const cryptoCompareClient = axios.create({
  baseURL: CRYPTOCOMPARE_BASE_URL,
  headers: {
    accept: 'application/json',
  },
})

export interface CryptoComparePriceData {
  symbol: string
  name: string
  price: number
}

export async function fetchFixedCryptosFromCryptoCompare(): Promise<CryptoComparePriceData[]> {
  const symbols = FIXED_CRYPTO_LIST.map((c) => c.symbol).join(',')

  try {
    const response = await cryptoCompareClient.get('/data/pricemulti', {
      params: {
        fsyms: symbols,
        tsyms: 'USD',
      },
    })

    // Response format: { BTC: { USD: 95000 }, ETH: { USD: 3500 }, ... }
    const data = response.data as Record<string, { USD: number }>

    return FIXED_CRYPTO_LIST.map((crypto) => {
      const price = data[crypto.symbol]?.USD ?? 0

      if (price === 0) {
        console.warn(`⚠️ No CryptoCompare price found for ${crypto.symbol}`)
      }

      return {
        symbol: crypto.symbol,
        name: crypto.name,
        price,
      }
    })
  } catch (error) {
    console.error('Error fetching crypto prices from CryptoCompare:', error)
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
