'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDemoMode } from '@/hooks/demo'

export default function HomePage() {
  const router = useRouter()
  const { enableDemoMode } = useDemoMode()

  const handleDemoMode = () => {
    enableDemoMode()
    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">LP</span>
          </div>
          <span className="font-semibold text-lg">Liquidity Dashboard</span>
        </div>
        <ConnectButton />
      </header>

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-2xl px-6">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Uniswap V3 Liquidity Manager
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Professional dashboard for Liquidity Providers. Analyze, compare, and simulate
            your LP strategies across multiple networks.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Launch Dashboard
            </Link>
            <button
              onClick={handleDemoMode}
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-muted transition-colors"
            >
              Demo Mode
            </button>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">Multi-Chain</div>
              <p className="text-sm text-muted-foreground">
                Sepolia & Avalanche Fuji testnets
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">Simulations</div>
              <p className="text-sm text-muted-foreground">
                Test strategies without real transactions
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-2">Analytics</div>
              <p className="text-sm text-muted-foreground">
                TVL, fees, IL tracking in real-time
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-border px-6 py-4 text-center text-sm text-muted-foreground">
        Built for Uniswap V3 Liquidity Providers
      </footer>
    </main>
  )
}
