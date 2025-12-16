export interface PositionMetrics {
  amount0: number
  amount1: number
  amount0USD: number
  amount1USD: number
  tvlUSD: number

  uncollectedFees0: number
  uncollectedFees1: number
  uncollectedFees0USD: number
  uncollectedFees1USD: number
  uncollectedFeesUSD: number

  currentPrice: number
  lowerPrice: number
  upperPrice: number

  isInRange: boolean
  distanceToLowerPercent: number
  distanceToUpperPercent: number
  rangeWidthPercent: number
  concentration: number

  hodlValueUSD: number
  impermanentLossUSD: number
  impermanentLossPercent: number
  netPnLUSD: number

  token0Percent: number
  token1Percent: number

  feeAPR: number
}

export interface PortfolioMetrics {
  totalTVL: number
  totalFeesUSD: number
  positionsCount: number
  inRangeCount: number
  outOfRangeCount: number
  avgFeeAPR: number
  totalImpermanentLossUSD: number
  totalNetPnLUSD: number
}

export type RiskLevel = 'low' | 'medium' | 'high'

export interface PositionCategory {
  category: 'aggressive' | 'moderate' | 'conservative' | 'full-range'
  description: string
  riskLevel: RiskLevel
}
