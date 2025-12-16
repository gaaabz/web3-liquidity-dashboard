import type { LPPosition } from '@/types/position'
import { DEMO_TOKENS, TOKEN_PRICES_USD } from './tokens'

const DEMO_OWNER = '0x1234567890123456789012345678901234567890' as `0x${string}`

export const DEMO_POSITIONS: LPPosition[] = [
  {
    tokenId: 12345n,
    owner: DEMO_OWNER,
    chainId: 11155111,
    pool: {
      address: '0xC31E54c7a869B9FcBEcc14363CF510d1c41fa443' as `0x${string}`,
      token0: DEMO_TOKENS.WETH,
      token1: DEMO_TOKENS.USDC,
      fee: 3000,
      tickSpacing: 60,
      sqrtPriceX96: 1993203012657560471782n,
      currentTick: -198000,
      liquidity: 50000000000000000000n,
    },
    tickLower: -199200,
    tickUpper: -196800,
    liquidity: 1500000000000000000n,
    amount0: 0.45,
    amount1: 1125.50,
    feeGrowthInside0LastX128: 0n,
    feeGrowthInside1LastX128: 0n,
    tokensOwed0: 5000000000000000n,
    tokensOwed1: 12500000n,
    isInRange: true,
    rangeStatus: 'in-range',
  },
  {
    tokenId: 12346n,
    owner: DEMO_OWNER,
    chainId: 11155111,
    pool: {
      address: '0xC31E54c7a869B9FcBEcc14363CF510d1c41fa443' as `0x${string}`,
      token0: DEMO_TOKENS.WETH,
      token1: DEMO_TOKENS.USDC,
      fee: 500,
      tickSpacing: 10,
      sqrtPriceX96: 1993203012657560471782n,
      currentTick: -198000,
      liquidity: 80000000000000000000n,
    },
    tickLower: -198500,
    tickUpper: -197500,
    liquidity: 2500000000000000000n,
    amount0: 0.75,
    amount1: 1875.25,
    feeGrowthInside0LastX128: 0n,
    feeGrowthInside1LastX128: 0n,
    tokensOwed0: 8000000000000000n,
    tokensOwed1: 18750000n,
    isInRange: true,
    rangeStatus: 'in-range',
  },
  {
    tokenId: 12347n,
    owner: DEMO_OWNER,
    chainId: 11155111,
    pool: {
      address: '0xD3A8976FC4a8a89F5b0B1F6A24e05F5F02C5c431' as `0x${string}`,
      token0: DEMO_TOKENS.WETH,
      token1: DEMO_TOKENS.DAI,
      fee: 3000,
      tickSpacing: 60,
      sqrtPriceX96: 3954173882674103714528870n,
      currentTick: 78244,
      liquidity: 30000000000000000000n,
    },
    tickLower: 76800,
    tickUpper: 77400,
    liquidity: 800000000000000000n,
    amount0: 0.0,
    amount1: 1960.00,
    feeGrowthInside0LastX128: 0n,
    feeGrowthInside1LastX128: 0n,
    tokensOwed0: 0n,
    tokensOwed1: 45000000000000000000n,
    isInRange: false,
    rangeStatus: 'out-of-range-above',
  },
  {
    tokenId: 12348n,
    owner: DEMO_OWNER,
    chainId: 11155111,
    pool: {
      address: '0xE5F8B1F8A5C6D3E2A1B0C9D8E7F6A5B4C3D2E1F0' as `0x${string}`,
      token0: DEMO_TOKENS.LINK,
      token1: DEMO_TOKENS.WETH,
      fee: 3000,
      tickSpacing: 60,
      sqrtPriceX96: 6113140049207692037n,
      currentTick: -51193,
      liquidity: 15000000000000000000n,
    },
    tickLower: -52200,
    tickUpper: -50400,
    liquidity: 600000000000000000n,
    amount0: 85.5,
    amount1: 0.12,
    feeGrowthInside0LastX128: 0n,
    feeGrowthInside1LastX128: 0n,
    tokensOwed0: 2500000000000000000n,
    tokensOwed1: 500000000000000n,
    isInRange: true,
    rangeStatus: 'in-range',
  },
  {
    tokenId: 12349n,
    owner: DEMO_OWNER,
    chainId: 11155111,
    pool: {
      address: '0xF1E2D3C4B5A6978899AABBCCDDEEFF0011223344' as `0x${string}`,
      token0: DEMO_TOKENS.USDC,
      token1: DEMO_TOKENS.DAI,
      fee: 100,
      tickSpacing: 1,
      sqrtPriceX96: 79228162514264337593543950336000000n,
      currentTick: 276324,
      liquidity: 100000000000000000000n,
    },
    tickLower: 276314,
    tickUpper: 276334,
    liquidity: 5000000000000000000n,
    amount0: 2500.00,
    amount1: 2500.00,
    feeGrowthInside0LastX128: 0n,
    feeGrowthInside1LastX128: 0n,
    tokensOwed0: 1250000n,
    tokensOwed1: 1250000000000000000n,
    isInRange: true,
    rangeStatus: 'in-range',
  },
]

export function getDemoPositionMetrics() {
  const totalTVL = DEMO_POSITIONS.reduce((acc, pos) => {
    const token0Value = pos.amount0 * TOKEN_PRICES_USD[pos.pool.token0.symbol]
    const token1Value = pos.amount1 * TOKEN_PRICES_USD[pos.pool.token1.symbol]
    return acc + token0Value + token1Value
  }, 0)

  const inRangeCount = DEMO_POSITIONS.filter(p => p.isInRange).length
  const outOfRangeCount = DEMO_POSITIONS.length - inRangeCount

  const totalFees = 127.45

  return {
    totalTVL,
    totalFees,
    positionsCount: DEMO_POSITIONS.length,
    inRangeCount,
    outOfRangeCount,
  }
}
