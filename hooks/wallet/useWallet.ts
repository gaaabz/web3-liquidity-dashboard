'use client'

import { useAccount, useBalance, useChainId } from 'wagmi'
import { useMemo } from 'react'
import { SUPPORTED_CHAIN_IDS, type SupportedChainId } from '@/lib/constants/chains'

export type WalletState = 'disconnected' | 'connecting' | 'connected' | 'wrong-network'

interface BalanceData {
  decimals: number
  formatted: string
  symbol: string
  value: bigint
}

interface UseWalletReturn {
  address: `0x${string}` | undefined
  chainId: number | undefined
  balance: BalanceData | undefined
  state: WalletState
  isReady: boolean
  isConnected: boolean
  isConnecting: boolean
  isDisconnected: boolean
  isWrongNetwork: boolean
  shortAddress: string | undefined
}

export function useWallet(): UseWalletReturn {
  const { address, isConnecting, isConnected } = useAccount()
  const chainId = useChainId()
  const { data: balanceData } = useBalance({ address })

  const balance: BalanceData | undefined = balanceData ? {
    decimals: balanceData.decimals,
    formatted: balanceData.formatted,
    symbol: balanceData.symbol,
    value: balanceData.value,
  } : undefined

  const isWrongNetwork = useMemo(() => {
    return isConnected && !SUPPORTED_CHAIN_IDS.includes(chainId as SupportedChainId)
  }, [isConnected, chainId])

  const state: WalletState = useMemo(() => {
    if (isConnecting) return 'connecting'
    if (!isConnected) return 'disconnected'
    if (isWrongNetwork) return 'wrong-network'
    return 'connected'
  }, [isConnecting, isConnected, isWrongNetwork])

  const shortAddress = useMemo(() => {
    if (!address) return undefined
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }, [address])

  return {
    address,
    chainId,
    balance,
    state,
    isReady: state === 'connected',
    isConnected,
    isConnecting,
    isDisconnected: !isConnected && !isConnecting,
    isWrongNetwork,
    shortAddress,
  }
}
