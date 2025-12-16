'use client'

import { useWallet } from '@/hooks/wallet'

export function WalletStatus() {
  const { state, shortAddress, balance } = useWallet()

  if (state === 'disconnected') {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
        <div className="w-2 h-2 rounded-full bg-muted-foreground" />
        <span className="text-sm text-muted-foreground">Not Connected</span>
      </div>
    )
  }

  if (state === 'connecting') {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
        <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
        <span className="text-sm text-muted-foreground">Connecting...</span>
      </div>
    )
  }

  if (state === 'wrong-network') {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-destructive/10 rounded-lg border border-destructive/20">
        <div className="w-2 h-2 rounded-full bg-destructive" />
        <span className="text-sm text-destructive">Wrong Network</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-secondary rounded-lg">
      <div className="w-2 h-2 rounded-full bg-success" />
      <div className="flex flex-col">
        <span className="text-sm font-medium">{shortAddress}</span>
        {balance ? (
          <span className="text-xs text-muted-foreground">
            {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
          </span>
        ) : null}
      </div>
    </div>
  )
}
