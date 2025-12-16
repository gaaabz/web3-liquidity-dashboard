import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { DemoModeBanner } from '@/components/demo'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'

export default function PositionLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <DemoModeBanner />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-6">
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              <Skeleton className="w-14 h-14 rounded-full" />
              <Skeleton className="w-14 h-14 rounded-full" />
            </div>
            <div>
              <Skeleton className="h-8 w-40 mb-2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          </div>
          <div className="text-right">
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <Skeleton className="h-8 w-full rounded-full mb-4" />
                <div className="flex justify-between">
                  <div>
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <div className="text-center">
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div>
                          <Skeleton className="h-5 w-16 mb-1" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                      <div className="text-right">
                        <Skeleton className="h-5 w-20 mb-1" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-28" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
