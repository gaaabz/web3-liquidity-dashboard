'use client'

import { useDemoMode } from '@/hooks/demo'

export function DemoModeBanner() {
  const { isDemoMode, shouldUseDemoData, disableDemoMode } = useDemoMode()

  if (!shouldUseDemoData) return null

  return (
    <div className="bg-accent/10 border-b border-accent/20 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-sm text-accent font-medium">
            {isDemoMode ? 'Demo Mode Active' : 'Viewing Demo Data'}
          </span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Connect your wallet to see real positions
          </span>
        </div>
        {isDemoMode && (
          <button
            onClick={disableDemoMode}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Exit Demo
          </button>
        )}
      </div>
    </div>
  )
}
