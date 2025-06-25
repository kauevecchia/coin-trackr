interface FixedCrypto {
  id: string
  symbol: string
  name: string
}

export const FIXED_CRYPTO_LIST: FixedCrypto[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  { id: 'tether', symbol: 'USDT', name: 'Tether' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB' },
  { id: 'solana', symbol: 'SOL', name: 'Solana' },
  { id: 'usd-coin', symbol: 'USDC', name: 'USD Coin' },
  { id: 'xrp', symbol: 'XRP', name: 'XRP' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
  { id: 'tron', symbol: 'TRX', name: 'TRON' },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche' },
  { id: 'shiba-inu', symbol: 'SHIB', name: 'Shiba Inu' },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink' },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot' },
  { id: 'litecoin', symbol: 'LTC', name: 'Litecoin' },
  { id: 'bitcoin-cash', symbol: 'BCH', name: 'Bitcoin Cash' },
  { id: 'uniusd', symbol: 'UNI', name: 'Uniswap' },
  { id: 'near', symbol: 'NEAR', name: 'NEAR Protocol' },
  { id: 'monero', symbol: 'XMR', name: 'Monero' },
  { id: 'internet-computer', symbol: 'ICP', name: 'Internet Computer' },
  { id: 'ethereum-classic', symbol: 'ETC', name: 'Ethereum Classic' },
  { id: 'filecoin', symbol: 'FIL', name: 'Filecoin' },
  { id: 'cosmos', symbol: 'ATOM', name: 'Cosmos' },
  { id: 'dai', symbol: 'DAI', name: 'Dai' },
  { id: 'arbitrum', symbol: 'ARB', name: 'Arbitrum' },
  { id: 'optimism', symbol: 'OP', name: 'Optimism' },
  { id: 'aptos', symbol: 'APT', name: 'Aptos' },
  { id: 'render-token', symbol: 'RNDR', name: 'Render Token' },
  { id: 'hedera-hashgraph', symbol: 'HBAR', name: 'Hedera' },
  { id: 'immutable-x', symbol: 'IMX', name: 'ImmutableX' },
  { id: 'stellar', symbol: 'XLM', name: 'Stellar' },
  { id: 'flow', symbol: 'FLOW', name: 'Flow' },
  { id: 'vechain', symbol: 'VET', name: 'VeChain' },
  { id: 'the-graph', symbol: 'GRT', name: 'The Graph' },
  { id: 'injective-protocol', symbol: 'INJ', name: 'Injective' },
  { id: 'multiversx', symbol: 'EGLD', name: 'MultiversX' },
  { id: 'sui', symbol: 'SUI', name: 'Sui' },
  { id: 'maker', symbol: 'MKR', name: 'Maker' },
  { id: 'pepe', symbol: 'PEPE', name: 'Pepe' },
  { id: 'theta-token', symbol: 'THETA', name: 'Theta Network' },
  { id: 'quant', symbol: 'QNT', name: 'Quant' },
  { id: 'algorand', symbol: 'ALGO', name: 'Algorand' },
  { id: 'the-sandbox', symbol: 'SAND', name: 'The Sandbox' },
  { id: 'decentraland', symbol: 'MANA', name: 'Decentraland' },
  { id: 'fantom', symbol: 'FTM', name: 'Fantom' },
  { id: 'axie-infinity', symbol: 'AXS', name: 'Axie Infinity' },
  { id: 'conflux-token', symbol: 'CFX', name: 'Conflux' },
  { id: 'mina-protocol', symbol: 'MINA', name: 'Mina' },
  { id: 'true-usd', symbol: 'TUSD', name: 'TrueUSD' },
  { id: 'tezos', symbol: 'XTZ', name: 'Tezos' },
]

export const FIXED_CRYPTO_IDS = FIXED_CRYPTO_LIST.map((crypto) => crypto.id)
export const FIXED_CRYPTO_SYMBOLS = FIXED_CRYPTO_LIST.map(
  (crypto) => crypto.symbol,
)
