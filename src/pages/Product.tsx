import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, ChevronRight, Heart, Maximize2, MessageCircle, ShoppingBag, Truck, X, Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ProductCard } from '../components/shop/ProductCard'
import { Accordion } from '../components/ui/Accordion'
import { Qty } from '../components/ui/Bits'
import { Img } from '../components/ui/Img'
import { site } from '../config/site'
import { kindLabel, productById, productBySlug, products, spaceName } from '../data/catalog'
import { availabilityLabel, formatINR } from '../lib/format'
import { photoUrl } from '../lib/images'
import { useMeta } from '../lib/meta'
import { razorpayLive } from '../lib/payments'
import { whatsappReady, waLink } from '../lib/whatsapp'
import { useStore } from '../state/store'
import type { Photo } from '../types'
import NotFound from './NotFound'

function Lightbox({ images, start, onClose }: { images: Photo[]; start: number; onClose: () => void }) {
  const [i, setI] = useState(start)
  const close = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    close.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setI((x) => (x + 1) % images.length)
      if (e.key === 'ArrowLeft') setI((x) => (x - 1 + images.length) % images.length)
    }
    addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = prev; removeEventListener('keydown', onKey) }
  }, [images.length, onClose])
  return createPortal(
    <motion.div role="dialog" aria-modal="true" aria-label="Enlarged product photos" className="fixed inset-0 z-[95] flex flex-col bg-ink/95 text-ivory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between p-4">
        <p className="text-[14px] font-semibold">{i + 1} / {images.length}</p>
        <button ref={close} type="button" onClick={onClose} aria-label="Close enlarged view" className="grid size-12 place-items-center rounded-full bg-ivory/10 hover:bg-ivory/20"><X size={22} /></button>
      </div>
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-6">
        <AnimatePresence mode="wait">
          <motion.img key={i} src={photoUrl(images[i].src, 1800)} alt={images[i].alt} className="max-h-full max-w-full rounded-[24px] object-contain" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} />
        </AnimatePresence>
        {images.length > 1 && (
          <>
            <button type="button" onClick={() => setI((x) => (x - 1 + images.length) % images.length)} aria-label="Previous photo" className="absolute left-4 grid size-12 place-items-center rounded-full bg-ivory text-ink"><ArrowLeft size={20} /></button>
            <button type="button" onClick={() => setI((x) => (x + 1) % images.length)} aria-label="Next photo" className="absolute right-4 grid size-12 place-items-center rounded-full bg-ivory text-ink"><ArrowRight size={20} /></button>
          </>
        )}
      </div>
    </motion.div>,
    document.body,
  )
}

/** Main photo with a hover lens on fine pointers. */
function ZoomPhoto({ img, onOpen }: { img: Photo; onOpen: () => void }) {
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null)
  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseMove={(e) => {
        if (!matchMedia('(pointer: fine)').matches) return
        const r = e.currentTarget.getBoundingClientRect()
        setLens({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
      }}
      onMouseLeave={() => setLens(null)}
      className="group relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-[32px] bg-bg2"
      aria-label="Open enlarged photo"
    >
      <AnimatePresence mode="wait">
        <motion.div key={img.src} className="absolute inset-0" initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
          <Img src={img.src} alt={img.alt} className="absolute inset-0" sizes="(max-width: 1024px) 100vw, 50vw" w={1400} eager />
        </motion.div>
      </AnimatePresence>
      {lens && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden bg-no-repeat md:block"
          style={{ backgroundImage: `url(${photoUrl(img.src, 2000)})`, backgroundSize: '200%', backgroundPosition: `${lens.x}% ${lens.y}%` }}
        />
      )}
      <span className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-ivory/90 px-3.5 py-2 text-[13px] font-bold backdrop-blur"><Maximize2 size={15} /> Enlarge</span>
    </button>
  )
}

export default function Product() {
  const { slug = '' } = useParams()
  const p = productBySlug(slug)
  const { addToCart, wishlist, toggleWish, markViewed, recent, setCartOpen } = useStore()
  const nav = useNavigate()
  const [img, setImg] = useState(0)
  const [colour, setColour] = useState(p?.colours[0].id ?? '')
  const [qty, setQty] = useState(1)
  const [box, setBox] = useState<number | null>(null)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!p) return
    markViewed(p.id)
    setImg(0); setColour(p.colours[0].id); setQty(1)
  }, [p, markViewed])

  useMeta({
    title: p ? `${p.name} — ${p.short}` : 'Product not found',
    description: p ? `${p.name}: ${p.description} ${p.materialLabel}, ${formatINR(p.price)}.` : undefined,
    image: p ? photoUrl(p.images[0].src, 1200) : undefined,
    path: p ? `/product/${p.slug}` : undefined,
    // structured data only once the catalogue is real
    jsonLd: p && !site.demoInventory ? {
      '@context': 'https://schema.org', '@type': 'Product', name: p.name, sku: p.sku, description: p.description,
      image: p.images.map((i) => photoUrl(i.src, 1200)), brand: { '@type': 'Brand', name: site.fullName }, material: p.materialLabel,
      offers: { '@type': 'Offer', priceCurrency: 'INR', price: p.price, url: `${site.url}/product/${p.slug}`, availability: p.availability === 'sold_out' ? 'https://schema.org/OutOfStock' : p.availability === 'made_to_order' ? 'https://schema.org/PreOrder' : 'https://schema.org/InStock' },
    } : undefined,
  })

  if (!p) return <NotFound />

  const saved = wishlist.includes(p.id)
  const soldOut = p.availability === 'sold_out'
  const chosen = p.colours.find((c) => c.id === colour) ?? p.colours[0]
  const related = products.filter((x) => x.id !== p.id && (x.kind === p.kind || x.material === p.material)).slice(0, 4)
  const recents = recent.filter((id) => id !== p.id).map(productById).filter(Boolean).slice(0, 4)

  const add = () => {
    addToCart(p.id, chosen.id, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }
  const buyNow = () => { addToCart(p.id, chosen.id, qty); setCartOpen(false); nav('/checkout') }

  return (
    <div className="pb-6">
      <div className="wrap pt-4">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-[13px] font-semibold text-muted">
          <Link to="/" className="hover:text-ink">Home</Link><ChevronRight size={14} />
          <Link to="/shop" className="hover:text-ink">Shop</Link><ChevronRight size={14} />
          <Link to={`/shop?kind=${p.kind}`} className="hover:text-ink">{kindLabel[p.kind]}</Link><ChevronRight size={14} />
          <span className="text-ink" aria-current="page">{p.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
          {/* gallery */}
          <div className="grid gap-3 md:grid-cols-[84px_minmax(0,1fr)] lg:sticky lg:top-24 lg:h-max">
            <div className="no-scrollbar order-2 flex gap-2.5 overflow-x-auto md:order-1 md:flex-col" role="list" aria-label="Product photos">
              {p.images.map((im, i) => (
                <button key={im.src} type="button" role="listitem" onClick={() => setImg(i)} aria-label={`Show photo ${i + 1}`} aria-current={img === i} className={`flex-none overflow-hidden rounded-[18px] ring-2 transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 ${img === i ? 'ring-moss' : 'ring-transparent'}`}>
                  <Img src={im.src} alt="" className="size-20 md:size-[84px]" w={200} sizes="84px" />
                </button>
              ))}
            </div>
            <div className="order-1 md:order-2"><ZoomPhoto img={p.images[img]} onOpen={() => setBox(img)} /></div>
          </div>

          {/* buy box */}
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2">
              {p.limited && <span className="rounded-full bg-blush px-3 py-1.5 text-[11.5px] font-extrabold uppercase tracking-[0.08em]">Limited edition</span>}
              {p.isNew && <span className="rounded-full bg-sage px-3 py-1.5 text-[11.5px] font-extrabold uppercase tracking-[0.08em]">New</span>}
              {p.bestseller && <span className="rounded-full bg-butter px-3 py-1.5 text-[11.5px] font-extrabold uppercase tracking-[0.08em]">Bestseller</span>}
            </div>
            <h1 className="display mt-4 text-[clamp(44px,5.4vw,84px)]">{p.name}</h1>
            <p className="mt-2 text-[17px] font-semibold text-muted">{p.short}{p.setOf ? ` · set of ${p.setOf}` : ''}</p>
            <div className="mt-5 flex items-baseline gap-3">
              <p className="text-[32px] font-extrabold">{formatINR(p.price)}</p>
              {p.compareAt && <s className="text-[18px] text-muted">{formatINR(p.compareAt)}</s>}
            </div>
            <p className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[13.5px] font-bold ${p.availability === 'in_stock' ? 'bg-sage/70' : p.availability === 'sold_out' ? 'bg-bg2 text-muted' : 'bg-butter/70'}`}>
              <span className={`size-2 rounded-full ${p.availability === 'in_stock' ? 'bg-moss' : p.availability === 'sold_out' ? 'bg-muted' : 'bg-[#B9822E]'}`} />
              {availabilityLabel[p.availability]}{site.demoInventory ? ' (sample)' : ''}
            </p>

            <p className="mt-6 text-[16.5px] leading-relaxed text-ink/80">{p.description}</p>

            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 rounded-[24px] bg-ivory p-5 text-[14.5px] ring-1 ring-line">
              <div><dt className="text-muted">Material</dt><dd className="mt-0.5 font-bold">{p.materialLabel}</dd></div>
              <div><dt className="text-muted">Finish</dt><dd className="mt-0.5 font-bold">{p.finish}</dd></div>
              <div><dt className="text-muted">Dimensions</dt><dd className="mt-0.5 font-bold">{p.dimensions}</dd></div>
              {p.weight && <div><dt className="text-muted">Weight</dt><dd className="mt-0.5 font-bold">{p.weight}</dd></div>}
              <div className="col-span-2"><dt className="text-muted">Good for</dt><dd className="mt-0.5 font-bold">{p.spaces.map(spaceName).join(', ')}</dd></div>
            </dl>

            {/* colour */}
            <fieldset className="mt-6">
              <legend className="mb-3 text-[14.5px] font-bold">Colour: <span className="font-semibold text-muted">{chosen.name}</span></legend>
              <div className="flex flex-wrap gap-2.5">
                {p.colours.map((c) => (
                  <label key={c.id} className="cursor-pointer">
                    <input type="radio" name="colour" value={c.id} checked={colour === c.id} onChange={() => setColour(c.id)} className="peer sr-only" />
                    <span className="flex items-center gap-2 rounded-full bg-ivory py-1.5 pl-1.5 pr-3.5 text-[13.5px] font-bold ring-1 ring-line transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 peer-checked:ring-2 peer-checked:ring-moss peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-moss">
                      <span className="size-7 rounded-full ring-1 ring-ink/15" style={{ background: c.hex }} />{c.name}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Qty value={qty} onChange={setQty} label="Quantity" />
              <button type="button" onClick={add} disabled={soldOut} className="btn btn-primary min-w-[200px] flex-1">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={String(added)} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.2 }} className="flex items-center gap-2">
                    {soldOut ? 'Sold out' : added ? <><Check size={18} /> Added to bag</> : <><ShoppingBag size={18} /> Add to Bag · {formatINR(p.price * qty)}</>}
                  </motion.span>
                </AnimatePresence>
              </button>
              <motion.button type="button" whileTap={{ scale: 0.85 }} onClick={() => toggleWish(p.id)} aria-pressed={saved} aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'} className="grid size-[52px] place-items-center rounded-full border-2 border-ink bg-ivory shadow-[4px_4px_0_var(--color-ink)] transition-[transform,box-shadow] duration-300 ease-[var(--ease-spring)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-ink)] active:translate-x-1 active:translate-y-1 active:shadow-none">
                <Heart size={20} className={saved ? 'fill-rose stroke-rose' : ''} />
              </motion.button>
            </div>
            {razorpayLive && !soldOut && (
              <button type="button" onClick={buyNow} className="btn btn-butter btn-block mt-3"><Zap size={17} /> Buy Now</button>
            )}
            {whatsappReady && (
              <a href={waLink(`Hi AAKAAR, I have a question about ${p.name} (${chosen.name}, ${p.sku}).`)} target="_blank" rel="noreferrer" className="btn btn-ghost btn-block mt-3"><MessageCircle size={17} /> Ask on WhatsApp</a>
            )}

            <p className="mt-5 flex items-start gap-2.5 text-[14px] text-muted"><Truck size={18} className="mt-0.5 flex-none text-moss" />{site.shipping.dispatch} {p.availability === 'made_to_order' && 'Made-to-order pieces take longer; we confirm the timeline before dispatch.'}</p>

            <div className="mt-8">
              <Accordion
                defaultOpen={0}
                items={[
                  { q: 'Details', a: <ul className="grid gap-1.5"><li>SKU: {p.sku}</li><li>Material: {p.materialLabel}</li><li>Finish: {p.finish}</li><li>Dimensions: {p.dimensions}</li>{p.weight && <li>Weight: {p.weight}</li>}{p.setOf && <li>Set of {p.setOf}</li>}<li>Colours: {p.colours.map((c) => c.name).join(', ')}</li></ul> },
                  { q: 'Care', a: <ul className="list-disc space-y-1.5 pl-5">{p.care.map((c) => <li key={c}>{c}</li>)}</ul> },
                  { q: 'Shipping & returns', a: <p>{site.shipping.dispatch} Delivery charges are shown at checkout once confirmed. See our <Link to="/shipping-returns" className="font-bold text-moss underline underline-offset-4">shipping &amp; returns policy</Link>.</p> },
                ]}
              />
            </div>
            {site.demoInventory && <p className="mt-5 text-[12.5px] text-muted">Sample product: photo is a stand-in and the price, size and stock are illustrative until AAKAAR confirms them.</p>}
          </div>
        </div>
      </div>

      <section aria-labelledby="related" className="wrap pt-24">
        <h2 id="related" className="display mb-8 text-[clamp(36px,4.4vw,64px)]">You may also <span className="text-moss">love.</span></h2>
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
          {related.map((r, i) => <ProductCard key={r.id} p={r} index={i} />)}
        </div>
      </section>

      {recents.length > 0 && (
        <section aria-labelledby="recent" className="wrap pt-20">
          <h2 id="recent" className="display-md mb-6 text-[32px]">Recently viewed</h2>
          <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4">
            {recents.map((r) => r && (
              <Link key={r.id} to={`/product/${r.slug}`} className="group w-40 flex-none sm:w-48">
                <Img src={r.images[0].src} alt={r.images[0].alt} className="aspect-square rounded-[22px]" imgClassName="transition-transform duration-700 group-hover:scale-105" sizes="200px" w={400} />
                <p className="mt-2 font-bold leading-tight">{r.name}</p>
                <p className="text-[13.5px] text-muted">{formatINR(r.price)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <AnimatePresence>{box != null && <Lightbox images={p.images} start={box} onClose={() => setBox(null)} />}</AnimatePresence>
    </div>
  )
}
