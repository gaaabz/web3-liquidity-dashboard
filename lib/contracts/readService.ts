import { readContract, readContracts } from '@wagmi/core'
import { wagmiConfig } from '@/lib/wagmi/config'
import { NonfungiblePositionManagerABI } from './abis/NonfungiblePositionManager'
import { UniswapV3PoolABI, UniswapV3FactoryABI } from './abis/UniswapV3Pool'
import { ERC20ABI } from './abis/ERC20'
import { CONTRACT_ADDRESSES, type ChainContracts } from './addresses'
import type { SupportedChainId } from '@/lib/constants/chains'

export interface PositionRawData {
  nonce: bigint
  operator: `0x${string}`
  token0: `0x${string}`
  token1: `0x${string}`
  fee: number
  tickLower: number
  tickUpper: number
  liquidity: bigint
  feeGrowthInside0LastX128: bigint
  feeGrowthInside1LastX128: bigint
  tokensOwed0: bigint
  tokensOwed1: bigint
}

export interface PoolSlot0 {
  sqrtPriceX96: bigint
  tick: number
  observationIndex: number
  observationCardinality: number
  observationCardinalityNext: number
  feeProtocol: number
  unlocked: boolean
}

export interface PoolData {
  slot0: PoolSlot0
  token0: `0x${string}`
  token1: `0x${string}`
  fee: number
  tickSpacing: number
  liquidity: bigint
  feeGrowthGlobal0X128: bigint
  feeGrowthGlobal1X128: bigint
}

export interface TokenData {
  address: `0x${string}`
  name: string
  symbol: string
  decimals: number
}

export interface TickData {
  liquidityGross: bigint
  liquidityNet: bigint
  feeGrowthOutside0X128: bigint
  feeGrowthOutside1X128: bigint
  initialized: boolean
}

function getContracts(chainId: SupportedChainId): ChainContracts {
  return CONTRACT_ADDRESSES[chainId]
}

export async function getPositionTokenIds(
  owner: `0x${string}`,
  chainId: SupportedChainId
): Promise<bigint[]> {
  const contracts = getContracts(chainId)

  const balance = await readContract(wagmiConfig, {
    address: contracts.nonfungiblePositionManager,
    abi: NonfungiblePositionManagerABI,
    functionName: 'balanceOf',
    args: [owner],
    chainId,
  })

  if (balance === 0n) return []

  const tokenIdCalls = Array.from({ length: Number(balance) }, (_, i) => ({
    address: contracts.nonfungiblePositionManager,
    abi: NonfungiblePositionManagerABI,
    functionName: 'tokenOfOwnerByIndex' as const,
    args: [owner, BigInt(i)] as const,
    chainId,
  }))

  const results = await readContracts(wagmiConfig, {
    contracts: tokenIdCalls,
  })

  return results
    .filter((r): r is { result: bigint; status: 'success' } => r.status === 'success')
    .map((r) => r.result)
}

export async function getPosition(
  tokenId: bigint,
  chainId: SupportedChainId
): Promise<PositionRawData> {
  const contracts = getContracts(chainId)

  const result = await readContract(wagmiConfig, {
    address: contracts.nonfungiblePositionManager,
    abi: NonfungiblePositionManagerABI,
    functionName: 'positions',
    args: [tokenId],
    chainId,
  })

  return {
    nonce: result[0],
    operator: result[1],
    token0: result[2],
    token1: result[3],
    fee: result[4],
    tickLower: result[5],
    tickUpper: result[6],
    liquidity: result[7],
    feeGrowthInside0LastX128: result[8],
    feeGrowthInside1LastX128: result[9],
    tokensOwed0: result[10],
    tokensOwed1: result[11],
  }
}

export async function getPositions(
  tokenIds: bigint[],
  chainId: SupportedChainId
): Promise<Map<bigint, PositionRawData>> {
  const contracts = getContracts(chainId)

  const positionCalls = tokenIds.map((tokenId) => ({
    address: contracts.nonfungiblePositionManager,
    abi: NonfungiblePositionManagerABI,
    functionName: 'positions' as const,
    args: [tokenId] as const,
    chainId,
  }))

  const results = await readContracts(wagmiConfig, {
    contracts: positionCalls,
  })

  const positionsMap = new Map<bigint, PositionRawData>()

  results.forEach((result, index) => {
    if (result.status === 'success') {
      const data = result.result
      positionsMap.set(tokenIds[index], {
        nonce: data[0],
        operator: data[1],
        token0: data[2],
        token1: data[3],
        fee: data[4],
        tickLower: data[5],
        tickUpper: data[6],
        liquidity: data[7],
        feeGrowthInside0LastX128: data[8],
        feeGrowthInside1LastX128: data[9],
        tokensOwed0: data[10],
        tokensOwed1: data[11],
      })
    }
  })

  return positionsMap
}

export async function getPoolAddress(
  token0: `0x${string}`,
  token1: `0x${string}`,
  fee: number,
  chainId: SupportedChainId
): Promise<`0x${string}`> {
  const contracts = getContracts(chainId)

  const poolAddress = await readContract(wagmiConfig, {
    address: contracts.factory,
    abi: UniswapV3FactoryABI,
    functionName: 'getPool',
    args: [token0, token1, fee],
    chainId,
  })

  return poolAddress
}

export async function getPoolData(
  poolAddress: `0x${string}`,
  chainId: SupportedChainId
): Promise<PoolData> {
  const results = await readContracts(wagmiConfig, {
    contracts: [
      {
        address: poolAddress,
        abi: UniswapV3PoolABI,
        functionName: 'slot0',
        chainId,
      },
      {
        address: poolAddress,
        abi: UniswapV3PoolABI,
        functionName: 'token0',
        chainId,
      },
      {
        address: poolAddress,
        abi: UniswapV3PoolABI,
        functionName: 'token1',
        chainId,
      },
      {
        address: poolAddress,
        abi: UniswapV3PoolABI,
        functionName: 'fee',
        chainId,
      },
      {
        address: poolAddress,
        abi: UniswapV3PoolABI,
        functionName: 'tickSpacing',
        chainId,
      },
      {
        address: poolAddress,
        abi: UniswapV3PoolABI,
        functionName: 'liquidity',
        chainId,
      },
      {
        address: poolAddress,
        abi: UniswapV3PoolABI,
        functionName: 'feeGrowthGlobal0X128',
        chainId,
      },
      {
        address: poolAddress,
        abi: UniswapV3PoolABI,
        functionName: 'feeGrowthGlobal1X128',
        chainId,
      },
    ],
  })

  const [slot0, token0, token1, fee, tickSpacing, liquidity, feeGrowth0, feeGrowth1] = results

  if (slot0.status !== 'success') {
    throw new Error('Failed to fetch pool slot0')
  }

  return {
    slot0: {
      sqrtPriceX96: slot0.result[0],
      tick: slot0.result[1],
      observationIndex: slot0.result[2],
      observationCardinality: slot0.result[3],
      observationCardinalityNext: slot0.result[4],
      feeProtocol: slot0.result[5],
      unlocked: slot0.result[6],
    },
    token0: token0.status === 'success' ? token0.result : '0x0000000000000000000000000000000000000000',
    token1: token1.status === 'success' ? token1.result : '0x0000000000000000000000000000000000000000',
    fee: fee.status === 'success' ? fee.result : 0,
    tickSpacing: tickSpacing.status === 'success' ? tickSpacing.result : 0,
    liquidity: liquidity.status === 'success' ? liquidity.result : 0n,
    feeGrowthGlobal0X128: feeGrowth0.status === 'success' ? feeGrowth0.result : 0n,
    feeGrowthGlobal1X128: feeGrowth1.status === 'success' ? feeGrowth1.result : 0n,
  }
}

export async function getTickData(
  poolAddress: `0x${string}`,
  tick: number,
  chainId: SupportedChainId
): Promise<TickData> {
  const result = await readContract(wagmiConfig, {
    address: poolAddress,
    abi: UniswapV3PoolABI,
    functionName: 'ticks',
    args: [tick],
    chainId,
  })

  return {
    liquidityGross: result[0],
    liquidityNet: result[1],
    feeGrowthOutside0X128: result[2],
    feeGrowthOutside1X128: result[3],
    initialized: result[7],
  }
}

export async function getTokenData(
  tokenAddress: `0x${string}`,
  chainId: SupportedChainId
): Promise<TokenData> {
  const results = await readContracts(wagmiConfig, {
    contracts: [
      {
        address: tokenAddress,
        abi: ERC20ABI,
        functionName: 'name',
        chainId,
      },
      {
        address: tokenAddress,
        abi: ERC20ABI,
        functionName: 'symbol',
        chainId,
      },
      {
        address: tokenAddress,
        abi: ERC20ABI,
        functionName: 'decimals',
        chainId,
      },
    ],
  })

  return {
    address: tokenAddress,
    name: results[0].status === 'success' ? results[0].result : 'Unknown',
    symbol: results[1].status === 'success' ? results[1].result : '???',
    decimals: results[2].status === 'success' ? results[2].result : 18,
  }
}

export async function getTokensData(
  tokenAddresses: `0x${string}`[],
  chainId: SupportedChainId
): Promise<Map<`0x${string}`, TokenData>> {
  const uniqueAddresses = [...new Set(tokenAddresses)]

  const calls = uniqueAddresses.flatMap((address) => [
    {
      address,
      abi: ERC20ABI,
      functionName: 'name' as const,
      chainId,
    },
    {
      address,
      abi: ERC20ABI,
      functionName: 'symbol' as const,
      chainId,
    },
    {
      address,
      abi: ERC20ABI,
      functionName: 'decimals' as const,
      chainId,
    },
  ])

  const results = await readContracts(wagmiConfig, { contracts: calls })

  const tokensMap = new Map<`0x${string}`, TokenData>()

  uniqueAddresses.forEach((address, i) => {
    const baseIndex = i * 3
    tokensMap.set(address, {
      address,
      name: results[baseIndex].status === 'success' ? (results[baseIndex].result as string) : 'Unknown',
      symbol: results[baseIndex + 1].status === 'success' ? (results[baseIndex + 1].result as string) : '???',
      decimals: results[baseIndex + 2].status === 'success' ? (results[baseIndex + 2].result as number) : 18,
    })
  })

  return tokensMap
}
