'use client'

import { useQuery } from '@tanstack/react-query'
import { useWallet } from '@/hooks/wallet'
import { queryKeys } from '@/lib/query/keys'
import { getPoolData, type PoolData } from '@/lib/contracts/readService'
import type { SupportedChainId } from '@/lib/constants/chains'

export interface UsePoolDataReturn {
  poolData: PoolData | null
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

export function usePoolData(poolAddress: `0x${string}` | undefined): UsePoolDataReturn {
  const { chainId, isConnected } = useWallet()

  const {
    data: poolData = null,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.pools.data(chainId as SupportedChainId, poolAddress),
    queryFn: () => getPoolData(poolAddress!, chainId as SupportedChainId),
    enabled: isConnected && !!poolAddress && !!chainId,
    staleTime: 15_000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  return {
    poolData,
    isLoading,
    isFetching,
    isError,
    error: error as Error | null,
    refetch,
  }
}
