'use client'

import { type ReactNode, useState } from 'react'
import { WagmiProvider, type State } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { wagmiConfig } from '@/lib/wagmi/config'
import { customTheme } from '@/lib/rainbow/config'
import { getQueryClient } from '@/lib/query/client'

import '@rainbow-me/rainbowkit/styles.css'

interface Web3ProviderProps {
  children: ReactNode
  initialState?: State
}

export function Web3Provider({ children, initialState }: Web3ProviderProps) {
  const [queryClient] = useState(() => getQueryClient())

  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={customTheme}
          modalSize="compact"
          showRecentTransactions={true}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
