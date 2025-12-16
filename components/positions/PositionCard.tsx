'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import type { LPPosition } from '@/types/position'
import { FEE_TIER_LABELS } from '@/lib/uniswap/constants'
import { TOKEN_PRICES_USD } from '@/data/demo'

interface PositionCardProps {
  position: LPPosition
}

function formatUSD(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatAmount(value: number, decimals: number = 4): string {
  if (value === 0) return '0'
  if (value < 0.0001) return '<0.0001'
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  })
}

export function PositionCard({ position }: PositionCardProps) {
  const { pool, amount0, amount1, isInRange } = position

  const token0Price = TOKEN_PRICES_USD[pool.token0.symbol] ?? 0
  const token1Price = TOKEN_PRICES_USD[pool.token1.symbol] ?? 0
  const tvl = amount0 * token0Price + amount1 * token1Price

  const feeLabel = FEE_TIER_LABELS[pool.fee as keyof typeof FEE_TIER_LABELS] ?? `${pool.fee / 10000}%`

  return (
    <Link href={`/positions/${position.tokenId.toString()}`}>
      <Card className="p-5 hover:border-primary/50 transition-colors cursor-pointer">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary border-2 border-card">
                {pool.token0.symbol.slice(0, 2)}
              </div>
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent border-2 border-card">
                {pool.token1.symbol.slice(0, 2)}
              </div>
            </div>
            <div>
              <div className="font-semibold text-foreground">
                {pool.token0.symbol}/{pool.token1.symbol}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="outline">{feeLabel}</Badge>
              </div>
            </div>
          </div>
          <StatusBadge status={isInRange ? 'in-range' : 'out-of-range'} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground">Total Value</div>
            <div className="text-lg font-semibold text-foreground mt-0.5">
              {formatUSD(tvl)}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Fees Earned</div>
            <div className="text-lg font-semibold text-success mt-0.5">
              {formatUSD(12.45)}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <div className="text-muted-foreground">
              <span className="text-foreground font-medium">{formatAmount(amount0)}</span> {pool.token0.symbol}
            </div>
            <div className="text-muted-foreground">
              <span className="text-foreground font-medium">{formatAmount(amount1)}</span> {pool.token1.symbol}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
