'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { DemoModeBanner } from '@/components/demo'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { useDemoPositions } from '@/hooks/demo'
import { TOKEN_PRICES_USD } from '@/data/demo'
import { tickToPrice, priceToTick, nearestUsableTick } from '@/lib/uniswap/tickMath'
import { getTickSpacing } from '@/lib/uniswap/constants'

function formatUSD(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatPrice(value: number): string {
  if (value >= 1) {
    return value.toLocaleString('en-US', { maximumFractionDigits: 4 })
  }
  return value.toFixed(8)
}

function RebalanceSimulatorContent() {
  const searchParams = useSearchParams()
  const positionId = searchParams.get('position')
  const { positions, getPositionById } = useDemoPositions()

  const [selectedPositionId, setSelectedPositionId] = useState<string>(positionId || '')
  const [newLowerPrice, setNewLowerPrice] = useState<string>('')
  const [newUpperPrice, setNewUpperPrice] = useState<string>('')

  const position = useMemo(() => {
    if (!selectedPositionId) return null
    return getPositionById(BigInt(selectedPositionId))
  }, [selectedPositionId, getPositionById])

  const simulation = useMemo(() => {
    if (!position || !newLowerPrice || !newUpperPrice) return null

    const lowerPriceNum = parseFloat(newLowerPrice)
    const upperPriceNum = parseFloat(newUpperPrice)

    if (isNaN(lowerPriceNum) || isNaN(upperPriceNum) || lowerPriceNum >= upperPriceNum) {
      return null
    }

    const { pool, tickLower: currentTickLower, tickUpper: currentTickUpper, amount0, amount1 } = position

    const tickSpacing = getTickSpacing(pool.fee as 100 | 500 | 3000 | 10000)
    const newTickLower = nearestUsableTick(
      priceToTick(lowerPriceNum, pool.token0.decimals, pool.token1.decimals),
      tickSpacing
    )
    const newTickUpper = nearestUsableTick(
      priceToTick(upperPriceNum, pool.token0.decimals, pool.token1.decimals),
      tickSpacing
    )

    const currentLowerPrice = tickToPrice(currentTickLower, pool.token0.decimals, pool.token1.decimals)
    const currentUpperPrice = tickToPrice(currentTickUpper, pool.token0.decimals, pool.token1.decimals)

    const token0Price = TOKEN_PRICES_USD[pool.token0.symbol] ?? 0
    const token1Price = TOKEN_PRICES_USD[pool.token1.symbol] ?? 0
    const currentTVL = amount0 * token0Price + amount1 * token1Price

    const currentRangeWidth = ((currentUpperPrice - currentLowerPrice) / currentLowerPrice) * 100
    const newRangeWidth = ((upperPriceNum - lowerPriceNum) / lowerPriceNum) * 100

    const isNewRangeInRange = pool.currentTick >= newTickLower && pool.currentTick < newTickUpper

    return {
      before: {
        tickLower: currentTickLower,
        tickUpper: currentTickUpper,
        lowerPrice: currentLowerPrice,
        upperPrice: currentUpperPrice,
        rangeWidth: currentRangeWidth,
        tvl: currentTVL,
      },
      after: {
        tickLower: newTickLower,
        tickUpper: newTickUpper,
        lowerPrice: lowerPriceNum,
        upperPrice: upperPriceNum,
        rangeWidth: newRangeWidth,
        isInRange: isNewRangeInRange,
      },
      delta: {
        rangeWidthChange: newRangeWidth - currentRangeWidth,
        concentrationChange: newRangeWidth < currentRangeWidth ? 'Higher' : 'Lower',
      },
      warnings: [
        ...(!isNewRangeInRange ? [{ message: 'New range does not include current price', severity: 'warning' as const }] : []),
        ...(newRangeWidth < 2 ? [{ message: 'Very narrow range - high risk of going out of range', severity: 'warning' as const }] : []),
      ],
    }
  }, [position, newLowerPrice, newUpperPrice])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <DemoModeBanner />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-6">
          <Link
            href="/simulate"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Simulations
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Rebalance Simulation</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Preview the impact of changing your position&apos;s price range
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Position</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={selectedPositionId}
                onChange={(e) => {
                  setSelectedPositionId(e.target.value)
                  setNewLowerPrice('')
                  setNewUpperPrice('')
                }}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground"
              >
                <option value="">Select a position...</option>
                {positions.map((pos) => (
                  <option key={pos.tokenId.toString()} value={pos.tokenId.toString()}>
                    #{pos.tokenId.toString()} - {pos.pool.token0.symbol}/{pos.pool.token1.symbol}
                  </option>
                ))}
              </select>

              {position && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground mb-2">Current Range</div>
                  <div className="flex justify-between text-sm">
                    <span>Min: {formatPrice(tickToPrice(position.tickLower, position.pool.token0.decimals, position.pool.token1.decimals))}</span>
                    <span>Max: {formatPrice(tickToPrice(position.tickUpper, position.pool.token0.decimals, position.pool.token1.decimals))}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>New Price Range</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Min Price
                  </label>
                  <input
                    type="number"
                    value={newLowerPrice}
                    onChange={(e) => setNewLowerPrice(e.target.value)}
                    placeholder="0.0"
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground"
                    disabled={!position}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Max Price
                  </label>
                  <input
                    type="number"
                    value={newUpperPrice}
                    onChange={(e) => setNewUpperPrice(e.target.value)}
                    placeholder="0.0"
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground"
                    disabled={!position}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {simulation && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Simulation Results</CardTitle>
            </CardHeader>
            <CardContent>
              {simulation.warnings.length > 0 && (
                <div className="mb-6 space-y-2">
                  {simulation.warnings.map((warning, i) => (
                    <div key={i} className="flex items-center gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                      <svg className="w-5 h-5 text-warning\" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="text-sm text-warning">{warning.message}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-muted-foreground mb-3">Before</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Min Price</span>
                      <span className="text-sm font-medium">{formatPrice(simulation.before.lowerPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Max Price</span>
                      <span className="text-sm font-medium">{formatPrice(simulation.before.upperPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Range Width</span>
                      <span className="text-sm font-medium">{simulation.before.rangeWidth.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">TVL</span>
                      <span className="text-sm font-medium">{formatUSD(simulation.before.tvl)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-muted-foreground mb-3">After</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Min Price</span>
                      <span className="text-sm font-medium">{formatPrice(simulation.after.lowerPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Max Price</span>
                      <span className="text-sm font-medium">{formatPrice(simulation.after.upperPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Range Width</span>
                      <span className="text-sm font-medium">{simulation.after.rangeWidth.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">In Range</span>
                      <span className={`text-sm font-medium ${simulation.after.isInRange ? 'text-success' : 'text-destructive'}`}>
                        {simulation.after.isInRange ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Concentration Change</span>
                  <span className={`font-medium ${simulation.delta.rangeWidthChange < 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                    {simulation.delta.concentrationChange}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  This is a simulation only. No real transaction will be made.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default function RebalanceSimulatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RebalanceSimulatorContent />
    </Suspense>
  )
}
