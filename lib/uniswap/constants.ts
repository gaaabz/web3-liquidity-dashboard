export const Q96 = 2n ** 96n
export const Q128 = 2n ** 128n
export const Q192 = 2n ** 192n

export const MIN_TICK = -887272
export const MAX_TICK = 887272

export const MIN_SQRT_RATIO = 4295128739n
export const MAX_SQRT_RATIO = 1461446703485210103287273052203988822378723970342n

export const FEE_TIERS = {
  LOWEST: 100,
  LOW: 500,
  MEDIUM: 3000,
  HIGH: 10000,
} as const

export type FeeTier = (typeof FEE_TIERS)[keyof typeof FEE_TIERS]

export const TICK_SPACINGS: Record<FeeTier, number> = {
  [FEE_TIERS.LOWEST]: 1,
  [FEE_TIERS.LOW]: 10,
  [FEE_TIERS.MEDIUM]: 60,
  [FEE_TIERS.HIGH]: 200,
}

export const FEE_TIER_LABELS: Record<FeeTier, string> = {
  [FEE_TIERS.LOWEST]: '0.01%',
  [FEE_TIERS.LOW]: '0.05%',
  [FEE_TIERS.MEDIUM]: '0.3%',
  [FEE_TIERS.HIGH]: '1%',
}

export function getTickSpacing(feeTier: FeeTier): number {
  return TICK_SPACINGS[feeTier]
}

export function feeToPercent(fee: FeeTier): number {
  return fee / 1_000_000
}

export function percentToFee(percent: number): FeeTier {
  const fee = Math.round(percent * 1_000_000)
  if (fee === 100 || fee === 500 || fee === 3000 || fee === 10000) {
    return fee as FeeTier
  }
  throw new Error(`Invalid fee tier: ${fee}`)
}
