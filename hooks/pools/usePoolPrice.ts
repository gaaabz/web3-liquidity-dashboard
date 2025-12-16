'use client'

import { useMemo } from 'react'
import { usePoolData } from './usePoolData'
import { sqrtPriceX96ToPrice, invertPrice } from '@/lib/uniswap/priceMath'

export interface UsePoolPriceReturn {
  token0Price: number
  token1Price: number
  isLoading: boolean
  isError: boolean
}

export function usePoolPrice(
  poolAddress: `0x${string}` | undefined,
  token0Decimals: number = 18,
  token1Decimals: number = 18
): UsePoolPriceReturn {
  const { poolData, isLoading, isError } = usePoolData(poolAddress)

  const prices = useMemo(() => {
    if (!poolData) {
      return { token0Price: 0, token1Price: 0 }
    }

    const token0Price = sqrtPriceX96ToPrice(
      poolData.slot0.sqrtPriceX96,
      token0Decimals,
      token1Decimals
    )
    const token1Price = invertPrice(token0Price)

    return { token0Price, token1Price }
  }, [poolData, token0Decimals, token1Decimals])

  return {
    ...prices,
    isLoading,
    isError,
  }
}
