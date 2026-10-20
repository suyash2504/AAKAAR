import { AnimatePresence, motion } from 'framer-motion'
import { Check, Heart, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { availabilityLabel, formatINR } from '../../lib/format'
import { useStore } from '../../state/store'
import type { Product } from '../../types'
import { Img } from '../ui/Img'

const tints = ['bg-blush/60', 'bg-butter/60', 'bg-sage/70', 'bg-bg2']

export function ProductCard({ p, index = 0, sizes = '(max-width: 768px) 50vw, 25vw' }: { p: Product; index?: number; sizes?: string }) {
  const { addToCart, wishlist, toggleWish } = useStore()
  const saved = wishlist.includes(p.id)
  const [added, setAdded] = useState(false)
  const soldOut = p.availability === 'sold_out'
  const badge = p.limited ? 'Limited' : p.isNew ? 'New' : p.bestseller ? 'Bestseller' : null

  const quickAdd = () => {
    addToCart(p.id, p.colours[0].id)
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <article className="group relative flex flex-col gap-3">
      <div className={`relative aspect-[4/5] overflow-hidden rounded-[26px] ${tints[index % tints.length]} transition-[transform,box-shadow] duration-500 ease-[var(--ease-spring)] group-hover:-translate-y-1.5 group-hover:shadow-[0_24px_40px_-26px_rgba(40,40,20,.55)]`}>
        <Link to={`/product/${p.slug}`} className="absolute inset-0" aria-label={`${p.name}, ${formatINR(p.price)}`}>
          <Img src={p.images[0].src} alt={p.images[0].alt} className="absolute inset-0" imgClassName="transition-transform duration-[1.1s] ease-[var(--ease-out)] group-hover:scale-[1.06]" sizes={sizes} />
          {p.images[1] && (
            <Img src={p.images[1].src} alt="" className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 max-md:hidden" sizes={sizes} />
          )}
        </Link>
        {badge && (
          <span className={`pointer-events-none absolute left-3 top-3 rounded-full px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.08em] ${badge === 'Limited' ? 'bg-blush' : badge === 'New' ? 'bg-sage' : 'bg-butter'}`}>{badge}</span>
        )}
        <motion.button
          type="button"
          whileTap={{ scale: 0.85 }}
          onClick={() => toggleWish(p.id)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`}
          className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-ivory/90 backdrop-blur transition-transform duration-300 hover:scale-110"
        >
          <motion.span key={String(saved)} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
            <Heart size={18} className={saved ? 'fill-rose stroke-rose' : ''} />
          </motion.span>
        </motion.button>
        <button
          type="button"
          onClick={quickAdd}
          disabled={soldOut}
          aria-label={soldOut ? `${p.name} is sold out` : `Quick add ${p.name} to bag`}
          className="absolute bottom-3 right-3 flex h-11 items-center gap-2 overflow-hidden rounded-full border-2 border-ink bg-moss pl-3 pr-3.5 text-[13.5px] font-bold text-ivory shadow-[3px_3px_0_var(--color-ink)] transition-[transform,background-color,box-shadow] duration-300 ease-[var(--ease-spring)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--color-ink)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:bg-muted md:translate-y-16 md:group-hover:translate-y-0 md:group-focus-within:translate-y-0"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={String(added)} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.22 }} className="flex items-center gap-1.5">
              {soldOut ? 'Sold out' : added ? <><Check size={16} /> Added</> : <><Plus size={16} /> Add</>}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
      <div className="flex items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          <h3 className="text-[16.5px] font-bold leading-tight">
            <Link to={`/product/${p.slug}`} className="hover:text-moss">{p.name}</Link>
          </h3>
          <p className="mt-1 text-[13.5px] text-muted">{p.materialLabel}{p.setOf ? ` · set of ${p.setOf}` : ''}</p>
          <p className={`mt-1 text-[12.5px] font-semibold ${p.availability === 'in_stock' ? 'text-moss' : p.availability === 'sold_out' ? 'text-muted' : 'text-[#9A5B2E]'}`}>{availabilityLabel[p.availability]}</p>
        </div>
        <p className="flex-none text-right text-[16.5px] font-extrabold">
          {formatINR(p.price)}
          {p.compareAt && <s className="block text-[12.5px] font-medium text-muted">{formatINR(p.compareAt)}</s>}
        </p>
      </div>
    </article>
  )
}
