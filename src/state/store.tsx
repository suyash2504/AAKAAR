import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { productById } from '../data/catalog'
import { load, save } from '../lib/storage'
import type { CartLine } from '../types'

export interface Toast {
  id: number
  text: string
  tone: 'ok' | 'info'
  action?: { label: string; run: () => void }
}

interface Store {
  cart: CartLine[]
  addToCart: (productId: string, colourId: string, qty?: number) => void
  setQty: (key: string, qty: number) => void
  removeLine: (key: string) => void
  clearCart: () => void
  cartOpen: boolean
  setCartOpen: (o: boolean) => void
  wishlist: string[]
  toggleWish: (productId: string) => void
  recent: string[]
  markViewed: (productId: string) => void
  searchOpen: boolean
  setSearchOpen: (o: boolean) => void
  toasts: Toast[]
  notify: (text: string, tone?: Toast['tone'], action?: Toast['action']) => void
  dismiss: (id: number) => void
}

const Ctx = createContext<Store | null>(null)
const MAX = 10
const keyOf = (productId: string, colourId: string) => `${productId}|${colourId}`

// Guest cart and wishlist persist in localStorage. Nothing payment-related is ever stored.
export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>(() => load<CartLine[]>('aak-cart', []).filter((l) => productById(l.productId)))
  const [wishlist, setWishlist] = useState<string[]>(() => load<string[]>('aak-wishlist', []).filter((id) => productById(id)))
  const [recent, setRecent] = useState<string[]>(() => load<string[]>('aak-recent', []).filter((id) => productById(id)))
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastId = useRef(0)

  useEffect(() => save('aak-cart', cart), [cart])
  useEffect(() => save('aak-wishlist', wishlist), [wishlist])
  useEffect(() => save('aak-recent', recent), [recent])

  // keep other tabs in sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'aak-cart') setCart(load('aak-cart', []))
      if (e.key === 'aak-wishlist') setWishlist(load('aak-wishlist', []))
    }
    addEventListener('storage', onStorage)
    return () => removeEventListener('storage', onStorage)
  }, [])

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), [])
  const notify = useCallback<Store['notify']>((text, tone = 'ok', action) => {
    const id = ++toastId.current
    setToasts((t) => [...t.slice(-2), { id, text, tone, action }])
    setTimeout(() => dismiss(id), action ? 5200 : 3200)
  }, [dismiss])

  const addToCart = useCallback<Store['addToCart']>((productId, colourId, qty = 1) => {
    const p = productById(productId)
    if (!p || p.availability === 'sold_out') return
    const key = keyOf(productId, colourId)
    setCart((c) => {
      const hit = c.find((x) => x.key === key)
      if (hit) return c.map((x) => (x.key === key ? { ...x, qty: Math.min(MAX, x.qty + qty) } : x))
      return [...c, { key, productId, colourId, qty: Math.min(MAX, qty) }]
    })
    notify(`${p.name} added to your bag`, 'ok', { label: 'View bag', run: () => setCartOpen(true) })
  }, [notify])

  const setQty = useCallback((key: string, qty: number) => {
    setCart((c) => (qty <= 0 ? c.filter((x) => x.key !== key) : c.map((x) => (x.key === key ? { ...x, qty: Math.min(MAX, qty) } : x))))
  }, [])

  const cartRef = useRef(cart)
  cartRef.current = cart
  const wishlistRef = useRef(wishlist)
  wishlistRef.current = wishlist

  const removeLine = useCallback((key: string) => {
    const index = cartRef.current.findIndex((x) => x.key === key)
    if (index < 0) return
    const line = cartRef.current[index]
    setCart((c) => c.filter((x) => x.key !== key))
    // offer an undo so a mis-tap never loses the item
    notify(`${productById(line.productId)?.name ?? 'Item'} removed from your bag`, 'info', {
      label: 'Undo',
      run: () => setCart((c) => (c.some((x) => x.key === line.key) ? c : [...c.slice(0, index), line, ...c.slice(index)])),
    })
  }, [notify])

  const toggleWish = useCallback((id: string) => {
    const name = productById(id)?.name
    const had = wishlistRef.current.includes(id)
    setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [id, ...w]))
    notify(had ? `${name} removed from your wishlist` : `${name} saved to your wishlist`, had ? 'info' : 'ok')
  }, [notify])

  const markViewed = useCallback((id: string) => setRecent((r) => [id, ...r.filter((x) => x !== id)].slice(0, 8)), [])

  const value = useMemo<Store>(() => ({
    cart, addToCart, setQty, removeLine, clearCart: () => setCart([]),
    cartOpen, setCartOpen, wishlist, toggleWish, recent, markViewed,
    searchOpen, setSearchOpen, toasts, notify, dismiss,
  }), [cart, addToCart, setQty, removeLine, cartOpen, wishlist, toggleWish, recent, markViewed, searchOpen, toasts, notify, dismiss])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const s = useContext(Ctx)
  if (!s) throw new Error('useStore outside StoreProvider')
  return s
}
