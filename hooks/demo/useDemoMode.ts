'use client'

import { useDemoStore } from '@/lib/stores/demoStore'
import { useWallet } from '@/hooks/wallet'

export interface UseDemoModeReturn {
  isDemoMode: boolean
  shouldUseDemoData: boolean
  enableDemoMode: () => void
  disableDemoMode: () => void
  toggleDemoMode: () => void
}

export function useDemoMode(): UseDemoModeReturn {
  const { isDemoMode, enableDemoMode, disableDemoMode, toggleDemoMode } = useDemoStore()
  const { isConnected } = useWallet()

  const shouldUseDemoData = isDemoMode || !isConnected

  return {
    isDemoMode,
    shouldUseDemoData,
    enableDemoMode,
    disableDemoMode,
    toggleDemoMode,
  }
}
