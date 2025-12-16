export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Built for Uniswap V3 Liquidity Providers
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Sepolia & Fuji Testnets</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>Demo Mode Available</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
