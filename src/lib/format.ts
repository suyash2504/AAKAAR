import type { Availability } from '../types'

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
export const formatINR = (n: number) => inr.format(Math.round(n))

export const availabilityLabel: Record<Availability, string> = {
  in_stock: 'In stock',
  low_stock: 'Only a few left',
  made_to_order: 'Made to order',
  sold_out: 'Sold out',
}
