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
import { tickToPrice } from '@/lib/uniswap/tickMath'

function formatUSD(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatAmount(value: number): string {
  if (value === 0) return '0'
  if (value < 0.000001) return '<0.000001'
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  })
}

function IncreaseSimulatorContent() {
  const searchParams = useSearchParams()
  const positionId = searchParams.get('position')
  const { positions, getPositionById } = useDemoPositions()

  const [selectedPositionId, setSelectedPositionId] = useState<string>(positionId || '')
  const [addAmount0, setAddAmount0] = useState<string>('')
  const [addAmount1, setAddAmount1] = useState<string>('')

  const position = useMemo(() => {
    if (!selectedPositionId) return null
    return getPositionById(BigInt(selectedPositionId))
  }, [selectedPositionId, getPositionById])

  const simulation = useMemo(() => {
    if (!position) return null

    const add0 = parseFloat(addAmount0) || 0
    const add1 = parseFloat(addAmount1) || 0

    if (add0 === 0 && add1 === 0) return null

    const { pool, amount0, amount1, isInRange, tickLower, tickUpper } = position

    const token0Price = TOKEN_PRICES_USD[pool.token0.symbol] ?? 0
    const token1Price = TOKEN_PRICES_USD[pool.token1.symbol] ?? 0

    const currentTVL = amount0 * token0Price + amount1 * token1Price
    const addedValue = add0 * token0Price + add1 * token1Price
    const newTVL = currentTVL + addedValue

    const newAmount0 = amount0 + add0
    const newAmount1 = amount1 + add1

    const currentPrice = tickToPrice(pool.currentTick, pool.token0.decimals, pool.token1.decimals)
    const lowerPrice = tickToPrice(tickLower, pool.token0.decimals, pool.token1.decimals)
    const upperPrice = tickToPrice(tickUpper, pool.token0.decimals, pool.token1.decimals)

    const optimalRatio = currentPrice >= lowerPrice && currentPrice <= upperPrice
      ? (currentPrice - lowerPrice) / (upperPrice - lowerPrice)
      : currentPrice < lowerPrice ? 0 : 1

    const currentRatioValue = add0 * token0Price
    const totalAddedValue = addedValue
    const actualRatio = totalAddedValue > 0 ? currentRatioValue / totalAddedValue : 0.5

    const isOptimalRatio = Math.abs(actualRatio - optimalRatio) < 0.1

    const liquidityIncrease = currentTVL > 0 ? (addedValue / currentTVL) * 100 : 0

    const warnings: { message: string; severity: 'warning' | 'info' }[] = []

    if (!isInRange) {
      warnings.push({
        message: 'Position is currently out of range - adding liquidity will not earn fees until price returns to range',
        severity: 'warning',
      })
    }

    if (!isOptimalRatio && add0 > 0 && add1 > 0) {
      warnings.push({
        message: 'Token ratio does not match optimal ratio for current price - some tokens may not be fully utilized',
        severity: 'info',
      })
    }

    return {
      before: {
        amount0,
        amount1,
        tvl: currentTVL,
        token0Price,
        token1Price,
      },
      after: {
        amount0: newAmount0,
        amount1: newAmount1,
        tvl: newTVL,
        liquidityIncrease,
      },
      added: {
        amount0: add0,
        amount1: add1,
        value: addedValue,
      },
      optimalRatio,
      actualRatio,
      isOptimalRatio,
      warnings,
    }
  }, [position, addAmount0, addAmount1])

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
          <h1 className="text-2xl font-bold text-foreground">Add Liquidity Simulation</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Preview the impact of adding more liquidity to your position
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
                  setAddAmount0('')
                  setAddAmount1('')
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
                  <div className="text-sm text-muted-foreground mb-2">Current Position</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{position.pool.token0.symbol}</span>
                      <span className="font-medium">{formatAmount(position.amount0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{position.pool.token1.symbol}</span>
                      <span className="font-medium">{formatAmount(position.amount1)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {position?.pool.token0.symbol || 'Token 0'} Amount
                  </label>
                  <input
                    type="number"
                    value={addAmount0}
                    onChange={(e) => setAddAmount0(e.target.value)}
                    placeholder="0.0"
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground"
                    disabled={!position}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {position?.pool.token1.symbol || 'Token 1'} Amount
                  </label>
                  <input
                    type="number"
                    value={addAmount1}
                    onChange={(e) => setAddAmount1(e.target.value)}
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
                    <div
                      key={i}
                      className={`flex items-center gap-2 p-3 rounded-lg ${
                        warning.severity === 'warning'
                          ? 'bg-warning/10 border border-warning/20'
                          : 'bg-primary/10 border border-primary/20'
                      }`}
                    >
                      <svg
                        className={`w-5 h-5 ${warning.severity === 'warning' ? 'text-warning' : 'text-primary'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {warning.severity === 'warning' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        )}
                      </svg>
                      <span className={`text-sm ${warning.severity === 'warning' ? 'text-warning' : 'text-primary'}`}>
                        {warning.message}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-muted-foreground mb-3">Before</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">{position?.pool.token0.symbol}</span>
                      <span className="text-sm font-medium">{formatAmount(simulation.before.amount0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">{position?.pool.token1.symbol}</span>
                      <span className="text-sm font-medium">{formatAmount(simulation.before.amount1)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border">
                      <span className="text-sm text-muted-foreground">TVL</span>
                      <span className="text-sm font-medium">{formatUSD(simulation.before.tvl)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-muted-foreground mb-3">After</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">{position?.pool.token0.symbol}</span>
                      <span className="text-sm font-medium text-success">
                        {formatAmount(simulation.after.amount0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">{position?.pool.token1.symbol}</span>
                      <span className="text-sm font-medium text-success">
                        {formatAmount(simulation.after.amount1)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border">
                      <span className="text-sm text-muted-foreground">TVL</span>
                      <span className="text-sm font-medium text-success">{formatUSD(simulation.after.tvl)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Value Added</div>
                    <div className="text-lg font-semibold text-success mt-1">
                      +{formatUSD(simulation.added.value)}
                    </div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Liquidity Increase</div>
                    <div className="text-lg font-semibold text-primary mt-1">
                      +{simulation.after.liquidityIncrease.toFixed(1)}%
                    </div>
                  </div>
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

export default function IncreaseSimulatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <IncreaseSimulatorContent />
    </Suspense>
  )
}
