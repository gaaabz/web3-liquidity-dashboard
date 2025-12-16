import { getSubgraphUrl } from '@/lib/constants/subgraphs'
import type { SupportedChainId } from '@/lib/constants/chains'

export interface GraphQLResponse<T> {
  data?: T
  errors?: Array<{ message: string }>
}

export class GraphClient {
  private chainId: SupportedChainId
  private url: string | null

  constructor(chainId: SupportedChainId) {
    this.chainId = chainId
    this.url = getSubgraphUrl(chainId)
  }

  async query<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    if (!this.url) {
      throw new Error(`No subgraph available for chain ${this.chainId}`)
    }

    const response = await fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })

    if (!response.ok) {
      throw new Error(`Graph query failed: ${response.statusText}`)
    }

    const result: GraphQLResponse<T> = await response.json()

    if (result.errors && result.errors.length > 0) {
      throw new Error(`Graph query error: ${result.errors[0].message}`)
    }

    if (!result.data) {
      throw new Error('No data returned from graph query')
    }

    return result.data
  }

  isAvailable(): boolean {
    return this.url !== null
  }
}

const clientCache = new Map<SupportedChainId, GraphClient>()

export function getGraphClient(chainId: SupportedChainId): GraphClient {
  let client = clientCache.get(chainId)
  if (!client) {
    client = new GraphClient(chainId)
    clientCache.set(chainId, client)
  }
  return client
}
