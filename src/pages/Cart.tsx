import { AnimatePresence } from 'framer-motion'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyBag, LineItem } from '../components/shop/CartDrawer'
import { ProductCard } from '../components/shop/ProductCard'
import { site } from '../config/site'
import { products } from '../data/catalog'
import { formatINR } from '../lib/format'
import { useMeta } from '../lib/meta'
import { computeTotals } from '../lib/pricing'
import { cartMessage, whatsappReady, waLink } from '../lib/whatsapp'
import { useStore } from '../state/store'

export default function Cart() {
  useMeta({ title: 'Your bag', noindex: true })
  const { cart } = useStore()
  const t = computeTotals(cart)
  const inCart = new Set(cart.map((l) => l.productId))
  const suggestions = products.filter((p) => !inCart.has(p.id) && (p.bestseller || p.isNew)).slice(0, 4)

  return (
    <div className="wrap pt-4">
      <h1 className="display text-[clamp(48px,7vw,104px)]">Your <span className="text-moss">bag.</span></h1>
      {cart.length === 0 ? (
        <div className="mt-8 rounded-[36px] bg-ivory ring-1 ring-line"><EmptyBag /></div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-12">
          <ul className="space-y-6 rounded-[32px] bg-ivory p-5 ring-1 ring-line sm:p-8">
            <AnimatePresence initial={false}>
              {cart.map((l) => <LineItem key={l.key} l={l} />)}
            </AnimatePresence>
          </ul>
          <aside className="h-max rounded-[32px] bg-ivory p-6 ring-1 ring-line sm:p-8 lg:sticky lg:top-28" aria-labelledby="summary">
            <h2 id="summary" className="display-md text-[28px]">Order summary</h2>
            <dl className="mt-5 grid gap-3 text-[15px]">
              <div className="flex justify-between"><dt>Items</dt><dd className="font-bold">{t.count}</dd></div>
              <div className="flex justify-between"><dt>Subtotal</dt><dd className="font-bold">{formatINR(t.subtotal)}</dd></div>
              <div className="flex justify-between gap-6"><dt>Shipping</dt><dd className="text-right font-bold">{t.shipping == null ? <span className="font-semibold text-muted">Confirmed before dispatch</span> : t.shipping === 0 ? 'Free' : formatINR(t.shipping)}</dd></div>
              <div className="mt-2 flex items-baseline justify-between border-t border-line pt-4"><dt className="text-[17px] font-bold">Total</dt><dd className="text-[26px] font-extrabold">{formatINR(t.total)}</dd></div>
            </dl>
            <Link to="/checkout" className="btn btn-primary btn-block mt-6">Checkout <ArrowRight size={18} className="arrow" /></Link>
            <Link to="/shop" className="btn btn-ghost btn-block mt-3">Continue Shopping</Link>
            {whatsappReady && (
              <a href={waLink(cartMessage(cart, t.subtotal))} target="_blank" rel="noreferrer" className="btn btn-ghost btn-block mt-3"><MessageCircle size={17} /> Send this bag on WhatsApp</a>
            )}
            {whatsappReady && <p className="mt-2 text-[12.5px] text-muted">WhatsApp opens a message with your bag. Your order is confirmed only when AAKAAR replies.</p>}
            {site.demoInventory && <p className="mt-4 text-[12.5px] text-muted">Sample catalogue: prices and stock are illustrative.</p>}
          </aside>
        </div>
      )}

      {suggestions.length > 0 && (
        <section aria-labelledby="add-more" className="pt-20">
          <h2 id="add-more" className="display mb-8 text-[clamp(34px,4vw,56px)]">Something to go <span className="text-moss">with it?</span></h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
            {suggestions.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  )
}
