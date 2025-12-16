'use client'

import { useQuery } from '@tanstack/react-query'
import { useWallet } from '@/hooks/wallet'
import { queryKeys } from '@/lib/query/keys'
import {
  getPosition,
  getPoolAddress,
  getPoolData,
  getTokenData,
} from '@/lib/contracts/readService'
import type { SupportedChainId } from '@/lib/constants/chains'
import type { LPPosition } from '@/types/position'
import { getAmountsForLiquidityByTicks, amountToDecimal } from '@/lib/uniswap/liquidityMath'
import { calculatePositionHealth } from '@/lib/calculations/positionHealth'

export interface UsePositionReturn {
  position: LPPosition | null
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

async function fetchPosition(
  tokenId: bigint,
  chainId: SupportedChainId
): Promise<LPPosition | null> {
  const posRaw = await getPosition(tokenId, chainId)

  if (posRaw.liquidity === 0n) {
    return null
  }

  const [token0Data, token1Data] = await Promise.all([
    getTokenData(posRaw.token0, chainId),
    getTokenData(posRaw.token1, chainId),
  ])

  const poolAddress = await getPoolAddress(
    posRaw.token0,
    posRaw.token1,
    posRaw.fee,
    chainId
  )

  const poolData = await getPoolData(poolAddress, chainId)

  const currentTick = poolData.slot0.tick

  const amounts = getAmountsForLiquidityByTicks(
    currentTick,
    posRaw.tickLower,
    posRaw.tickUpper,
    posRaw.liquidity
  )

  const amount0 = amountToDecimal(amounts.amount0, token0Data.decimals)
  const amount1 = amountToDecimal(amounts.amount1, token1Data.decimals)

  const health = calculatePositionHealth(
    currentTick,
    posRaw.tickLower,
    posRaw.tickUpper,
    token0Data.decimals,
    token1Data.decimals
  )

  return {
    tokenId,
    owner: posRaw.operator,
    chainId,
    pool: {
      address: poolAddress,
      token0: token0Data,
      token1: token1Data,
      fee: posRaw.fee,
      tickSpacing: poolData.tickSpacing,
      sqrtPriceX96: poolData.slot0.sqrtPriceX96,
      currentTick,
      liquidity: poolData.liquidity,
    },
    tickLower: posRaw.tickLower,
    tickUpper: posRaw.tickUpper,
    liquidity: posRaw.liquidity,
    amount0,
    amount1,
    feeGrowthInside0LastX128: posRaw.feeGrowthInside0LastX128,
    feeGrowthInside1LastX128: posRaw.feeGrowthInside1LastX128,
    tokensOwed0: posRaw.tokensOwed0,
    tokensOwed1: posRaw.tokensOwed1,
    isInRange: health.isInRange,
    rangeStatus: health.status,
  }
}

export function usePosition(tokenId: bigint | undefined): UsePositionReturn {
  const { chainId, isConnected } = useWallet()

  const {
    data: position = null,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.positions.detail(chainId as SupportedChainId, tokenId?.toString() ?? ''),
    queryFn: () => fetchPosition(tokenId!, chainId as SupportedChainId),
    enabled: isConnected && !!tokenId && !!chainId,
    staleTime: 15_000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  return {
    position,
    isLoading,
    isFetching,
    isError,
    error: error as Error | null,
    refetch,
  }
}
