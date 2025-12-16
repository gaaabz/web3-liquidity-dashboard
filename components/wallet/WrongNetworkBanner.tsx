'use client'

import { useWrongNetwork } from '@/hooks/wallet'

export function WrongNetworkBanner() {
  const { isWrongNetwork, switchToDefaultChain, isPending } = useWrongNetwork()

  if (!isWrongNetwork) return null

  return (
    <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5 text-destructive"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span className="text-sm text-destructive font-medium">
            You are connected to an unsupported network. Please switch to a supported network.
          </span>
        </div>
        <button
          onClick={switchToDefaultChain}
          disabled={isPending}
          className="px-4 py-1.5 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isPending ? 'Switching...' : 'Switch Network'}
        </button>
      </div>
    </div>
  )
}
