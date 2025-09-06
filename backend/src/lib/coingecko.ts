import axios from 'axios'
import { FIXED_CRYPTO_IDS } from '../config/fixed-cryptos'
import { env } from '../env'

const COINGECKO_API_BASE_URL = 'https://api.coingecko.com/api/v3'

const coingeckoApiClient = axios.create({
  baseURL: COINGECKO_API_BASE_URL,
  headers: {
    accept: 'application/json',
    'x-cg-demo-api-key': env.COINGECKO_API_KEY,
  },
})

export async function fetchFixedCryptosFullDetails(vsCurrency: string = 'usd') {
  try {
    const response = await coingeckoApiClient.get('/coins/markets', {
      params: {
        vs_currency: vsCurrency,
        ids: FIXED_CRYPTO_IDS.join(','),
        sparkline: false,
        price_change_percentage: '24h',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching fixed cryptos full details:', error)
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

export async function getCryptoPrice(
  cryptoId: string,
  vsCurrency: string = 'usd',
) {
  try {
    const response = await coingeckoApiClient.get('/simple/price', {
      params: {
        ids: cryptoId,
        vs_currencies: vsCurrency,
      },
    })
    return response.data[cryptoId]?.[vsCurrency]
  } catch (error) {
    console.error(`Error fetching crypto price for ${cryptoId}:`, error)
    if (axios.isAxiosError(error)) {
      console.error(
        'Axios error details:',
        error.response?.status,
        error.response?.data,
      )
    }
    return null
  }
}
