import { tickToPrice } from '../uniswap/tickMath'
import { getAmountsForLiquidityByTicks, amountToDecimal } from '../uniswap/liquidityMath'

export type RangeStatus = 'in-range' | 'out-of-range-below' | 'out-of-range-above'

export interface PositionHealth {
  status: RangeStatus
  isInRange: boolean
  currentTick: number
  tickLower: number
  tickUpper: number
  currentPrice: number
  lowerPrice: number
  upperPrice: number
  rangeWidthPercent: number
  distanceToLowerPercent: number
  distanceToUpperPercent: number
  ticksFromLower: number
  ticksFromUpper: number
  concentration: number
}

export function calculatePositionHealth(
  currentTick: number,
  tickLower: number,
  tickUpper: number,
  token0Decimals: number,
  token1Decimals: number
): PositionHealth {
  const currentPrice = tickToPrice(currentTick, token0Decimals, token1Decimals)
  const lowerPrice = tickToPrice(tickLower, token0Decimals, token1Decimals)
  const upperPrice = tickToPrice(tickUpper, token0Decimals, token1Decimals)

  const isInRange = currentTick >= tickLower && currentTick < tickUpper

  let status: RangeStatus
  if (currentTick < tickLower) {
    status = 'out-of-range-below'
  } else if (currentTick >= tickUpper) {
    status = 'out-of-range-above'
  } else {
    status = 'in-range'
  }

  const rangeWidthPercent = ((upperPrice - lowerPrice) / lowerPrice) * 100

  const distanceToLowerPercent = lowerPrice !== 0
    ? ((currentPrice - lowerPrice) / lowerPrice) * 100
    : 0

  const distanceToUpperPercent = currentPrice !== 0
    ? ((upperPrice - currentPrice) / currentPrice) * 100
    : 0

  const ticksFromLower = currentTick - tickLower
  const ticksFromUpper = tickUpper - currentTick

  const tickRange = tickUpper - tickLower
  const fullRange = 887272 * 2
  const concentration = (fullRange / tickRange) * 100

  return {
    status,
    isInRange,
    currentTick,
    tickLower,
    tickUpper,
    currentPrice,
    lowerPrice,
    upperPrice,
    rangeWidthPercent,
    distanceToLowerPercent,
    distanceToUpperPercent,
    ticksFromLower,
    ticksFromUpper,
    concentration,
  }
}

export function getPositionTVL(
  currentTick: number,
  tickLower: number,
  tickUpper: number,
  liquidity: bigint,
  token0Decimals: number,
  token1Decimals: number,
  token0PriceUSD: number,
  token1PriceUSD: number
): {
  tvlUSD: number
  amount0: number
  amount1: number
  amount0USD: number
  amount1USD: number
} {
  const amounts = getAmountsForLiquidityByTicks(
    currentTick,
    tickLower,
    tickUpper,
    liquidity
  )

  const amount0 = amountToDecimal(amounts.amount0, token0Decimals)
  const amount1 = amountToDecimal(amounts.amount1, token1Decimals)

  const amount0USD = amount0 * token0PriceUSD
  const amount1USD = amount1 * token1PriceUSD
  const tvlUSD = amount0USD + amount1USD

  return {
    tvlUSD,
    amount0,
    amount1,
    amount0USD,
    amount1USD,
  }
}

export function calculateRangeRecommendation(
  currentTick: number,
  volatility: number
): {
  tickLower: number
  tickUpper: number
  rangeWidthTicks: number
} {
  const volatilityFactor = Math.max(0.1, Math.min(volatility, 100))
  const rangeWidthTicks = Math.round(volatilityFactor * 100)

  const halfRange = Math.floor(rangeWidthTicks / 2)
  const tickLower = currentTick - halfRange
  const tickUpper = currentTick + halfRange

  return {
    tickLower,
    tickUpper,
    rangeWidthTicks,
  }
}

export function estimateTimeInRange(
  rangeWidthPercent: number,
  dailyVolatilityPercent: number
): {
  estimatedDays: number
  probability7Days: number
  probability30Days: number
} {
  if (dailyVolatilityPercent <= 0) {
    return {
      estimatedDays: Infinity,
      probability7Days: 100,
      probability30Days: 100,
    }
  }

  const halfRange = rangeWidthPercent / 2
  const dailyMovement = dailyVolatilityPercent

  const estimatedDays = Math.pow(halfRange / dailyMovement, 2)

  const z7 = halfRange / (dailyMovement * Math.sqrt(7))
  const z30 = halfRange / (dailyMovement * Math.sqrt(30))

  const probability7Days = Math.min(100, erf(z7 / Math.sqrt(2)) * 100)
  const probability30Days = Math.min(100, erf(z30 / Math.sqrt(2)) * 100)

  return {
    estimatedDays: Math.round(estimatedDays * 10) / 10,
    probability7Days: Math.round(probability7Days * 10) / 10,
    probability30Days: Math.round(probability30Days * 10) / 10,
  }
}

function erf(x: number): number {
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911

  const sign = x < 0 ? -1 : 1
  x = Math.abs(x)

  const t = 1.0 / (1.0 + p * x)
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)

  return sign * y
}

export function categorizePosition(health: PositionHealth): {
  category: 'aggressive' | 'moderate' | 'conservative' | 'full-range'
  description: string
  riskLevel: 'low' | 'medium' | 'high'
} {
  const { rangeWidthPercent } = health

  if (rangeWidthPercent < 5) {
    return {
      category: 'aggressive',
      description: 'Highly concentrated position with maximum capital efficiency',
      riskLevel: 'high',
    }
  }

  if (rangeWidthPercent < 20) {
    return {
      category: 'moderate',
      description: 'Balanced concentration with good capital efficiency',
      riskLevel: 'medium',
    }
  }

  if (rangeWidthPercent < 100) {
    return {
      category: 'conservative',
      description: 'Wide range providing stability over efficiency',
      riskLevel: 'low',
    }
  }

  return {
    category: 'full-range',
    description: 'Full range position similar to Uniswap V2',
    riskLevel: 'low',
  }
}
