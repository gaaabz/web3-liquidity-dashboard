'use client'

import { useAccount, useSwitchChain } from 'wagmi'
import { useCallback } from 'react'
import { DEFAULT_CHAIN, SUPPORTED_CHAINS, isSupportedChain } from '@/lib/constants/chains'

interface UseWrongNetworkReturn {
  isWrongNetwork: boolean
  switchToDefaultChain: () => void
  switchToChain: (chainId: number) => void
  supportedChains: typeof SUPPORTED_CHAINS
  isPending: boolean
}

export function useWrongNetwork(): UseWrongNetworkReturn {
  const { isConnected, chainId } = useAccount()
  const { switchChain, isPending } = useSwitchChain()

  const isWrongNetwork = isConnected && !isSupportedChain(chainId)

  const switchToDefaultChain = useCallback(() => {
    switchChain?.({ chainId: DEFAULT_CHAIN.id })
  }, [switchChain])

  const switchToChain = useCallback(
    (targetChainId: number) => {
      if (isSupportedChain(targetChainId)) {
        switchChain?.({ chainId: targetChainId })
      }
    },
    [switchChain]
  )

  return {
    isWrongNetwork,
    switchToDefaultChain,
    switchToChain,
    supportedChains: SUPPORTED_CHAINS,
    isPending,
  }
}
