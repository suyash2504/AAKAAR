import type { Product } from '../types'

export type Sort = 'featured' | 'newest' | 'price-asc' | 'price-desc'
export const sortLabels: Record<Sort, string> = {
  featured: 'Featured', newest: 'Newest', 'price-asc': 'Price: low to high', 'price-desc': 'Price: high to low',
}

export interface Filters {
  q: string
  kinds: string[]
  materials: string[]
  colours: string[]
  spaces: string[]
  min: number | null
  max: number | null
  sort: Sort
}

export function readFilters(sp: URLSearchParams): Filters {
  const list = (k: string) => (sp.get(k) ? sp.get(k)!.split(',').filter(Boolean) : [])
  const num = (k: string) => (sp.get(k) && !isNaN(Number(sp.get(k))) ? Number(sp.get(k)) : null)
  const sort = (sp.get('sort') as Sort) || 'featured'
  return { q: sp.get('q') ?? '', kinds: list('kind'), materials: list('material'), colours: list('colour'), spaces: list('space'), min: num('min'), max: num('max'), sort: sort in sortLabels ? sort : 'featured' }
}

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^\w\s]/g, ' ')

export function matchesQuery(p: Product, q: string) {
  const words = norm(q).split(/\s+/).filter(Boolean)
  if (!words.length) return true
  const hay = norm([p.name, p.short, p.description, p.materialLabel, p.kind, p.material, ...p.colours.map((c) => c.name), ...p.spaces].join(' '))
  return words.every((w) => hay.includes(w.replace(/s$/, '')))
}

export function applyFilters(list: Product[], f: Filters) {
  const out = list.filter((p) =>
    matchesQuery(p, f.q) &&
    (!f.kinds.length || f.kinds.includes(p.kind)) &&
    (!f.materials.length || f.materials.includes(p.material)) &&
    (!f.colours.length || p.colours.some((c) => f.colours.includes(c.id))) &&
    (!f.spaces.length || p.spaces.some((s) => f.spaces.includes(s))) &&
    (f.min == null || p.price >= f.min) &&
    (f.max == null || p.price <= f.max),
  )
  const score = (p: Product) => (p.featured ? 2 : 0) + (p.bestseller ? 1 : 0)
  switch (f.sort) {
    case 'newest': return out.sort((a, b) => b.added.localeCompare(a.added))
    case 'price-asc': return out.sort((a, b) => a.price - b.price)
    case 'price-desc': return out.sort((a, b) => b.price - a.price)
    default: return out.sort((a, b) => score(b) - score(a))
  }
}
