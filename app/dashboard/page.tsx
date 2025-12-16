import { MetricsGrid } from '@/components/metrics'
import { PositionList } from '@/components/positions'
import { DemoModeToggleWithLabel } from '@/components/demo'

export const metadata = {
  title: 'Dashboard | Liquidity Dashboard',
  description: 'Monitor and manage your Uniswap V3 liquidity positions',
}

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of your liquidity positions
          </p>
        </div>
        <DemoModeToggleWithLabel />
      </div>

      <section className="mb-8">
        <MetricsGrid />
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Your Positions</h2>
          <div className="flex items-center gap-2">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              All
            </button>
            <span className="text-muted-foreground">/</span>
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              In Range
            </button>
            <span className="text-muted-foreground">/</span>
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Out of Range
            </button>
          </div>
        </div>
        <PositionList />
      </section>
    </div>
  )
}
