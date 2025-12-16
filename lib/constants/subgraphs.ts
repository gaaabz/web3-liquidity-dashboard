import type { SupportedChainId } from './chains'

export const SUBGRAPH_URLS: Record<SupportedChainId, string | null> = {
  11155111: 'https://api.studio.thegraph.com/query/48211/uniswap-v3-sepolia/version/latest',
  43113: null,
}

export function getSubgraphUrl(chainId: SupportedChainId): string | null {
  return SUBGRAPH_URLS[chainId]
}
