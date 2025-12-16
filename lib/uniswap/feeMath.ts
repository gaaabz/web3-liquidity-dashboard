import { Q128 } from './constants'
import { amountToDecimal } from './liquidityMath'

export interface UncollectedFees {
  token0: bigint
  token1: bigint
  token0Formatted: number
  token1Formatted: number
}

export interface FeeGrowthData {
  feeGrowthGlobal0X128: bigint
  feeGrowthGlobal1X128: bigint
  feeGrowthOutsideLower0X128: bigint
  feeGrowthOutsideLower1X128: bigint
  feeGrowthOutsideUpper0X128: bigint
  feeGrowthOutsideUpper1X128: bigint
  feeGrowthInsideLast0X128: bigint
  feeGrowthInsideLast1X128: bigint
}

export function calculateFeeGrowthInside(
  tickCurrent: number,
  tickLower: number,
  tickUpper: number,
  feeGrowthGlobal0X128: bigint,
  feeGrowthGlobal1X128: bigint,
  feeGrowthOutsideLower0X128: bigint,
  feeGrowthOutsideLower1X128: bigint,
  feeGrowthOutsideUpper0X128: bigint,
  feeGrowthOutsideUpper1X128: bigint
): { feeGrowthInside0X128: bigint; feeGrowthInside1X128: bigint } {
  let feeGrowthBelow0X128: bigint
  let feeGrowthBelow1X128: bigint

  if (tickCurrent >= tickLower) {
    feeGrowthBelow0X128 = feeGrowthOutsideLower0X128
    feeGrowthBelow1X128 = feeGrowthOutsideLower1X128
  } else {
    feeGrowthBelow0X128 = feeGrowthGlobal0X128 - feeGrowthOutsideLower0X128
    feeGrowthBelow1X128 = feeGrowthGlobal1X128 - feeGrowthOutsideLower1X128
  }

  let feeGrowthAbove0X128: bigint
  let feeGrowthAbove1X128: bigint

  if (tickCurrent < tickUpper) {
    feeGrowthAbove0X128 = feeGrowthOutsideUpper0X128
    feeGrowthAbove1X128 = feeGrowthOutsideUpper1X128
  } else {
    feeGrowthAbove0X128 = feeGrowthGlobal0X128 - feeGrowthOutsideUpper0X128
    feeGrowthAbove1X128 = feeGrowthGlobal1X128 - feeGrowthOutsideUpper1X128
  }

  const feeGrowthInside0X128 = feeGrowthGlobal0X128 - feeGrowthBelow0X128 - feeGrowthAbove0X128
  const feeGrowthInside1X128 = feeGrowthGlobal1X128 - feeGrowthBelow1X128 - feeGrowthAbove1X128

  return { feeGrowthInside0X128, feeGrowthInside1X128 }
}

export function calculateUncollectedFees(
  liquidity: bigint,
  feeGrowthInside0X128: bigint,
  feeGrowthInside1X128: bigint,
  feeGrowthInsideLast0X128: bigint,
  feeGrowthInsideLast1X128: bigint,
  tokensOwed0: bigint,
  tokensOwed1: bigint,
  decimals0: number,
  decimals1: number
): UncollectedFees {
  const MAX_UINT128 = (1n << 128n) - 1n

  let feeGrowth0Delta = feeGrowthInside0X128 - feeGrowthInsideLast0X128
  if (feeGrowth0Delta < 0n) {
    feeGrowth0Delta = feeGrowth0Delta + MAX_UINT128 + 1n
  }

  let feeGrowth1Delta = feeGrowthInside1X128 - feeGrowthInsideLast1X128
  if (feeGrowth1Delta < 0n) {
    feeGrowth1Delta = feeGrowth1Delta + MAX_UINT128 + 1n
  }

  const fees0 = (liquidity * feeGrowth0Delta) / Q128 + tokensOwed0
  const fees1 = (liquidity * feeGrowth1Delta) / Q128 + tokensOwed1

  return {
    token0: fees0,
    token1: fees1,
    token0Formatted: amountToDecimal(fees0, decimals0),
    token1Formatted: amountToDecimal(fees1, decimals1),
  }
}

export function estimateFeeAPR(
  fees24h: number,
  tvlUSD: number
): number {
  if (tvlUSD === 0) return 0
  const dailyReturn = fees24h / tvlUSD
  return dailyReturn * 365 * 100
}

export function estimateFeeAPRFromVolume(
  volume24h: number,
  feeTier: number,
  tvlUSD: number
): number {
  if (tvlUSD === 0) return 0
  const feePercent = feeTier / 1_000_000
  const fees24h = volume24h * feePercent
  return estimateFeeAPR(fees24h, tvlUSD)
}

export function calculateFeesUSD(
  token0Fees: number,
  token1Fees: number,
  token0PriceUSD: number,
  token1PriceUSD: number
): number {
  return token0Fees * token0PriceUSD + token1Fees * token1PriceUSD
}

export function projectedFeesAtPrice(
  currentTick: number,
  tickLower: number,
  tickUpper: number,
  liquidity: bigint,
  volume24h: number,
  feeTier: number,
  poolLiquidity: bigint
): number {
  const isInRange = currentTick >= tickLower && currentTick < tickUpper

  if (!isInRange || poolLiquidity === 0n) {
    return 0
  }

  const liquidityShare = Number(liquidity) / Number(poolLiquidity)
  const feePercent = feeTier / 1_000_000
  const poolFees24h = volume24h * feePercent

  return poolFees24h * liquidityShare
}
