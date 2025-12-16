'use client'

import { useDemoMode } from '@/hooks/demo'

export function DemoModeToggle() {
  const { isDemoMode, toggleDemoMode } = useDemoMode()

  return (
    <button
      onClick={toggleDemoMode}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
        ${isDemoMode ? 'bg-accent' : 'bg-muted'}
      `}
      role="switch"
      aria-checked={isDemoMode}
      aria-label="Toggle demo mode"
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${isDemoMode ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  )
}

export function DemoModeToggleWithLabel() {
  const { isDemoMode, toggleDemoMode } = useDemoMode()

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">Demo Mode</span>
      <button
        onClick={toggleDemoMode}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          ${isDemoMode ? 'bg-accent' : 'bg-muted'}
        `}
        role="switch"
        aria-checked={isDemoMode}
        aria-label="Toggle demo mode"
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${isDemoMode ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  )
}
