'use client'

import { useMemo } from 'react'
import { useDemoMode } from './useDemoMode'
import { DEMO_POSITIONS, getDemoPositionMetrics, TOKEN_PRICES_USD } from '@/data/demo'
import type { LPPosition } from '@/types/position'

export interface UseDemoPositionsReturn {
  positions: LPPosition[]
  isLoading: boolean
  metrics: {
    totalTVL: number
    totalFees: number
    positionsCount: number
    inRangeCount: number
    outOfRangeCount: number
  }
  getPositionById: (tokenId: bigint) => LPPosition | undefined
  getTokenPriceUSD: (symbol: string) => number
}

export function useDemoPositions(): UseDemoPositionsReturn {
  const { shouldUseDemoData } = useDemoMode()

  const positions = useMemo(() => {
    if (!shouldUseDemoData) return []
    return DEMO_POSITIONS
  }, [shouldUseDemoData])

  const metrics = useMemo(() => {
    if (!shouldUseDemoData) {
      return {
        totalTVL: 0,
        totalFees: 0,
        positionsCount: 0,
        inRangeCount: 0,
        outOfRangeCount: 0,
      }
    }
    return getDemoPositionMetrics()
  }, [shouldUseDemoData])

  const getPositionById = (tokenId: bigint): LPPosition | undefined => {
    return DEMO_POSITIONS.find(p => p.tokenId === tokenId)
  }

  const getTokenPriceUSD = (symbol: string): number => {
    return TOKEN_PRICES_USD[symbol] ?? 0
  }

  return {
    positions,
    isLoading: false,
    metrics,
    getPositionById,
    getTokenPriceUSD,
  }
}
