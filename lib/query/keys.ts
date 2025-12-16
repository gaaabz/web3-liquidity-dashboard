import type { Address } from 'viem'
import type { SupportedChainId } from '@/lib/constants/chains'

export const queryKeys = {
  positions: {
    all: (chainId: SupportedChainId) => ['positions', chainId] as const,
    list: (chainId: SupportedChainId, address: Address | undefined) =>
      ['positions', chainId, address, 'list'] as const,
    detail: (chainId: SupportedChainId, tokenId: string) =>
      ['positions', chainId, tokenId] as const,
  },
  pools: {
    all: (chainId: SupportedChainId) => ['pools', chainId] as const,
    data: (chainId: SupportedChainId, address: Address | undefined) =>
      ['pools', chainId, address, 'data'] as const,
    tick: (chainId: SupportedChainId, address: Address | undefined) =>
      ['pools', chainId, address, 'tick'] as const,
  },
  tokens: {
    all: (chainId: SupportedChainId) => ['tokens', chainId] as const,
    data: (chainId: SupportedChainId, address: Address) =>
      ['tokens', chainId, address, 'data'] as const,
    price: (chainId: SupportedChainId, address: Address) =>
      ['tokens', chainId, address, 'price'] as const,
  },
  metrics: {
    position: (chainId: SupportedChainId, tokenId: string) =>
      ['metrics', chainId, tokenId] as const,
    portfolio: (chainId: SupportedChainId, address: Address | undefined) =>
      ['metrics', chainId, address, 'portfolio'] as const,
  },
}
