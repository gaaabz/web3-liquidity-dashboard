import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Web3Provider } from '@/components/providers/Web3Provider'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Web3 Liquidity Dashboard | Uniswap V3 LP Manager',
    template: '%s | Liquidity Dashboard',
  },
  description: 'Professional liquidity management dashboard for Uniswap V3. Analyze, compare and simulate LP strategies across multiple networks.',
  keywords: ['DeFi', 'Uniswap', 'Liquidity', 'LP', 'Web3', 'Ethereum', 'Avalanche'],
  authors: [{ name: 'Web3 Dashboard' }],
  openGraph: {
    title: 'Web3 Liquidity Dashboard',
    description: 'Professional liquidity management for Uniswap V3 LPs',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web3 Liquidity Dashboard',
    description: 'Professional liquidity management for Uniswap V3 LPs',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  )
}
