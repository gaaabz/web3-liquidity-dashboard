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

function DecreaseSimulatorContent() {
  const searchParams = useSearchParams()
  const positionId = searchParams.get('position')
  const { positions, getPositionById } = useDemoPositions()

  const [selectedPositionId, setSelectedPositionId] = useState<string>(positionId || '')
  const [removePercentage, setRemovePercentage] = useState<number>(50)

  const position = useMemo(() => {
    if (!selectedPositionId) return null
    return getPositionById(BigInt(selectedPositionId))
  }, [selectedPositionId, getPositionById])

  const simulation = useMemo(() => {
    if (!position || removePercentage === 0) return null

    const { pool, amount0, amount1 } = position

    const token0Price = TOKEN_PRICES_USD[pool.token0.symbol] ?? 0
    const token1Price = TOKEN_PRICES_USD[pool.token1.symbol] ?? 0

    const currentTVL = amount0 * token0Price + amount1 * token1Price

    const removeAmount0 = (amount0 * removePercentage) / 100
    const removeAmount1 = (amount1 * removePercentage) / 100
    const removedValue = removeAmount0 * token0Price + removeAmount1 * token1Price

    const newAmount0 = amount0 - removeAmount0
    const newAmount1 = amount1 - removeAmount1
    const newTVL = currentTVL - removedValue

    const isFullWithdrawal = removePercentage === 100

    const warnings: { message: string; severity: 'warning' | 'info' }[] = []

    if (isFullWithdrawal) {
      warnings.push({
        message: 'Full withdrawal will close your position entirely',
        severity: 'warning',
      })
    }

    if (removePercentage > 75 && !isFullWithdrawal) {
      warnings.push({
        message: 'Removing a large portion may significantly reduce your fee earnings',
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
        isFullWithdrawal,
      },
      removed: {
        amount0: removeAmount0,
        amount1: removeAmount1,
        value: removedValue,
        percentage: removePercentage,
      },
      warnings,
    }
  }, [position, removePercentage])

  const presetPercentages = [25, 50, 75, 100]

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
          <h1 className="text-2xl font-bold text-foreground">Remove Liquidity Simulation</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Preview the impact of removing liquidity from your position
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
                  setRemovePercentage(50)
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
              <CardTitle>Removal Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Percentage to Remove: {removePercentage}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={removePercentage}
                    onChange={(e) => setRemovePercentage(parseInt(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    disabled={!position}
                  />
                </div>

                <div className="flex gap-2">
                  {presetPercentages.map((pct) => (
                    <button
                      key={pct}
                      onClick={() => setRemovePercentage(pct)}
                      disabled={!position}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        removePercentage === pct
                          ? 'bg-primary text-white'
                          : 'bg-secondary text-foreground hover:bg-muted'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>

                {simulation && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">You will receive</div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{position?.pool.token0.symbol}</span>
                        <span className="font-medium text-destructive">
                          {formatAmount(simulation.removed.amount0)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{position?.pool.token1.symbol}</span>
                        <span className="font-medium text-destructive">
                          {formatAmount(simulation.removed.amount1)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
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
                      <span className={`text-sm font-medium ${simulation.after.isFullWithdrawal ? 'text-muted-foreground' : 'text-destructive'}`}>
                        {simulation.after.isFullWithdrawal ? '0' : formatAmount(simulation.after.amount0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">{position?.pool.token1.symbol}</span>
                      <span className={`text-sm font-medium ${simulation.after.isFullWithdrawal ? 'text-muted-foreground' : 'text-destructive'}`}>
                        {simulation.after.isFullWithdrawal ? '0' : formatAmount(simulation.after.amount1)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border">
                      <span className="text-sm text-muted-foreground">TVL</span>
                      <span className={`text-sm font-medium ${simulation.after.isFullWithdrawal ? 'text-muted-foreground' : 'text-destructive'}`}>
                        {simulation.after.isFullWithdrawal ? '$0.00' : formatUSD(simulation.after.tvl)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Value Withdrawn</div>
                    <div className="text-lg font-semibold text-destructive mt-1">
                      {formatUSD(simulation.removed.value)}
                    </div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Position Status</div>
                    <div className={`text-lg font-semibold mt-1 ${simulation.after.isFullWithdrawal ? 'text-destructive' : 'text-foreground'}`}>
                      {simulation.after.isFullWithdrawal ? 'Closed' : 'Active'}
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

export default function DecreaseSimulatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <DecreaseSimulatorContent />
    </Suspense>
  )
}
