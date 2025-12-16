import { tickToSqrtPriceX96, priceToTick, nearestUsableTick } from '../uniswap/tickMath'
import { getAmountsForLiquidity, getLiquidityForAmounts, amountToDecimal, decimalToAmount } from '../uniswap/liquidityMath'
import { getTickSpacing, type FeeTier } from '../uniswap/constants'
import { calculatePositionHealth, getPositionTVL, type PositionHealth } from './positionHealth'
import { calculateImpermanentLoss, type ILResult } from './impermanentLoss'

export interface SimulationWarning {
  type: 'out-of-range' | 'high-concentration' | 'low-liquidity' | 'price-impact' | 'high-slippage'
  severity: 'info' | 'warning' | 'error'
  message: string
}

export interface BaseSimulationResult {
  warnings: SimulationWarning[]
  isValid: boolean
}

export interface RebalanceSimulationInput {
  currentTick: number
  currentTickLower: number
  currentTickUpper: number
  newTickLower: number
  newTickUpper: number
  liquidity: bigint
  feeTier: FeeTier
  token0Decimals: number
  token1Decimals: number
  token0PriceUSD: number
  token1PriceUSD: number
}

export interface RebalanceSimulationResult extends BaseSimulationResult {
  before: {
    tickLower: number
    tickUpper: number
    health: PositionHealth
    tvl: ReturnType<typeof getPositionTVL>
  }
  after: {
    tickLower: number
    tickUpper: number
    health: PositionHealth
    tvl: ReturnType<typeof getPositionTVL>
    newLiquidity: bigint
  }
  delta: {
    rangeWidthChange: number
    concentrationChange: number
    token0Change: number
    token1Change: number
    tvlChangeUSD: number
  }
}

export function simulateRebalance(input: RebalanceSimulationInput): RebalanceSimulationResult {
  const {
    currentTick,
    currentTickLower,
    currentTickUpper,
    newTickLower: rawNewTickLower,
    newTickUpper: rawNewTickUpper,
    liquidity,
    feeTier,
    token0Decimals,
    token1Decimals,
    token0PriceUSD,
    token1PriceUSD,
  } = input

  const warnings: SimulationWarning[] = []
  const tickSpacing = getTickSpacing(feeTier)

  const newTickLower = nearestUsableTick(rawNewTickLower, tickSpacing)
  const newTickUpper = nearestUsableTick(rawNewTickUpper, tickSpacing)

  if (newTickLower >= newTickUpper) {
    warnings.push({
      type: 'out-of-range',
      severity: 'error',
      message: 'Lower tick must be less than upper tick',
    })
    return {
      warnings,
      isValid: false,
      before: {} as RebalanceSimulationResult['before'],
      after: {} as RebalanceSimulationResult['after'],
      delta: {} as RebalanceSimulationResult['delta'],
    }
  }

  const beforeHealth = calculatePositionHealth(
    currentTick,
    currentTickLower,
    currentTickUpper,
    token0Decimals,
    token1Decimals
  )

  const beforeTVL = getPositionTVL(
    currentTick,
    currentTickLower,
    currentTickUpper,
    liquidity,
    token0Decimals,
    token1Decimals,
    token0PriceUSD,
    token1PriceUSD
  )

  const sqrtPriceCurrent = tickToSqrtPriceX96(currentTick)
  const sqrtPriceNewLower = tickToSqrtPriceX96(newTickLower)
  const sqrtPriceNewUpper = tickToSqrtPriceX96(newTickUpper)

  const amount0In = decimalToAmount(beforeTVL.amount0, token0Decimals)
  const amount1In = decimalToAmount(beforeTVL.amount1, token1Decimals)

  const newLiquidity = getLiquidityForAmounts(
    sqrtPriceCurrent,
    sqrtPriceNewLower,
    sqrtPriceNewUpper,
    amount0In,
    amount1In
  )

  const afterHealth = calculatePositionHealth(
    currentTick,
    newTickLower,
    newTickUpper,
    token0Decimals,
    token1Decimals
  )

  const afterTVL = getPositionTVL(
    currentTick,
    newTickLower,
    newTickUpper,
    newLiquidity,
    token0Decimals,
    token1Decimals,
    token0PriceUSD,
    token1PriceUSD
  )

  if (!afterHealth.isInRange) {
    warnings.push({
      type: 'out-of-range',
      severity: 'warning',
      message: 'The new range does not include the current price',
    })
  }

  if (afterHealth.rangeWidthPercent < 2) {
    warnings.push({
      type: 'high-concentration',
      severity: 'warning',
      message: 'Very narrow range increases risk of going out of range',
    })
  }

  const delta = {
    rangeWidthChange: afterHealth.rangeWidthPercent - beforeHealth.rangeWidthPercent,
    concentrationChange: afterHealth.concentration - beforeHealth.concentration,
    token0Change: afterTVL.amount0 - beforeTVL.amount0,
    token1Change: afterTVL.amount1 - beforeTVL.amount1,
    tvlChangeUSD: afterTVL.tvlUSD - beforeTVL.tvlUSD,
  }

  return {
    warnings,
    isValid: true,
    before: {
      tickLower: currentTickLower,
      tickUpper: currentTickUpper,
      health: beforeHealth,
      tvl: beforeTVL,
    },
    after: {
      tickLower: newTickLower,
      tickUpper: newTickUpper,
      health: afterHealth,
      tvl: afterTVL,
      newLiquidity,
    },
    delta,
  }
}

export interface LiquidityChangeInput {
  currentTick: number
  tickLower: number
  tickUpper: number
  currentLiquidity: bigint
  changeAmount: bigint
  isIncrease: boolean
  token0Decimals: number
  token1Decimals: number
  token0PriceUSD: number
  token1PriceUSD: number
}

export interface LiquidityChangeResult extends BaseSimulationResult {
  before: {
    liquidity: bigint
    tvl: ReturnType<typeof getPositionTVL>
  }
  after: {
    liquidity: bigint
    tvl: ReturnType<typeof getPositionTVL>
  }
  delta: {
    liquidityChange: bigint
    liquidityChangePercent: number
    token0Change: number
    token1Change: number
    tvlChangeUSD: number
  }
  requiredAmounts?: {
    token0: number
    token1: number
    token0USD: number
    token1USD: number
    totalUSD: number
  }
}

export function simulateLiquidityChange(input: LiquidityChangeInput): LiquidityChangeResult {
  const {
    currentTick,
    tickLower,
    tickUpper,
    currentLiquidity,
    changeAmount,
    isIncrease,
    token0Decimals,
    token1Decimals,
    token0PriceUSD,
    token1PriceUSD,
  } = input

  const warnings: SimulationWarning[] = []

  const beforeTVL = getPositionTVL(
    currentTick,
    tickLower,
    tickUpper,
    currentLiquidity,
    token0Decimals,
    token1Decimals,
    token0PriceUSD,
    token1PriceUSD
  )

  let newLiquidity: bigint
  if (isIncrease) {
    newLiquidity = currentLiquidity + changeAmount
  } else {
    if (changeAmount > currentLiquidity) {
      warnings.push({
        type: 'low-liquidity',
        severity: 'error',
        message: 'Cannot decrease by more than current liquidity',
      })
      newLiquidity = 0n
    } else {
      newLiquidity = currentLiquidity - changeAmount
    }
  }

  const afterTVL = getPositionTVL(
    currentTick,
    tickLower,
    tickUpper,
    newLiquidity,
    token0Decimals,
    token1Decimals,
    token0PriceUSD,
    token1PriceUSD
  )

  const liquidityChangePercent = currentLiquidity !== 0n
    ? (Number(changeAmount) / Number(currentLiquidity)) * 100
    : 0

  const delta = {
    liquidityChange: isIncrease ? changeAmount : -changeAmount,
    liquidityChangePercent: isIncrease ? liquidityChangePercent : -liquidityChangePercent,
    token0Change: afterTVL.amount0 - beforeTVL.amount0,
    token1Change: afterTVL.amount1 - beforeTVL.amount1,
    tvlChangeUSD: afterTVL.tvlUSD - beforeTVL.tvlUSD,
  }

  let requiredAmounts
  if (isIncrease) {
    const sqrtPriceCurrent = tickToSqrtPriceX96(currentTick)
    const sqrtPriceLower = tickToSqrtPriceX96(tickLower)
    const sqrtPriceUpper = tickToSqrtPriceX96(tickUpper)

    const amounts = getAmountsForLiquidity(
      sqrtPriceCurrent,
      sqrtPriceLower,
      sqrtPriceUpper,
      changeAmount
    )

    const token0 = amountToDecimal(amounts.amount0, token0Decimals)
    const token1 = amountToDecimal(amounts.amount1, token1Decimals)
    const token0USD = token0 * token0PriceUSD
    const token1USD = token1 * token1PriceUSD

    requiredAmounts = {
      token0,
      token1,
      token0USD,
      token1USD,
      totalUSD: token0USD + token1USD,
    }
  }

  return {
    warnings,
    isValid: warnings.every(w => w.severity !== 'error'),
    before: {
      liquidity: currentLiquidity,
      tvl: beforeTVL,
    },
    after: {
      liquidity: newLiquidity,
      tvl: afterTVL,
    },
    delta,
    requiredAmounts,
  }
}

export interface PriceScenarioInput {
  currentTick: number
  tickLower: number
  tickUpper: number
  liquidity: bigint
  targetPrices: number[]
  token0Decimals: number
  token1Decimals: number
  token0PriceUSD: number
  token1PriceUSD: number
}

export interface PriceScenarioResult {
  scenarios: Array<{
    targetPrice: number
    targetTick: number
    health: PositionHealth
    tvl: ReturnType<typeof getPositionTVL>
    il: ILResult
  }>
}

export function simulatePriceScenarios(input: PriceScenarioInput): PriceScenarioResult {
  const {
    currentTick,
    tickLower,
    tickUpper,
    liquidity,
    targetPrices,
    token0Decimals,
    token1Decimals,
    token0PriceUSD,
    token1PriceUSD,
  } = input

  const scenarios = targetPrices.map(targetPrice => {
    const targetTick = priceToTick(targetPrice, token0Decimals, token1Decimals)

    const health = calculatePositionHealth(
      targetTick,
      tickLower,
      tickUpper,
      token0Decimals,
      token1Decimals
    )

    const priceRatio = targetPrice / (token0PriceUSD / token1PriceUSD)
    const adjustedToken0PriceUSD = token0PriceUSD * priceRatio

    const tvl = getPositionTVL(
      targetTick,
      tickLower,
      tickUpper,
      liquidity,
      token0Decimals,
      token1Decimals,
      adjustedToken0PriceUSD,
      token1PriceUSD
    )

    const il = calculateImpermanentLoss({
      tickLower,
      tickUpper,
      tickAtEntry: currentTick,
      tickCurrent: targetTick,
      liquidity,
      token0Decimals,
      token1Decimals,
      token0PriceUSD: adjustedToken0PriceUSD,
      token1PriceUSD,
    })

    return {
      targetPrice,
      targetTick,
      health,
      tvl,
      il,
    }
  })

  return { scenarios }
}
