import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../components/shop/ProductCard'
import { productById } from '../data/catalog'
import { useMeta } from '../lib/meta'
import { useStore } from '../state/store'

export default function Wishlist() {
  useMeta({ title: 'Wishlist', noindex: true })
  const { wishlist, addToCart } = useStore()
  const items = wishlist.map(productById).filter((p) => p != null)
  const addAll = () => items.forEach((p) => p.availability !== 'sold_out' && addToCart(p.id, p.colours[0].id))

  return (
    <div className="wrap pt-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="script text-[22px] text-moss">saved for later</p>
          <h1 className="display text-[clamp(48px,7vw,104px)]">Wishlist</h1>
        </div>
        {items.length > 1 && <button type="button" onClick={addAll} className="btn btn-primary">Add all to bag <ArrowRight size={18} className="arrow" /></button>}
      </div>
      <p className="mt-3 text-[14px] text-muted">Your wishlist is saved in this browser.</p>

      {items.length ? (
        <motion.div layout className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {items.map((p, i) => (
              <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                <ProductCard p={p} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="mt-8 grid place-items-center rounded-[36px] bg-ivory px-6 py-16 text-center ring-1 ring-line">
          <span className="grid size-20 place-items-center rounded-full bg-blush"><Heart size={34} /></span>
          <h2 className="display-md mt-5 text-[30px]">Nothing saved yet</h2>
          <p className="mt-2 max-w-sm text-muted">Tap the little heart on any object to keep it here for later.</p>
          <Link to="/shop" className="btn btn-primary mt-6">Explore the Collection <ArrowRight size={18} className="arrow" /></Link>
        </div>
      )}
    </div>
  )
}
