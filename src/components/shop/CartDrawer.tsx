import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, MessageCircle, ShoppingBag, Trash2, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { site } from '../../config/site'
import { productById } from '../../data/catalog'
import { formatINR } from '../../lib/format'
import { computeTotals } from '../../lib/pricing'
import { cartMessage, whatsappReady, waLink } from '../../lib/whatsapp'
import { useStore } from '../../state/store'
import type { CartLine } from '../../types'
import { Qty } from '../ui/Bits'
import { Img } from '../ui/Img'

export function LineItem({ l, compact = false, onNavigate }: { l: CartLine; compact?: boolean; onNavigate?: () => void }) {
  const { setQty, removeLine } = useStore()
  const p = productById(l.productId)
  if (!p) return null
  const colour = p.colours.find((c) => c.id === l.colourId)
  return (
    <motion.li layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30, height: 0, marginBottom: 0 }} transition={{ duration: 0.3 }} className="flex gap-4">
      <Link to={`/product/${p.slug}`} onClick={onNavigate} className="flex-none">
        <Img src={p.images[0].src} alt={p.images[0].alt} className={`${compact ? 'size-20' : 'size-24 sm:size-28'} rounded-[20px]`} w={240} sizes="112px" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to={`/product/${p.slug}`} onClick={onNavigate} className="block font-bold leading-tight hover:text-moss">{p.name}</Link>
            <p className="mt-1 flex items-center gap-1.5 text-[13px] text-muted">
              <span className="size-3 rounded-full ring-1 ring-ink/15" style={{ background: colour?.hex }} />{colour?.name}
            </p>
          </div>
          <p className="flex-none font-extrabold">{formatINR(p.price * l.qty)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <Qty size="sm" value={l.qty} onChange={(n) => setQty(l.key, n)} label={`Quantity of ${p.name}`} />
          <button type="button" onClick={() => removeLine(l.key)} className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[13px] font-semibold text-muted hover:bg-bg2 hover:text-ink" aria-label={`Remove ${p.name}`}>
            <Trash2 size={14} /> Remove
          </button>
        </div>
      </div>
    </motion.li>
  )
}

export function EmptyBag({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      <svg viewBox="0 0 160 120" className="w-44" aria-hidden="true">
        <ellipse cx="80" cy="108" rx="54" ry="7" fill="#E8DCC9" />
        <path d="M44 46h72l-6 58H50z" fill="#F2DF97" stroke="#26271F" strokeWidth="3" strokeLinejoin="round" />
        <path d="M62 46v-8a18 18 0 0 1 36 0v8" fill="none" stroke="#26271F" strokeWidth="3" strokeLinecap="round" />
        <circle cx="68" cy="70" r="3" fill="#26271F" /><circle cx="92" cy="70" r="3" fill="#26271F" />
        <path d="M72 84q8-6 16 0" fill="none" stroke="#26271F" strokeWidth="3" strokeLinecap="round" />
        <path d="M124 30l4-10 4 10 10 4-10 4-4 10-4-10-10-4z" fill="#F1C3C1" />
      </svg>
      <h3 className="display-md mt-4 text-[28px]">Your bag is feeling light</h3>
      <p className="mt-2 max-w-xs text-[15px] text-muted">Discover your next favourite object, from tiny planters to candle holders.</p>
      <Link to="/shop" onClick={onNavigate} className="btn btn-primary mt-6">Continue Shopping <ArrowRight size={17} className="arrow" /></Link>
    </div>
  )
}

export function CartDrawer() {
  const { cart, cartOpen: open, setCartOpen } = useStore()
  const t = computeTotals(cart)
  const close = () => setCartOpen(false)
  const closeBtn = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setCartOpen(false)
    addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = prev; removeEventListener('keydown', onKey) }
  }, [open, setCartOpen])

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Your bag">
          <motion.button type="button" aria-label="Close bag" onClick={close} className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 36 }}
            className="absolute bottom-0 right-0 top-0 flex w-full max-w-[460px] flex-col bg-ivory sm:bottom-3 sm:right-3 sm:top-3 sm:rounded-[30px]"
          >
            <div className="flex items-center justify-between px-6 pb-4 pt-5">
              <h2 className="display-md flex items-center gap-2.5 text-[28px]"><ShoppingBag size={22} /> Your bag <span className="rounded-full bg-butter px-2.5 py-0.5 font-sans text-[14px] font-extrabold">{t.count}</span></h2>
              <button ref={closeBtn} type="button" onClick={close} className="grid size-11 place-items-center rounded-full bg-bg hover:bg-bg2" aria-label="Close bag"><X size={20} /></button>
            </div>
            {cart.length === 0 ? (
              <EmptyBag onNavigate={close} />
            ) : (
              <>
                <ul className="flex-1 space-y-5 overflow-y-auto px-6 py-2">
                  <AnimatePresence initial={false}>
                    {cart.map((l) => <LineItem key={l.key} l={l} compact onNavigate={close} />)}
                  </AnimatePresence>
                </ul>
                <div className="border-t border-line px-6 pb-6 pt-4">
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold">Subtotal</span>
                    <motion.span key={t.subtotal} initial={{ scale: 1.15, color: '#5B6849' }} animate={{ scale: 1, color: '#26271F' }} className="text-[22px] font-extrabold">{formatINR(t.subtotal)}</motion.span>
                  </div>
                  <p className="mt-1 text-[13px] text-muted">
                    {t.shipping == null ? 'Shipping is confirmed at checkout once AAKAAR sets delivery rates.' : t.shipping === 0 ? 'Shipping is free on this order.' : `Shipping ${formatINR(t.shipping)}.`}
                  </p>
                  <div className="mt-4 grid gap-2.5">
                    <Link to="/checkout" onClick={close} className="btn btn-primary btn-block">Checkout <ArrowRight size={17} className="arrow" /></Link>
                    <div className="grid grid-cols-2 gap-2.5">
                      <Link to="/cart" onClick={close} className="btn btn-ghost btn-sm">View bag</Link>
                      <button type="button" onClick={close} className="btn btn-ghost btn-sm">Keep shopping</button>
                    </div>
                    {whatsappReady && (
                      <a href={waLink(cartMessage(cart, t.subtotal))} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
                        <MessageCircle size={16} /> Ask about this order on WhatsApp
                      </a>
                    )}
                  </div>
                  {site.demoInventory && <p className="mt-3 text-center text-[12px] text-muted">Sample catalogue: prices and stock are illustrative.</p>}
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
