import { site } from '../config/site'
import { productById } from '../data/catalog'
import type { CartLine } from '../types'

export interface Totals {
  subtotal: number
  /** null while no shipping rule is configured */
  shipping: number | null
  total: number
  count: number
}

/**
 * Display-only totals. A live checkout recomputes every figure on the server
 * from its own prices (supabase/functions/razorpay-create-order).
 */
export function computeTotals(lines: CartLine[]): Totals {
  let subtotal = 0
  let count = 0
  for (const l of lines) {
    const p = productById(l.productId)
    if (!p) continue
    subtotal += p.price * l.qty
    count += l.qty
  }
  const { flatRate, freeAbove } = site.shipping
  let shipping: number | null = null
  if (flatRate != null) shipping = count === 0 || (freeAbove != null && subtotal >= freeAbove) ? 0 : flatRate
  return { subtotal, shipping, total: subtotal + (shipping ?? 0), count }
}
