'use client'

import { use } from 'react'
import Link from 'next/link'
import { useDemoPositions } from '@/hooks/demo'
import { PositionDetail } from '@/components/positions/PositionDetail'
import { LoadingState } from '@/components/ui/Spinner'

interface PositionPageClientProps {
  params: Promise<{ tokenId: string }>
}

export function PositionPageClient({ params }: PositionPageClientProps) {
  const { tokenId } = use(params)
  const { getPositionById, isLoading } = useDemoPositions()

  const position = getPositionById(BigInt(tokenId))

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <LoadingState message="Loading position..." />
      </div>
    )
  }

  if (!position) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Position Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The position you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/dashboard"
            className="text-primary hover:underline"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return <PositionDetail position={position} />
}
