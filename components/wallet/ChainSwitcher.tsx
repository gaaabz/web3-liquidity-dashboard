'use client'

import { useWallet, useWrongNetwork, useChainConfig } from '@/hooks/wallet'
import { SUPPORTED_CHAINS } from '@/lib/constants/chains'

export function ChainSwitcher() {
  const { isConnected } = useWallet()
  const { chainId } = useChainConfig()
  const { switchToChain, isPending } = useWrongNetwork()

  if (!isConnected) return null

  return (
    <div className="relative">
      <select
        value={chainId}
        onChange={(e) => switchToChain(Number(e.target.value))}
        disabled={isPending}
        className="appearance-none bg-secondary text-foreground px-4 py-2 pr-8 rounded-lg border border-border cursor-pointer hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
      >
        {SUPPORTED_CHAINS.map((chain) => (
          <option key={chain.id} value={chain.id}>
            {chain.name}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className="w-4 h-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  )
}
