import type { SupportedChainId } from '@/lib/constants/chains'
import type { RangeStatus } from '@/lib/calculations/positionHealth'

export interface TokenData {
  address: `0x${string}`
  name: string
  symbol: string
  decimals: number
}

export interface PoolInfo {
  address: `0x${string}`
  token0: TokenData
  token1: TokenData
  fee: number
  tickSpacing: number
  sqrtPriceX96: bigint
  currentTick: number
  liquidity: bigint
}

export interface LPPosition {
  tokenId: bigint
  owner: `0x${string}`
  chainId: SupportedChainId
  pool: PoolInfo
  tickLower: number
  tickUpper: number
  liquidity: bigint
  amount0: number
  amount1: number
  feeGrowthInside0LastX128: bigint
  feeGrowthInside1LastX128: bigint
  tokensOwed0: bigint
  tokensOwed1: bigint
  isInRange: boolean
  rangeStatus: RangeStatus
}

export interface LPPositionWithMetrics extends LPPosition {
  tvlUSD: number
  feesUSD: number
  impermanentLossUSD: number
  impermanentLossPercent: number
  netPnLUSD: number
  feeAPR: number
}
