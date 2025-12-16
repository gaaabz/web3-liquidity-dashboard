import { type Chain } from 'viem'
import { sepolia } from 'viem/chains'

export const avalancheFuji: Chain = {
  id: 43113,
  name: 'Avalanche Fuji',
  nativeCurrency: {
    decimals: 18,
    name: 'Avalanche',
    symbol: 'AVAX',
  },
  rpcUrls: {
    default: { http: ['https://api.avax-test.network/ext/bc/C/rpc'] },
  },
  blockExplorers: {
    default: { name: 'SnowTrace', url: 'https://testnet.snowtrace.io' },
  },
  testnet: true,
}

export const SUPPORTED_CHAINS = [sepolia, avalancheFuji] as const
export type SupportedChainId = (typeof SUPPORTED_CHAINS)[number]['id']
export const SUPPORTED_CHAIN_IDS: SupportedChainId[] = SUPPORTED_CHAINS.map(c => c.id)

export const DEFAULT_CHAIN = sepolia
export const DEFAULT_CHAIN_ID = sepolia.id

export function isSupportedChain(chainId: number | undefined): chainId is SupportedChainId {
  return chainId !== undefined && SUPPORTED_CHAIN_IDS.includes(chainId as SupportedChainId)
}

export function getChainById(chainId: SupportedChainId): Chain {
  const chain = SUPPORTED_CHAINS.find(c => c.id === chainId)
  if (!chain) {
    throw new Error(`Chain ${chainId} not supported`)
  }
  return chain
}

export function getBlockExplorerUrl(chainId: SupportedChainId): string {
  const chain = getChainById(chainId)
  return chain.blockExplorers?.default?.url ?? ''
}

export function getBlockExplorerAddressUrl(chainId: SupportedChainId, address: string): string {
  return `${getBlockExplorerUrl(chainId)}/address/${address}`
}

export function getBlockExplorerTxUrl(chainId: SupportedChainId, txHash: string): string {
  return `${getBlockExplorerUrl(chainId)}/tx/${txHash}`
}
