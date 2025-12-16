'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { InfoTooltip } from '@/components/ui/Tooltip'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { DemoModeBanner } from '@/components/demo'
import type { LPPosition } from '@/types/position'
import { FEE_TIER_LABELS } from '@/lib/uniswap/constants'
import { TOKEN_PRICES_USD } from '@/data/demo'
import { tickToPrice } from '@/lib/uniswap/tickMath'

interface PositionDetailProps {
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

function formatAmount(value: number, decimals: number = 6): string {
  if (value === 0) return '0'
  if (value < 0.000001) return '<0.000001'
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  })
}

function formatPrice(value: number): string {
  if (value >= 1) {
    return value.toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  return value.toFixed(8)
}

export function PositionDetail({ position }: PositionDetailProps) {
  const { pool, amount0, amount1, isInRange, tickLower, tickUpper } = position

  const token0Price = TOKEN_PRICES_USD[pool.token0.symbol] ?? 0
  const token1Price = TOKEN_PRICES_USD[pool.token1.symbol] ?? 0
  const tvl = amount0 * token0Price + amount1 * token1Price
  const feesEarned = 12.45

  const feeLabel = FEE_TIER_LABELS[pool.fee as keyof typeof FEE_TIER_LABELS] ?? `${pool.fee / 10000}%`

  const currentPrice = tickToPrice(pool.currentTick, pool.token0.decimals, pool.token1.decimals)
  const lowerPrice = tickToPrice(tickLower, pool.token0.decimals, pool.token1.decimals)
  const upperPrice = tickToPrice(tickUpper, pool.token0.decimals, pool.token1.decimals)

  const token0Percent = tvl > 0 ? (amount0 * token0Price / tvl) * 100 : 50
  const token1Percent = 100 - token0Percent

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <DemoModeBanner />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary border-2 border-card">
                {pool.token0.symbol.slice(0, 3)}
              </div>
              <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center text-sm font-bold text-accent border-2 border-card">
                {pool.token1.symbol.slice(0, 3)}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {pool.token0.symbol}/{pool.token1.symbol}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{feeLabel}</Badge>
                <StatusBadge status={isInRange ? 'in-range' : 'out-of-range'} />
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Position ID</div>
            <div className="font-mono text-foreground">#{position.tokenId.toString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Price Range</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Current Price</span>
                    <span className="font-semibold text-foreground">
                      {formatPrice(currentPrice)} {pool.token1.symbol} per {pool.token0.symbol}
                    </span>
                  </div>
                </div>

                <div className="relative h-8 bg-muted rounded-full overflow-hidden mb-4">
                  <div
                    className="absolute h-full bg-primary/30 rounded-full"
                    style={{
                      left: '20%',
                      width: '60%',
                    }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-primary"
                    style={{
                      left: isInRange ? '50%' : isInRange ? '15%' : '85%',
                    }}
                  />
                </div>

                <div className="flex justify-between text-sm">
                  <div>
                    <div className="text-muted-foreground">Min Price</div>
                    <div className="font-semibold text-foreground">{formatPrice(lowerPrice)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground">Current</div>
                    <div className="font-semibold text-primary">{formatPrice(currentPrice)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-muted-foreground">Max Price</div>
                    <div className="font-semibold text-foreground">{formatPrice(upperPrice)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Token Amounts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        {pool.token0.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{pool.token0.symbol}</div>
                        <div className="text-sm text-muted-foreground">{pool.token0.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-foreground">{formatAmount(amount0)}</div>
                      <div className="text-sm text-muted-foreground">{formatUSD(amount0 * token0Price)}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                        {pool.token1.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{pool.token1.symbol}</div>
                        <div className="text-sm text-muted-foreground">{pool.token1.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-foreground">{formatAmount(amount1)}</div>
                      <div className="text-sm text-muted-foreground">{formatUSD(amount1 * token1Price)}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span>Token Exposure</span>
                    <InfoTooltip content="Shows the current ratio of tokens in your position. This changes as the price moves within your range." />
                  </div>
                  <div className="flex h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-primary"
                      style={{ width: `${token0Percent}%` }}
                    />
                    <div
                      className="bg-accent"
                      style={{ width: `${token1Percent}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-primary">{token0Percent.toFixed(1)}% {pool.token0.symbol}</span>
                    <span className="text-accent">{token1Percent.toFixed(1)}% {pool.token1.symbol}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Value Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Total Value</span>
                    <InfoTooltip content="Current market value of your position" />
                  </div>
                  <span className="font-semibold text-foreground">{formatUSD(tvl)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Uncollected Fees</span>
                    <InfoTooltip content="Trading fees earned but not yet collected" />
                  </div>
                  <span className="font-semibold text-success">{formatUSD(feesEarned)}</span>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Net Position Value</span>
                    <span className="font-bold text-lg text-foreground">{formatUSD(tvl + feesEarned)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Impermanent Loss</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">IL vs HODL</span>
                    <InfoTooltip content="Impermanent Loss: The difference in value between holding tokens in a LP position vs simply holding them. Only realized when you withdraw." />
                  </div>
                  <span className="font-semibold text-destructive">-$45.23</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">IL Percentage</span>
                    <InfoTooltip content="The percentage of value lost to impermanent loss relative to your initial deposit." />
                  </div>
                  <span className="font-semibold text-destructive">-1.82%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Fees Earned</span>
                  <span className="font-semibold text-success">+{formatUSD(feesEarned)}</span>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Net P&L</span>
                      <InfoTooltip content="Total profit/loss = Fees earned - Impermanent Loss. Positive means you&apos;re better off than HODLing." />
                    </div>
                    <span className="font-bold text-destructive">-$32.78</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link
                  href={`/simulate/rebalance?position=${position.tokenId}`}
                  className="block w-full px-4 py-2 text-center bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Simulate Rebalance
                </Link>
                <Link
                  href={`/simulate/increase?position=${position.tokenId}`}
                  className="block w-full px-4 py-2 text-center bg-secondary text-foreground rounded-lg font-medium hover:bg-muted transition-colors"
                >
                  Add Liquidity
                </Link>
                <Link
                  href={`/simulate/decrease?position=${position.tokenId}`}
                  className="block w-full px-4 py-2 text-center bg-secondary text-foreground rounded-lg font-medium hover:bg-muted transition-colors"
                >
                  Remove Liquidity
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
