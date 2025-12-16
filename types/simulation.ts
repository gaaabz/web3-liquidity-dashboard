export type SimulationType = 'rebalance' | 'increase' | 'decrease'

export type SimulationWarningSeverity = 'info' | 'warning' | 'error'

export interface SimulationWarning {
  type: 'out-of-range' | 'high-concentration' | 'low-liquidity' | 'price-impact' | 'high-slippage'
  severity: SimulationWarningSeverity
  message: string
}

export interface SimulationDelta {
  rangeWidthChange: number
  concentrationChange: number
  token0Change: number
  token1Change: number
  tvlChangeUSD: number
  liquidityChange?: bigint
  liquidityChangePercent?: number
}

export interface SimulationTVL {
  tvlUSD: number
  amount0: number
  amount1: number
  amount0USD: number
  amount1USD: number
}

export interface BaseSimulationResult {
  warnings: SimulationWarning[]
  isValid: boolean
}

export interface RebalanceResult extends BaseSimulationResult {
  before: {
    tickLower: number
    tickUpper: number
    tvl: SimulationTVL
    rangeWidthPercent: number
  }
  after: {
    tickLower: number
    tickUpper: number
    tvl: SimulationTVL
    rangeWidthPercent: number
    newLiquidity: bigint
  }
  delta: SimulationDelta
}

export interface LiquidityChangeResult extends BaseSimulationResult {
  before: {
    liquidity: bigint
    tvl: SimulationTVL
  }
  after: {
    liquidity: bigint
    tvl: SimulationTVL
  }
  delta: SimulationDelta
  requiredAmounts?: {
    token0: number
    token1: number
    token0USD: number
    token1USD: number
    totalUSD: number
  }
}
