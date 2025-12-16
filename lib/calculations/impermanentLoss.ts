import { tickToSqrtPriceX96 } from '../uniswap/tickMath'
import { getAmountsForLiquidity, amountToDecimal } from '../uniswap/liquidityMath'

export interface ILCalculationInput {
  tickLower: number
  tickUpper: number
  tickAtEntry: number
  tickCurrent: number
  liquidity: bigint
  token0Decimals: number
  token1Decimals: number
  token0PriceUSD: number
  token1PriceUSD: number
}

export interface ILResult {
  currentValueUSD: number
  hodlValueUSD: number
  impermanentLossUSD: number
  impermanentLossPercent: number
  currentAmounts: {
    token0: number
    token1: number
  }
  hodlAmounts: {
    token0: number
    token1: number
  }
}

export function calculateImpermanentLoss(input: ILCalculationInput): ILResult {
  const {
    tickLower,
    tickUpper,
    tickAtEntry,
    tickCurrent,
    liquidity,
    token0Decimals,
    token1Decimals,
    token0PriceUSD,
    token1PriceUSD,
  } = input

  const sqrtPriceAtEntry = tickToSqrtPriceX96(tickAtEntry)
  const sqrtPriceCurrent = tickToSqrtPriceX96(tickCurrent)
  const sqrtPriceLower = tickToSqrtPriceX96(tickLower)
  const sqrtPriceUpper = tickToSqrtPriceX96(tickUpper)

  const entryAmounts = getAmountsForLiquidity(
    sqrtPriceAtEntry,
    sqrtPriceLower,
    sqrtPriceUpper,
    liquidity
  )

  const currentAmounts = getAmountsForLiquidity(
    sqrtPriceCurrent,
    sqrtPriceLower,
    sqrtPriceUpper,
    liquidity
  )

  const entryToken0 = amountToDecimal(entryAmounts.amount0, token0Decimals)
  const entryToken1 = amountToDecimal(entryAmounts.amount1, token1Decimals)

  const currentToken0 = amountToDecimal(currentAmounts.amount0, token0Decimals)
  const currentToken1 = amountToDecimal(currentAmounts.amount1, token1Decimals)

  const currentValueUSD =
    currentToken0 * token0PriceUSD + currentToken1 * token1PriceUSD

  const hodlValueUSD =
    entryToken0 * token0PriceUSD + entryToken1 * token1PriceUSD

  const impermanentLossUSD = currentValueUSD - hodlValueUSD
  const impermanentLossPercent = hodlValueUSD !== 0
    ? (impermanentLossUSD / hodlValueUSD) * 100
    : 0

  return {
    currentValueUSD,
    hodlValueUSD,
    impermanentLossUSD,
    impermanentLossPercent,
    currentAmounts: {
      token0: currentToken0,
      token1: currentToken1,
    },
    hodlAmounts: {
      token0: entryToken0,
      token1: entryToken1,
    },
  }
}

export function calculateILFromPriceChange(
  priceRatio: number
): number {
  if (priceRatio <= 0) return 0

  const sqrtRatio = Math.sqrt(priceRatio)
  const il = (2 * sqrtRatio) / (1 + priceRatio) - 1

  return il * 100
}

export function calculateNetPnL(
  ilResult: ILResult,
  feesEarnedUSD: number
): {
  netPnLUSD: number
  netPnLPercent: number
  feesVsIL: 'profit' | 'loss' | 'break-even'
} {
  const netPnLUSD = ilResult.impermanentLossUSD + feesEarnedUSD
  const netPnLPercent = ilResult.hodlValueUSD !== 0
    ? (netPnLUSD / ilResult.hodlValueUSD) * 100
    : 0

  let feesVsIL: 'profit' | 'loss' | 'break-even'
  if (netPnLUSD > 0.01) {
    feesVsIL = 'profit'
  } else if (netPnLUSD < -0.01) {
    feesVsIL = 'loss'
  } else {
    feesVsIL = 'break-even'
  }

  return { netPnLUSD, netPnLPercent, feesVsIL }
}

export function estimateILAtPrices(
  currentPrice: number,
  targetPrice: number,
  lowerPrice: number,
  upperPrice: number,
  token0Amount: number,
  token1Amount: number
): {
  projectedILPercent: number
  projectedValueUSD: number
  hodlValueUSD: number
} {
  const hodlValueUSD = token0Amount * targetPrice + token1Amount

  const L = Math.sqrt(token0Amount * token1Amount) * Math.sqrt(lowerPrice * upperPrice) /
    (Math.sqrt(upperPrice) - Math.sqrt(lowerPrice))

  let projectedToken0: number
  let projectedToken1: number

  if (targetPrice <= lowerPrice) {
    projectedToken0 = L * (Math.sqrt(upperPrice) - Math.sqrt(lowerPrice)) / (Math.sqrt(lowerPrice) * Math.sqrt(upperPrice))
    projectedToken1 = 0
  } else if (targetPrice >= upperPrice) {
    projectedToken0 = 0
    projectedToken1 = L * (Math.sqrt(upperPrice) - Math.sqrt(lowerPrice))
  } else {
    projectedToken0 = L * (Math.sqrt(upperPrice) - Math.sqrt(targetPrice)) / (Math.sqrt(targetPrice) * Math.sqrt(upperPrice))
    projectedToken1 = L * (Math.sqrt(targetPrice) - Math.sqrt(lowerPrice))
  }

  const projectedValueUSD = projectedToken0 * targetPrice + projectedToken1
  const projectedILPercent = hodlValueUSD !== 0
    ? ((projectedValueUSD - hodlValueUSD) / hodlValueUSD) * 100
    : 0

  return {
    projectedILPercent,
    projectedValueUSD,
    hodlValueUSD,
  }
}
