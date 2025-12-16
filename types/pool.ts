import type { SupportedChainId } from '@/lib/constants/chains'
import type { TokenData } from './position'

export interface PoolSlot0 {
  sqrtPriceX96: bigint
  tick: number
  observationIndex: number
  observationCardinality: number
  observationCardinalityNext: number
  feeProtocol: number
  unlocked: boolean
}

export interface PoolData {
  address: `0x${string}`
  chainId: SupportedChainId
  token0: TokenData
  token1: TokenData
  fee: number
  tickSpacing: number
  sqrtPriceX96: bigint
  tick: number
  liquidity: bigint
  feeGrowthGlobal0X128: bigint
  feeGrowthGlobal1X128: bigint
  volume24hUSD?: number
  tvlUSD?: number
  fees24hUSD?: number
}

export interface PoolWithPrices extends PoolData {
  token0Price: number
  token1Price: number
  token0PriceUSD: number
  token1PriceUSD: number
}
