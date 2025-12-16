'use client'

import Link from 'next/link'
import { ConnectWalletButton } from '@/components/wallet/ConnectWalletButton'
import { ChainSwitcher } from '@/components/wallet/ChainSwitcher'
import { WrongNetworkBanner } from '@/components/wallet/WrongNetworkBanner'
import { useWallet } from '@/hooks/wallet'

export function Header() {
  const { isConnected } = useWallet()

  return (
    <>
      <WrongNetworkBanner />
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">LP</span>
                </div>
                <span className="font-semibold text-lg hidden sm:block">
                  Liquidity Dashboard
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/positions"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Positions
                </Link>
                <Link
                  href="/simulate"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Simulate
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              {isConnected && <ChainSwitcher />}
              <ConnectWalletButton />
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
