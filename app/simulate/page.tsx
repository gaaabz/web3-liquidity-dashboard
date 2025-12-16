import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { DemoModeBanner } from '@/components/demo'
import { Card, CardContent } from '@/components/ui/Card'

export const metadata = {
  title: 'Simulate | Liquidity Dashboard',
  description: 'Simulate LP strategy changes without real transactions',
}

const simulations = [
  {
    title: 'Rebalance Position',
    description: 'Adjust your price range to optimize fee earnings',
    href: '/simulate/rebalance',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    title: 'Add Liquidity',
    description: 'Increase your position size within the current range',
    href: '/simulate/increase',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
  },
  {
    title: 'Remove Liquidity',
    description: 'Decrease your position size or withdraw completely',
    href: '/simulate/decrease',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
      </svg>
    ),
  },
]

export default function SimulatePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <DemoModeBanner />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Simulate</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Test different strategies without making real transactions
          </p>
        </div>

        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-warning mt-0.5\" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 className="font-semibold text-warning">Simulation Only</h3>
              <p className="text-sm text-warning/80 mt-1">
                These simulations are for educational purposes. No real transactions will be made.
                Results are estimates based on current market conditions.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {simulations.map((sim) => (
            <Link key={sim.href} href={sim.href}>
              <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                    {sim.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{sim.title}</h3>
                  <p className="text-sm text-muted-foreground">{sim.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
