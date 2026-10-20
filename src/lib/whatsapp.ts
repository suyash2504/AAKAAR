import { site } from '../config/site'
import { productById } from '../data/catalog'
import { formatINR } from './format'
import type { CartLine } from '../types'

export const whatsappReady = !!site.contact.whatsapp

/** wa.me link with a prefilled message. Opening it does not place an order. */
export function waLink(text: string) {
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(text)}`
}

export function cartMessage(lines: CartLine[], subtotal: number) {
  const rows = lines.map((l) => {
    const p = productById(l.productId)
    const colour = p?.colours.find((c) => c.id === l.colourId)?.name
    return `• ${p?.name} (${colour}) × ${l.qty} — ${formatINR((p?.price ?? 0) * l.qty)}`
  })
  return [`Hi AAKAAR, I'd like to order:`, ...rows, `Subtotal: ${formatINR(subtotal)}`, 'Please confirm availability, shipping and payment details.'].join('\n')
}
