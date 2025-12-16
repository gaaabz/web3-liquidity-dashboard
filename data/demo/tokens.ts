import type { TokenData } from '@/types/position'

export const DEMO_TOKENS: Record<string, TokenData> = {
  WETH: {
    address: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
    name: 'Wrapped Ether',
    symbol: 'WETH',
    decimals: 18,
  },
  USDC: {
    address: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
  },
  DAI: {
    address: '0x68194a729C2450ad26072b3D33ADaCbcef39D574',
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    decimals: 18,
  },
  LINK: {
    address: '0x779877A7B0D9E8603169DdbD7836e478b4624789',
    name: 'Chainlink Token',
    symbol: 'LINK',
    decimals: 18,
  },
  WAVAX: {
    address: '0xd00ae08403B9bbb9124bB305C09058E32C39A48c',
    name: 'Wrapped AVAX',
    symbol: 'WAVAX',
    decimals: 18,
  },
}

export const TOKEN_PRICES_USD: Record<string, number> = {
  WETH: 2450.00,
  USDC: 1.00,
  DAI: 1.00,
  LINK: 14.50,
  WAVAX: 35.00,
}
