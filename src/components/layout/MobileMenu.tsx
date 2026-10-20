import { AnimatePresence, motion } from 'framer-motion'
import { Heart, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { collections } from '../../data/catalog'
import { useStore } from '../../state/store'
import { Meaning } from '../ui/Bits'
import { Logo } from './Logo'

const main = [
  { to: '/shop', label: 'Shop all' },
  { to: '/our-story', label: 'Our Story' },
  { to: '/custom-orders', label: 'Custom Orders' },
  { to: '/contact', label: 'Contact' },
  { to: '/account', label: 'Profile' },
]

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { wishlist } = useStore()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = prev; removeEventListener('keydown', onKey) }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          initial={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
          animate={{ clipPath: 'circle(150% at calc(100% - 40px) 40px)' }}
          exit={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[90] flex flex-col overflow-y-auto bg-moss text-ivory"
        >
          <div className="wrap flex h-[72px] flex-none items-center justify-between">
            <Logo light onClick={onClose} />
            <button ref={closeRef} type="button" onClick={onClose} aria-label="Close menu" className="grid size-12 place-items-center rounded-full bg-ivory/10 hover:bg-ivory/20"><X size={22} /></button>
          </div>
          <nav aria-label="Mobile" className="wrap flex flex-1 flex-col pb-8 pt-4">
            <ul className="grid gap-1">
              {main.map((l, i) => (
                <motion.li key={l.to} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                  <Link to={l.to} onClick={onClose} className="display block py-1.5 text-[clamp(44px,13vw,64px)] hover:text-butter">{l.label}</Link>
                </motion.li>
              ))}
            </ul>
            <p className="eyebrow mb-3 mt-8 text-butter">Collections</p>
            <div className="flex flex-wrap gap-2">
              {collections.map((c) => (
                <Link key={c.slug} to={`/collections/${c.slug}`} onClick={onClose} className="rounded-full bg-ivory/10 px-4 py-2.5 text-[15px] font-semibold hover:bg-ivory/20">{c.name}</Link>
              ))}
            </div>
            <div className="mt-auto grid gap-5 pt-10">
              <Link to="/wishlist" onClick={onClose} className="btn btn-butter w-full justify-between whitespace-nowrap" aria-label={`Wishlist, ${wishlist.length} saved`}>
                <span className="inline-flex items-center gap-2"><Heart size={18} /> Wishlist</span>
                <span className="grid h-7 min-w-7 place-items-center rounded-full bg-ink px-2 text-[13px] font-extrabold text-ivory">{wishlist.length}</span>
              </Link>
              <Meaning className="text-[20px] text-ivory/80" />
            </div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
