'use client'

import { useQuery } from '@tanstack/react-query'
import { useWallet } from '@/hooks/wallet'
import { queryKeys } from '@/lib/query/keys'
import {
  getPositionTokenIds,
  getPositions,
  getPoolAddress,
  getPoolData,
  getTokensData,
  type PositionRawData,
  type PoolData,
  type TokenData,
} from '@/lib/contracts/readService'
import type { SupportedChainId } from '@/lib/constants/chains'
import type { LPPosition } from '@/types/position'
import { getAmountsForLiquidityByTicks, amountToDecimal } from '@/lib/uniswap/liquidityMath'
import { calculatePositionHealth } from '@/lib/calculations/positionHealth'

export interface UseUniswapPositionsReturn {
  positions: LPPosition[]
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

async function fetchPositionsWithData(
  owner: `0x${string}`,
  chainId: SupportedChainId
): Promise<LPPosition[]> {
  const tokenIds = await getPositionTokenIds(owner, chainId)

  if (tokenIds.length === 0) {
    return []
  }

  const positionsMap = await getPositions(tokenIds, chainId)

  const uniqueTokens = new Set<`0x${string}`>()
  const poolKeys = new Set<string>()

  positionsMap.forEach((pos) => {
    uniqueTokens.add(pos.token0)
    uniqueTokens.add(pos.token1)
    poolKeys.add(`${pos.token0}-${pos.token1}-${pos.fee}`)
  })

  const tokensData = await getTokensData([...uniqueTokens], chainId)

  const poolDataMap = new Map<string, { address: `0x${string}`; data: PoolData }>()

  for (const key of poolKeys) {
    const [token0, token1, feeStr] = key.split('-')
    const fee = parseInt(feeStr)
    try {
      const poolAddress = await getPoolAddress(
        token0 as `0x${string}`,
        token1 as `0x${string}`,
        fee,
        chainId
      )
      if (poolAddress !== '0x0000000000000000000000000000000000000000') {
        const data = await getPoolData(poolAddress, chainId)
        poolDataMap.set(key, { address: poolAddress, data })
      }
    } catch {
    }
  }

  const positions: LPPosition[] = []

  for (const [tokenId, posRaw] of positionsMap) {
    const token0Data = tokensData.get(posRaw.token0)
    const token1Data = tokensData.get(posRaw.token1)

    if (!token0Data || !token1Data) continue

    const poolKey = `${posRaw.token0}-${posRaw.token1}-${posRaw.fee}`
    const poolInfo = poolDataMap.get(poolKey)

    if (!poolInfo) continue

    const currentTick = poolInfo.data.slot0.tick

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

    positions.push({
      tokenId,
      owner,
      chainId,
      pool: {
        address: poolInfo.address,
        token0: token0Data,
        token1: token1Data,
        fee: posRaw.fee,
        tickSpacing: poolInfo.data.tickSpacing,
        sqrtPriceX96: poolInfo.data.slot0.sqrtPriceX96,
        currentTick,
        liquidity: poolInfo.data.liquidity,
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
    })
  }

  return positions
}

export function useUniswapPositions(): UseUniswapPositionsReturn {
  const { address, chainId, isConnected } = useWallet()

  const {
    data: positions = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.positions.list(chainId as SupportedChainId, address),
    queryFn: () => fetchPositionsWithData(address!, chainId as SupportedChainId),
    enabled: isConnected && !!address && !!chainId,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  return {
    positions,
    isLoading,
    isFetching,
    isError,
    error: error as Error | null,
    refetch,
  }
}
