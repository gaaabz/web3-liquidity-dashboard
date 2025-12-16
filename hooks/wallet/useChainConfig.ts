'use client'

import { useChainId } from 'wagmi'
import { useMemo } from 'react'
import {
  SUPPORTED_CHAINS,
  DEFAULT_CHAIN,
  isSupportedChain,
  getBlockExplorerUrl,
  type SupportedChainId,
} from '@/lib/constants/chains'
import { CONTRACT_ADDRESSES, hasValidContracts } from '@/lib/contracts/addresses'

interface ChainConfig {
  chainId: SupportedChainId
  chainName: string
  contracts: (typeof CONTRACT_ADDRESSES)[SupportedChainId]
  blockExplorerUrl: string
  hasValidContracts: boolean
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
}

export function useChainConfig(): ChainConfig {
  const rawChainId = useChainId()

  return useMemo(() => {
    const chainId = isSupportedChain(rawChainId) ? rawChainId : DEFAULT_CHAIN.id
    const chain = SUPPORTED_CHAINS.find((c) => c.id === chainId) ?? DEFAULT_CHAIN

    return {
      chainId,
      chainName: chain.name,
      contracts: CONTRACT_ADDRESSES[chainId],
      blockExplorerUrl: getBlockExplorerUrl(chainId),
      hasValidContracts: hasValidContracts(chainId),
      nativeCurrency: chain.nativeCurrency,
    }
  }, [rawChainId])
}
