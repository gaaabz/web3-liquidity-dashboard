import { Q96 } from './constants'
import { tickToSqrtPriceX96 } from './tickMath'

export interface LiquidityAmounts {
  amount0: bigint
  amount1: bigint
}

export function getAmount0ForLiquidity(
  sqrtRatioAX96: bigint,
  sqrtRatioBX96: bigint,
  liquidity: bigint
): bigint {
  const [lower, upper] = sqrtRatioAX96 < sqrtRatioBX96
    ? [sqrtRatioAX96, sqrtRatioBX96]
    : [sqrtRatioBX96, sqrtRatioAX96]

  return (liquidity * Q96 * (upper - lower)) / (upper * lower)
}

export function getAmount1ForLiquidity(
  sqrtRatioAX96: bigint,
  sqrtRatioBX96: bigint,
  liquidity: bigint
): bigint {
  const [lower, upper] = sqrtRatioAX96 < sqrtRatioBX96
    ? [sqrtRatioAX96, sqrtRatioBX96]
    : [sqrtRatioBX96, sqrtRatioAX96]

  return (liquidity * (upper - lower)) / Q96
}

export function getAmountsForLiquidity(
  sqrtPriceX96: bigint,
  sqrtRatioAX96: bigint,
  sqrtRatioBX96: bigint,
  liquidity: bigint
): LiquidityAmounts {
  const [lower, upper] = sqrtRatioAX96 < sqrtRatioBX96
    ? [sqrtRatioAX96, sqrtRatioBX96]
    : [sqrtRatioBX96, sqrtRatioAX96]

  let amount0 = 0n
  let amount1 = 0n

  if (sqrtPriceX96 <= lower) {
    amount0 = getAmount0ForLiquidity(lower, upper, liquidity)
  } else if (sqrtPriceX96 < upper) {
    amount0 = getAmount0ForLiquidity(sqrtPriceX96, upper, liquidity)
    amount1 = getAmount1ForLiquidity(lower, sqrtPriceX96, liquidity)
  } else {
    amount1 = getAmount1ForLiquidity(lower, upper, liquidity)
  }

  return { amount0, amount1 }
}

export function getAmountsForLiquidityByTicks(
  currentTick: number,
  tickLower: number,
  tickUpper: number,
  liquidity: bigint
): LiquidityAmounts {
  const sqrtPriceX96 = tickToSqrtPriceX96(currentTick)
  const sqrtRatioAX96 = tickToSqrtPriceX96(tickLower)
  const sqrtRatioBX96 = tickToSqrtPriceX96(tickUpper)

  return getAmountsForLiquidity(sqrtPriceX96, sqrtRatioAX96, sqrtRatioBX96, liquidity)
}

export function getLiquidityForAmount0(
  sqrtRatioAX96: bigint,
  sqrtRatioBX96: bigint,
  amount0: bigint
): bigint {
  const [lower, upper] = sqrtRatioAX96 < sqrtRatioBX96
    ? [sqrtRatioAX96, sqrtRatioBX96]
    : [sqrtRatioBX96, sqrtRatioAX96]

  return (amount0 * lower * upper) / (Q96 * (upper - lower))
}

export function getLiquidityForAmount1(
  sqrtRatioAX96: bigint,
  sqrtRatioBX96: bigint,
  amount1: bigint
): bigint {
  const [lower, upper] = sqrtRatioAX96 < sqrtRatioBX96
    ? [sqrtRatioAX96, sqrtRatioBX96]
    : [sqrtRatioBX96, sqrtRatioAX96]

  return (amount1 * Q96) / (upper - lower)
}

export function getLiquidityForAmounts(
  sqrtPriceX96: bigint,
  sqrtRatioAX96: bigint,
  sqrtRatioBX96: bigint,
  amount0: bigint,
  amount1: bigint
): bigint {
  const [lower, upper] = sqrtRatioAX96 < sqrtRatioBX96
    ? [sqrtRatioAX96, sqrtRatioBX96]
    : [sqrtRatioBX96, sqrtRatioAX96]

  if (sqrtPriceX96 <= lower) {
    return getLiquidityForAmount0(lower, upper, amount0)
  } else if (sqrtPriceX96 < upper) {
    const liq0 = getLiquidityForAmount0(sqrtPriceX96, upper, amount0)
    const liq1 = getLiquidityForAmount1(lower, sqrtPriceX96, amount1)
    return liq0 < liq1 ? liq0 : liq1
  } else {
    return getLiquidityForAmount1(lower, upper, amount1)
  }
}

export function amountToDecimal(amount: bigint, decimals: number): number {
  return Number(amount) / 10 ** decimals
}

export function decimalToAmount(value: number, decimals: number): bigint {
  return BigInt(Math.floor(value * 10 ** decimals))
}

export function calculateTokenRatio(
  amount0: bigint,
  amount1: bigint,
  decimals0: number,
  decimals1: number,
  token1Price: number
): { token0Percent: number; token1Percent: number } {
  const value0 = amountToDecimal(amount0, decimals0)
  const value1 = amountToDecimal(amount1, decimals1)

  const usdValue0 = value0 * token1Price
  const usdValue1 = value1

  const totalValue = usdValue0 + usdValue1

  if (totalValue === 0) {
    return { token0Percent: 50, token1Percent: 50 }
  }

  return {
    token0Percent: (usdValue0 / totalValue) * 100,
    token1Percent: (usdValue1 / totalValue) * 100,
  }
}

export function calculateLiquidityShare(
  positionLiquidity: bigint,
  poolLiquidity: bigint
): number {
  if (poolLiquidity === 0n) return 0
  return Number((positionLiquidity * 10000n) / poolLiquidity) / 100
}
