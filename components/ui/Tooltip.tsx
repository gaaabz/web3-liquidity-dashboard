'use client'

import { useState, type ReactNode } from 'react'

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

const positionClasses = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
}

const arrowClasses = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-card',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-card',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-card',
  right: 'right-full top-1/2 -translate-y-1/2 border-r-card',
}

export function Tooltip({ content, children, position = 'top', delay = 200 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const showTooltip = () => {
    const id = setTimeout(() => setIsVisible(true), delay)
    setTimeoutId(id)
  }

  const hideTooltip = () => {
    if (timeoutId) clearTimeout(timeoutId)
    setIsVisible(false)
  }

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          className={`
            absolute z-50 px-3 py-2 text-sm bg-card border border-border rounded-lg shadow-lg
            whitespace-nowrap
            ${positionClasses[position]}
          `}
          role="tooltip"
        >
          {content}
          <div
            className={`
              absolute w-0 h-0 border-4 border-transparent
              ${arrowClasses[position]}
            `}
          />
        </div>
      )}
    </div>
  )
}

interface InfoTooltipProps {
  content: ReactNode
}

export function InfoTooltip({ content }: InfoTooltipProps) {
  return (
    <Tooltip content={content}>
      <button
        type="button"
        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
        aria-label="More information"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </Tooltip>
  )
}
