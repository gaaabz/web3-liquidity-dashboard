'use client'

import { type ReactNode } from 'react'
import { Card } from '@/components/ui/Card'
import { InfoTooltip } from '@/components/ui/Tooltip'
import { Skeleton } from '@/components/ui/Skeleton'

interface MetricCardProps {
  title: string
  value: string | ReactNode
  subValue?: string | ReactNode
  tooltip?: string
  icon?: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  isLoading?: boolean
}

export function MetricCard({
  title,
  value,
  subValue,
  tooltip,
  icon,
  trend,
  isLoading,
}: MetricCardProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
        <Skeleton className="h-8 w-32 mt-3" />
        <Skeleton className="h-4 w-20 mt-2" />
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          {tooltip && <InfoTooltip content={tooltip} />}
        </div>
        {icon && (
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        )}
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {subValue && (
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{subValue}</span>
            {trend && (
              <span className={`text-xs font-medium ${trend.isPositive ? 'text-success' : 'text-destructive'}`}>
                {trend.isPositive ? '+' : ''}{trend.value.toFixed(2)}%
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
