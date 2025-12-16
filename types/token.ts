import type { SupportedChainId } from '@/lib/constants/chains'

export interface TokenBase {
  address: `0x${string}`
  symbol: string
  name: string
  decimals: number
}

export interface Token extends TokenBase {
  chainId: SupportedChainId
  logoURI?: string
}

export interface TokenWithPrice extends Token {
  priceUSD: number
}

export interface KnownToken extends Token {
  isNative?: boolean
  isStablecoin?: boolean
}
