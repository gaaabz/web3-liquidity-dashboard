import { type ReactNode } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { DemoModeBanner } from '@/components/demo'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <DemoModeBanner />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
