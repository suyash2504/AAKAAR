export type Material = 'cement' | 'concrete' | 'resin'
export type Kind = 'planters' | 'candle-holders' | 'trays-bowls' | 'decor'
export type Space = 'living' | 'desk' | 'bedroom' | 'balcony' | 'gifting'
export type Availability = 'in_stock' | 'low_stock' | 'made_to_order' | 'sold_out'

export interface Colour {
  id: string
  name: string
  hex: string
}

export interface Photo {
  /** Pexels photo id (stand-in) or an absolute/relative URL once real photos exist */
  src: string
  alt: string
}

export interface Product {
  id: string
  slug: string
  sku: string
  name: string
  short: string
  description: string
  price: number
  compareAt?: number
  kind: Kind
  material: Material
  materialLabel: string
  finish: string
  dimensions: string
  weight?: string
  colours: Colour[]
  images: Photo[]
  availability: Availability
  spaces: Space[]
  featured?: boolean
  bestseller?: boolean
  limited?: boolean
  isNew?: boolean
  setOf?: number
  care: string[]
  added: string
}

export interface CartLine {
  key: string
  productId: string
  colourId: string
  qty: number
}

export interface Collection {
  slug: string
  name: string
  label: string
  blurb: string
  image: Photo
  tint: string
  match: (p: Product) => boolean
}
