import type { Address } from 'viem'
import type { SupportedChainId } from '@/lib/constants/chains'

export interface ChainContracts {
  nonfungiblePositionManager: Address
  factory: Address
  swapRouter: Address
  quoterV2: Address
}

export const CONTRACT_ADDRESSES: Record<SupportedChainId, ChainContracts> = {
  11155111: {
    nonfungiblePositionManager: '0x1238536071E1c677A632429e3655c799b22cDA52',
    factory: '0x0227628f3F023bb0B980b67D528571c95c6DaC1c',
    swapRouter: '0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E',
    quoterV2: '0xEd1f6473345F45b75F8179591dd5bA1888cf2FB3',
  },
  43113: {
    nonfungiblePositionManager: '0x0000000000000000000000000000000000000000',
    factory: '0x0000000000000000000000000000000000000000',
    swapRouter: '0x0000000000000000000000000000000000000000',
    quoterV2: '0x0000000000000000000000000000000000000000',
  },
}

export function getContractAddress(
  chainId: SupportedChainId,
  contract: keyof ChainContracts
): Address {
  return CONTRACT_ADDRESSES[chainId][contract]
}

export function hasValidContracts(chainId: SupportedChainId): boolean {
  const contracts = CONTRACT_ADDRESSES[chainId]
  return contracts.nonfungiblePositionManager !== '0x0000000000000000000000000000000000000000'
}
