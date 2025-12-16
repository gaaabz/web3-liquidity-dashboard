import { getGraphClient } from './client'
import type { SupportedChainId } from '@/lib/constants/chains'

export interface GraphPosition {
  id: string
  tokenId: string
  owner: string
  pool: {
    id: string
    token0: {
      id: string
      symbol: string
      decimals: string
    }
    token1: {
      id: string
      symbol: string
      decimals: string
    }
    feeTier: string
  }
  tickLower: {
    tickIdx: string
  }
  tickUpper: {
    tickIdx: string
  }
  liquidity: string
  depositedToken0: string
  depositedToken1: string
  withdrawnToken0: string
  withdrawnToken1: string
  collectedFeesToken0: string
  collectedFeesToken1: string
}

export interface GraphPool {
  id: string
  token0: {
    id: string
    symbol: string
    name: string
    decimals: string
  }
  token1: {
    id: string
    symbol: string
    name: string
    decimals: string
  }
  feeTier: string
  sqrtPrice: string
  tick: string
  liquidity: string
  volumeUSD: string
  feesUSD: string
  txCount: string
  totalValueLockedUSD: string
  token0Price: string
  token1Price: string
}

export interface GraphPoolDayData {
  date: number
  volumeUSD: string
  feesUSD: string
  liquidity: string
  tvlUSD: string
  token0Price: string
  token1Price: string
}

const POSITIONS_BY_OWNER_QUERY = `
  query PositionsByOwner($owner: String!) {
    positions(
      where: { owner: $owner, liquidity_gt: "0" }
      orderBy: tokenId
      orderDirection: desc
    ) {
      id
      tokenId
      owner
      pool {
        id
        token0 {
          id
          symbol
          decimals
        }
        token1 {
          id
          symbol
          decimals
        }
        feeTier
      }
      tickLower {
        tickIdx
      }
      tickUpper {
        tickIdx
      }
      liquidity
      depositedToken0
      depositedToken1
      withdrawnToken0
      withdrawnToken1
      collectedFeesToken0
      collectedFeesToken1
    }
  }
`

const POOL_QUERY = `
  query Pool($poolId: String!) {
    pool(id: $poolId) {
      id
      token0 {
        id
        symbol
        name
        decimals
      }
      token1 {
        id
        symbol
        name
        decimals
      }
      feeTier
      sqrtPrice
      tick
      liquidity
      volumeUSD
      feesUSD
      txCount
      totalValueLockedUSD
      token0Price
      token1Price
    }
  }
`

const POOL_DAY_DATA_QUERY = `
  query PoolDayDatas($poolId: String!, $days: Int!) {
    poolDayDatas(
      where: { pool: $poolId }
      orderBy: date
      orderDirection: desc
      first: $days
    ) {
      date
      volumeUSD
      feesUSD
      liquidity
      tvlUSD
      token0Price
      token1Price
    }
  }
`

export async function fetchPositionsByOwner(
  owner: string,
  chainId: SupportedChainId
): Promise<GraphPosition[]> {
  const client = getGraphClient(chainId)

  if (!client.isAvailable()) {
    return []
  }

  const data = await client.query<{ positions: GraphPosition[] }>(
    POSITIONS_BY_OWNER_QUERY,
    { owner: owner.toLowerCase() }
  )

  return data.positions
}

export async function fetchPool(
  poolId: string,
  chainId: SupportedChainId
): Promise<GraphPool | null> {
  const client = getGraphClient(chainId)

  if (!client.isAvailable()) {
    return null
  }

  const data = await client.query<{ pool: GraphPool | null }>(
    POOL_QUERY,
    { poolId: poolId.toLowerCase() }
  )

  return data.pool
}

export async function fetchPoolDayData(
  poolId: string,
  days: number,
  chainId: SupportedChainId
): Promise<GraphPoolDayData[]> {
  const client = getGraphClient(chainId)

  if (!client.isAvailable()) {
    return []
  }

  const data = await client.query<{ poolDayDatas: GraphPoolDayData[] }>(
    POOL_DAY_DATA_QUERY,
    { poolId: poolId.toLowerCase(), days }
  )

  return data.poolDayDatas
}

export function graphPositionToTokenId(position: GraphPosition): bigint {
  return BigInt(position.tokenId)
}

export function calculateHistoricalFees(position: GraphPosition): {
  token0: number
  token1: number
} {
  return {
    token0: parseFloat(position.collectedFeesToken0),
    token1: parseFloat(position.collectedFeesToken1),
  }
}
