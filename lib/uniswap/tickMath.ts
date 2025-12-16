import { MIN_TICK, MAX_TICK, MIN_SQRT_RATIO, MAX_SQRT_RATIO, Q96 } from './constants'

const LOG_BASE_1_0001 = Math.log(1.0001)

export function tickToSqrtPriceX96(tick: number): bigint {
  if (tick < MIN_TICK || tick > MAX_TICK) {
    throw new Error(`Tick ${tick} out of range [${MIN_TICK}, ${MAX_TICK}]`)
  }

  const absTick = tick < 0 ? -tick : tick

  let ratio = (absTick & 0x1) !== 0
    ? 0xfffcb933bd6fad37aa2d162d1a594001n
    : 0x100000000000000000000000000000000n

  if ((absTick & 0x2) !== 0) ratio = (ratio * 0xfff97272373d413259a46990580e213an) >> 128n
  if ((absTick & 0x4) !== 0) ratio = (ratio * 0xfff2e50f5f656932ef12357cf3c7fdccn) >> 128n
  if ((absTick & 0x8) !== 0) ratio = (ratio * 0xffe5caca7e10e4e61c3624eaa0941cd0n) >> 128n
  if ((absTick & 0x10) !== 0) ratio = (ratio * 0xffcb9843d60f6159c9db58835c926644n) >> 128n
  if ((absTick & 0x20) !== 0) ratio = (ratio * 0xff973b41fa98c081472e6896dfb254c0n) >> 128n
  if ((absTick & 0x40) !== 0) ratio = (ratio * 0xff2ea16466c96a3843ec78b326b52861n) >> 128n
  if ((absTick & 0x80) !== 0) ratio = (ratio * 0xfe5dee046a99a2a811c461f1969c3053n) >> 128n
  if ((absTick & 0x100) !== 0) ratio = (ratio * 0xfcbe86c7900a88aedcffc83b479aa3a4n) >> 128n
  if ((absTick & 0x200) !== 0) ratio = (ratio * 0xf987a7253ac413176f2b074cf7815e54n) >> 128n
  if ((absTick & 0x400) !== 0) ratio = (ratio * 0xf3392b0822b70005940c7a398e4b70f3n) >> 128n
  if ((absTick & 0x800) !== 0) ratio = (ratio * 0xe7159475a2c29b7443b29c7fa6e889d9n) >> 128n
  if ((absTick & 0x1000) !== 0) ratio = (ratio * 0xd097f3bdfd2022b8845ad8f792aa5825n) >> 128n
  if ((absTick & 0x2000) !== 0) ratio = (ratio * 0xa9f746462d870fdf8a65dc1f90e061e5n) >> 128n
  if ((absTick & 0x4000) !== 0) ratio = (ratio * 0x70d869a156d2a1b890bb3df62baf32f7n) >> 128n
  if ((absTick & 0x8000) !== 0) ratio = (ratio * 0x31be135f97d08fd981231505542fcfa6n) >> 128n
  if ((absTick & 0x10000) !== 0) ratio = (ratio * 0x9aa508b5b7a84e1c677de54f3e99bc9n) >> 128n
  if ((absTick & 0x20000) !== 0) ratio = (ratio * 0x5d6af8dedb81196699c329225ee604n) >> 128n
  if ((absTick & 0x40000) !== 0) ratio = (ratio * 0x2216e584f5fa1ea926041bedfe98n) >> 128n
  if ((absTick & 0x80000) !== 0) ratio = (ratio * 0x48a170391f7dc42444e8fa2n) >> 128n

  if (tick > 0) {
    ratio = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn / ratio
  }

  return (ratio >> 32n) + (ratio % (1n << 32n) === 0n ? 0n : 1n)
}

export function sqrtPriceX96ToTick(sqrtPriceX96: bigint): number {
  if (sqrtPriceX96 < MIN_SQRT_RATIO || sqrtPriceX96 >= MAX_SQRT_RATIO) {
    throw new Error('sqrtPriceX96 out of range')
  }

  const ratio = sqrtPriceX96 << 32n

  let r = ratio
  let msb = 0n

  let f = r > 0xffffffffffffffffffffffffffffffffn ? 1n : 0n
  msb = msb | (f << 7n)
  r = r >> (f * 128n)

  f = r > 0xffffffffffffffffn ? 1n : 0n
  msb = msb | (f << 6n)
  r = r >> (f * 64n)

  f = r > 0xffffffffn ? 1n : 0n
  msb = msb | (f << 5n)
  r = r >> (f * 32n)

  f = r > 0xffffn ? 1n : 0n
  msb = msb | (f << 4n)
  r = r >> (f * 16n)

  f = r > 0xffn ? 1n : 0n
  msb = msb | (f << 3n)
  r = r >> (f * 8n)

  f = r > 0xfn ? 1n : 0n
  msb = msb | (f << 2n)
  r = r >> (f * 4n)

  f = r > 0x3n ? 1n : 0n
  msb = msb | (f << 1n)
  r = r >> (f * 2n)

  f = r > 0x1n ? 1n : 0n
  msb = msb | f

  r = msb >= 128n ? ratio >> (msb - 127n) : ratio << (127n - msb)

  let log2 = (msb - 128n) << 64n

  for (let i = 0; i < 14; i++) {
    r = (r * r) >> 127n
    const f = r >> 128n
    log2 = log2 | (f << BigInt(63 - i))
    r = r >> f
  }

  const logSqrt10001 = log2 * 255738958999603826347141n

  const tickLow = Number((logSqrt10001 - 3402992956809132418596140100660247210n) >> 128n)
  const tickHigh = Number((logSqrt10001 + 291339464771989622907027621153398088495n) >> 128n)

  return tickLow === tickHigh ? tickLow : tickToSqrtPriceX96(tickHigh) <= sqrtPriceX96 ? tickHigh : tickLow
}

export function tickToPrice(tick: number, token0Decimals: number, token1Decimals: number): number {
  const sqrtRatioX96 = tickToSqrtPriceX96(tick)
  const ratioX192 = sqrtRatioX96 * sqrtRatioX96
  const price = Number(ratioX192) / Number(Q96 * Q96)
  const decimalAdjustment = 10 ** (token0Decimals - token1Decimals)
  return price * decimalAdjustment
}

export function priceToTick(price: number, token0Decimals: number, token1Decimals: number): number {
  const decimalAdjustment = 10 ** (token0Decimals - token1Decimals)
  const adjustedPrice = price / decimalAdjustment
  const tick = Math.floor(Math.log(adjustedPrice) / LOG_BASE_1_0001)
  return Math.max(MIN_TICK, Math.min(MAX_TICK, tick))
}

export function nearestUsableTick(tick: number, tickSpacing: number): number {
  const rounded = Math.round(tick / tickSpacing) * tickSpacing
  if (rounded < MIN_TICK) return MIN_TICK
  if (rounded > MAX_TICK) return Math.floor(MAX_TICK / tickSpacing) * tickSpacing
  return rounded
}

export function isValidTick(tick: number): boolean {
  return tick >= MIN_TICK && tick <= MAX_TICK && Number.isInteger(tick)
}

export function getTickAtSqrtRatio(sqrtRatioX96: bigint): number {
  return sqrtPriceX96ToTick(sqrtRatioX96)
}

export function getSqrtRatioAtTick(tick: number): bigint {
  return tickToSqrtPriceX96(tick)
}
