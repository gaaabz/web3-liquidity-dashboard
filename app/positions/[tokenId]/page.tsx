import { DEMO_POSITIONS } from '@/data/demo/positions'
import { PositionPageClient } from './PositionPageClient'

export function generateStaticParams() {
  return DEMO_POSITIONS.map((position) => ({
    tokenId: position.tokenId.toString(),
  }))
}

interface PositionPageProps {
  params: Promise<{ tokenId: string }>
}

export default function PositionPage({ params }: PositionPageProps) {
  return <PositionPageClient params={params} />
}
