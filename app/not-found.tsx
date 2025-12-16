import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-8xl font-bold text-primary/20 mb-4">404</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Page Not Found</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Go Home
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-foreground rounded-lg font-medium hover:bg-muted transition-colors"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
