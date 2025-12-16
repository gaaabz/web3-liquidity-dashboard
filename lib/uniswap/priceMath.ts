import { Q96 } from './constants'

export function sqrtPriceX96ToPrice(
  sqrtPriceX96: bigint,
  token0Decimals: number,
  token1Decimals: number
): number {
  const ratioX192 = sqrtPriceX96 * sqrtPriceX96
  const price = Number(ratioX192) / Number(Q96 * Q96)
  const decimalAdjustment = 10 ** (token0Decimals - token1Decimals)
  return price * decimalAdjustment
}

export function priceToSqrtPriceX96(
  price: number,
  token0Decimals: number,
  token1Decimals: number
): bigint {
  const decimalAdjustment = 10 ** (token0Decimals - token1Decimals)
  const adjustedPrice = price / decimalAdjustment
  const sqrtPrice = Math.sqrt(adjustedPrice)
  return BigInt(Math.floor(sqrtPrice * Number(Q96)))
}

export function invertPrice(price: number): number {
  if (price === 0) return 0
  return 1 / price
}

export function formatPrice(price: number, significantDigits: number = 6): string {
  if (price === 0) return '0'

  if (price >= 1) {
    return price.toLocaleString('en-US', {
      maximumFractionDigits: Math.max(0, significantDigits - Math.floor(Math.log10(price)) - 1),
    })
  }

  const leadingZeros = Math.floor(-Math.log10(price))
  return price.toFixed(leadingZeros + significantDigits - 1)
}

export function sqrtPriceX96ToToken0Price(
  sqrtPriceX96: bigint,
  token0Decimals: number,
  token1Decimals: number
): number {
  return sqrtPriceX96ToPrice(sqrtPriceX96, token0Decimals, token1Decimals)
}

export function sqrtPriceX96ToToken1Price(
  sqrtPriceX96: bigint,
  token0Decimals: number,
  token1Decimals: number
): number {
  const token0Price = sqrtPriceX96ToPrice(sqrtPriceX96, token0Decimals, token1Decimals)
  return invertPrice(token0Price)
}

export function calculatePriceImpact(
  currentPrice: number,
  newPrice: number
): { absolute: number; percentage: number } {
  const absolute = newPrice - currentPrice
  const percentage = ((newPrice - currentPrice) / currentPrice) * 100
  return { absolute, percentage }
}

export function isPriceWithinRange(
  currentPrice: number,
  lowerPrice: number,
  upperPrice: number
): boolean {
  return currentPrice >= lowerPrice && currentPrice <= upperPrice
}

export function calculateMidPrice(lowerPrice: number, upperPrice: number): number {
  return Math.sqrt(lowerPrice * upperPrice)
}

export function priceRangeWidth(lowerPrice: number, upperPrice: number): number {
  return ((upperPrice - lowerPrice) / lowerPrice) * 100
}

export function distanceFromRange(
  currentPrice: number,
  lowerPrice: number,
  upperPrice: number
): { position: 'below' | 'within' | 'above'; distance: number } {
  if (currentPrice < lowerPrice) {
    return {
      position: 'below',
      distance: ((lowerPrice - currentPrice) / lowerPrice) * 100,
    }
  }
  if (currentPrice > upperPrice) {
    return {
      position: 'above',
      distance: ((currentPrice - upperPrice) / upperPrice) * 100,
    }
  }
  return { position: 'within', distance: 0 }
}
