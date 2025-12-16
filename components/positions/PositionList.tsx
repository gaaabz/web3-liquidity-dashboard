'use client'

import { useDemoPositions } from '@/hooks/demo'
import { PositionCard } from './PositionCard'
import { SkeletonCard } from '@/components/ui/Skeleton'

export function PositionList() {
  const { positions, isLoading } = useDemoPositions()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (positions.length === 0) {
    return (
      <div className="text-center py-16 bg-card rounded-xl border border-border">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground">No Positions Found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
          Connect your wallet or enable demo mode to see LP positions
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {positions.map((position) => (
        <PositionCard key={position.tokenId.toString()} position={position} />
      ))}
    </div>
  )
}
