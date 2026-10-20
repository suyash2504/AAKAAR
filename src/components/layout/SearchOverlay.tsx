import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Search, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import { collections, products } from '../../data/catalog'
import { matchesQuery } from '../../lib/filter'
import { formatINR } from '../../lib/format'
import { useStore } from '../../state/store'
import { Img } from '../ui/Img'

const suggestions = ['planter', 'candle', 'resin', 'tray', 'pastel', 'gift']

export function SearchOverlay() {
  const { searchOpen: open, setSearchOpen } = useStore()
  const [q, setQ] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const nav = useNavigate()
  const close = () => setSearchOpen(false)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    setTimeout(() => input.current?.focus(), 60)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSearchOpen(false)
    addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = prev; removeEventListener('keydown', onKey) }
  }, [open, setSearchOpen])

  const results = useMemo(() => (q.trim() ? products.filter((p) => matchesQuery(p, q)).slice(0, 6) : []), [q])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!q.trim()) return
    close()
    nav(`/shop?q=${encodeURIComponent(q.trim())}`)
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[85]" role="dialog" aria-modal="true" aria-label="Search the shop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" aria-label="Close search" onClick={close} className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative mx-auto mt-3 w-[min(860px,calc(100%-24px))] rounded-[30px] bg-ivory p-4 shadow-2xl sm:mt-10 sm:p-6"
          >
            <form onSubmit={submit} className="flex items-center gap-3 rounded-full bg-bg px-5 ring-1 ring-line focus-within:ring-2 focus-within:ring-moss" role="search">
              <Search size={20} className="flex-none text-muted" />
              <label htmlFor="site-search" className="sr-only">Search products</label>
              <input id="site-search" ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search planters, candle holders, resin…" className="h-14 min-w-0 flex-1 bg-transparent text-[17px] font-semibold outline-none placeholder:text-muted/70" autoComplete="off" />
              <button type="button" onClick={close} className="grid size-9 flex-none place-items-center rounded-full hover:bg-bg2" aria-label="Close search"><X size={18} /></button>
            </form>

            {!q.trim() ? (
              <div className="mt-5">
                <p className="eyebrow mb-3 text-moss">Try</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button key={s} type="button" onClick={() => setQ(s)} className="rounded-full bg-bg px-4 py-2 text-[14px] font-semibold hover:bg-butter">{s}</button>
                  ))}
                </div>
                <p className="eyebrow mb-3 mt-6 text-moss">Collections</p>
                <div className="flex flex-wrap gap-2">
                  {collections.map((c) => (
                    <Link key={c.slug} to={`/collections/${c.slug}`} onClick={close} className="rounded-full bg-bg2 px-4 py-2 text-[14px] font-semibold hover:bg-sage">{c.name}</Link>
                  ))}
                </div>
              </div>
            ) : results.length ? (
              <div className="mt-4">
                <ul className="grid gap-1 sm:grid-cols-2">
                  {results.map((p) => (
                    <li key={p.id}>
                      <Link to={`/product/${p.slug}`} onClick={close} className="flex items-center gap-3 rounded-2xl p-2 hover:bg-bg">
                        <Img src={p.images[0].src} alt="" className="size-16 flex-none rounded-2xl" w={200} sizes="64px" />
                        <span className="min-w-0">
                          <span className="block truncate font-bold">{p.name}</span>
                          <span className="block text-[13px] text-muted">{p.short} · {formatINR(p.price)}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={submit} className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-2 text-[14px] font-bold text-moss hover:bg-bg">
                  See all results for “{q.trim()}” <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <p className="mt-6 px-2 pb-2 text-[15px] text-muted">Nothing matches “{q.trim()}” yet. Try “planter” or “candle”, or <Link to="/custom-orders" onClick={close} className="font-bold text-moss underline underline-offset-4">ask for a custom piece</Link>.</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
