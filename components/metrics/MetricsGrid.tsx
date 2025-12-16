'use client'

import { MetricCard } from './MetricCard'
import { useDemoPositions } from '@/hooks/demo'

function formatUSD(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function MetricsGrid() {
  const { metrics, isLoading } = useDemoPositions()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total Value Locked"
        value={formatUSD(metrics.totalTVL)}
        subValue="Across all positions"
        tooltip="The total USD value of all your LP positions"
        isLoading={isLoading}
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <MetricCard
        title="Uncollected Fees"
        value={formatUSD(metrics.totalFees)}
        subValue="Available to collect"
        tooltip="Trading fees earned but not yet collected"
        isLoading={isLoading}
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        }
      />
      <MetricCard
        title="Active Positions"
        value={metrics.positionsCount.toString()}
        subValue={`${metrics.inRangeCount} in range`}
        tooltip="Number of open LP positions"
        isLoading={isLoading}
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        }
      />
      <MetricCard
        title="Out of Range"
        value={metrics.outOfRangeCount.toString()}
        subValue={metrics.outOfRangeCount > 0 ? 'Need attention' : 'All good'}
        tooltip="Positions that are currently out of range and not earning fees"
        isLoading={isLoading}
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        }
      />
    </div>
  )
}
