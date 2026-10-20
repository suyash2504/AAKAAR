import { AnimatePresence, LayoutGroup, motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Camera, Sparkles } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../../config/site'
import { collections, kindLabel, productBySlug, products, spaces } from '../../data/catalog'
import { formatINR } from '../../lib/format'
import type { Kind } from '../../types'
import { ProductCard } from '../shop/ProductCard'
import { Meaning, RingBadge, SectionHead } from '../ui/Bits'
import { Img } from '../ui/Img'
import { InkTitle } from '../ui/InkTitle'
import { Reveal, WordsUp } from '../ui/Reveal'

/* ---------- B. Find Your Form (photo strips) ---------- */
// Tall photo strips; the one you point at (or tap) opens wide with its details.
// On touch screens the first tap opens a strip and the second tap follows the link.
export function FindYourForm() {
  const [open, setOpen] = useState(2)
  return (
    <section id="find-your-form" aria-labelledby="fyf" className="wrap pt-20 md:pt-28">
      <SectionHead eyebrow="Collections" title={<InkTitle id="fyf" text="Find your" accent="form." />} note="five little worlds to wander through ✿" />
      <Reveal className="flex h-[640px] flex-col gap-2.5 lg:h-[480px] lg:flex-row">
        {collections.map((c, i) => {
          const isOpen = open === i
          const count = products.filter(c.match).length
          return (
            <Link
              key={c.slug}
              to={`/collections/${c.slug}`}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(i)}
              onFocus={() => setOpen(i)}
              onClick={(e) => { if (!isOpen) { e.preventDefault(); setOpen(i) } }}
              aria-label={`${c.name}, ${count} objects`}
              className="group relative min-h-0 min-w-0 overflow-hidden rounded-[28px] transition-[flex-grow] duration-700 ease-[var(--ease-out)]"
              style={{ flexGrow: isOpen ? 3.6 : 1, flexBasis: 0, background: c.tint }}
            >
              <Img src={c.image.src} alt={c.image.alt} className="absolute inset-0" imgClassName="transition-transform duration-[1.2s] group-hover:scale-[1.05]" sizes="(max-width: 1024px) 100vw, 50vw" w={1100} />
              {/* collapsed: name on a pill, sideways on desktop */}
              <span
                aria-hidden="true"
                className={`display-md absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-ivory/92 px-4 py-2.5 text-[16px] backdrop-blur transition-opacity duration-300 lg:top-auto lg:bottom-6 lg:translate-y-0 lg:rotate-180 lg:px-2.5 lg:py-4 lg:[writing-mode:vertical-rl] ${isOpen ? 'opacity-0' : 'opacity-100'}`}
              >
                {c.name}
              </span>
              {/* open: details card */}
              <span
                className={`absolute inset-x-3 bottom-3 rounded-[22px] bg-ivory/95 p-4 backdrop-blur transition-[opacity,transform] duration-500 ease-[var(--ease-spring)] sm:inset-x-4 sm:bottom-4 sm:p-5 ${isOpen ? 'translate-y-0 opacity-100 delay-200' : 'pointer-events-none translate-y-3 opacity-0'}`}
              >
                <span className="eyebrow block text-[10.5px] text-moss">{c.label}</span>
                <span className="mt-1.5 flex items-baseline justify-between gap-3">
                  <span className="display-md text-[clamp(24px,2.4vw,32px)]">{c.name}</span>
                  <span className="flex-none text-[13px] font-semibold text-muted">{count} objects</span>
                </span>
                <span className="mt-1.5 hidden text-[14px] leading-relaxed text-muted sm:block">{c.blurb}</span>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-bold text-moss">Shop {c.name.split(' ')[0].toLowerCase()} <ArrowUpRight size={16} className="transition-transform duration-500 ease-[var(--ease-spring)] group-hover:rotate-45" /></span>
              </span>
            </Link>
          )
        })}
      </Reveal>
    </section>
  )
}

/* ---------- C. Objects Worth Keeping ---------- */
const tabs: ('all' | Kind)[] = ['all', 'planters', 'candle-holders', 'trays-bowls', 'decor']

export function Bestsellers() {
  const [tab, setTab] = useState<'all' | Kind>('all')
  const pool = products.filter((p) => p.bestseller || p.featured)
  const list = (tab === 'all' ? pool : products.filter((p) => p.kind === tab)).slice(0, 8)
  return (
    <section aria-labelledby="owk" className="wrap pt-24 md:pt-32">
      <SectionHead eyebrow="Bestsellers" title={<InkTitle id="owk" text="Objects worth" accent="keeping." />} note="the ones everyone asks about" />
      <LayoutGroup>
        <div role="tablist" aria-label="Filter bestsellers" className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4">
          {tabs.map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} type="button" onClick={() => setTab(t)} className="relative flex-none rounded-full px-4 py-2.5 text-[14px] font-bold">
              {tab === t && <motion.span layoutId="best-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
              <span className={`relative ${tab === t ? 'text-ivory' : ''}`}>{t === 'all' ? 'All favourites' : kindLabel[t]}</span>
            </button>
          ))}
        </div>
        <motion.div layout className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.35 }}>
                <ProductCard p={p} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
      <div className="mt-10 flex justify-center">
        <Link to="/shop" className="btn btn-primary">Discover Your Next Favourite Object <ArrowRight size={18} className="arrow" /></Link>
      </div>
    </section>
  )
}

/* ---------- D. A Study in Materials (flip swatches) ---------- */
const materials = [
  {
    id: 'cement', name: 'Cement & concrete', colour: 'bg-sage', to: '/collections/cement-concrete',
    points: [['Mineral texture', 'Tiny air pockets and tonal shifts give every cast piece its own face.'], ['Matte finish', 'A soft, chalky surface that takes light gently and never looks shiny.'], ['Sculptural silhouettes', 'Facets, curves and chunky edges that read as small sculptures.']],
    images: [{ src: '7175391', alt: 'Faceted cement candle holders in the workshop' }, { src: '30890916', alt: 'Faceted concrete planter with a succulent' }],
  },
  {
    id: 'resin', name: 'Resin', colour: 'bg-blush', to: '/collections/resin-objects',
    points: [['Colour depth', 'Tints that glow from within, from deep moss to pastel speckle.'], ['Gloss & clarity', 'Glossy or clear finishes where a design calls for them, listed on each product.'], ['Little inclusions', 'Pressed flowers and flecks caught in place, so no two pieces match exactly.']],
    images: [{ src: '6858596', alt: 'Flowers set in clear resin' }, { src: '26969144', alt: 'Moss resin ripple dish with a candle' }],
  },
]

// A chunky sample card, like a swatch from a tile shop: the photo is on the front,
// tapping it flips the card to the three points and a shop link on the back.
function Swatch({ m, i }: { m: (typeof materials)[number]; i: number }) {
  const [flipped, setFlipped] = useState(false)
  const frontBtn = useRef<HTMLButtonElement>(null)
  const backBtn = useRef<HTMLButtonElement>(null)
  const flip = (to: boolean) => {
    setFlipped(to)
    // the face being hidden goes inert, so carry focus over to the other side
    requestAnimationFrame(() => (to ? backBtn : frontBtn).current?.focus({ preventScroll: true }))
  }
  return (
    <div className={`swatch relative h-[520px] lg:h-[540px] ${flipped ? 'is-flipped' : ''}`}>
      <div className="swatch-in">
        <div className="swatch-face overflow-hidden rounded-[30px] border-2 border-ink shadow-[5px_5px_0_var(--color-ink)]" inert={flipped}>
          <button ref={frontBtn} type="button" onClick={() => flip(true)} aria-label={`${m.name}: flip the card to read about it`} className="group absolute inset-0 block text-left">
            <Img src={m.images[0].src} alt={m.images[0].alt} className="absolute inset-0" imgClassName="transition-transform duration-[1.1s] ease-[var(--ease-out)] group-hover:scale-[1.04]" sizes="(max-width: 1024px) 100vw, 45vw" w={1100} />
            <span className={`absolute left-4 top-4 rounded-full border-[1.5px] border-ink ${m.colour} px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em]`}>Sample 0{i + 1}</span>
            <span className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-[20px] bg-ivory/95 px-4 py-3.5 backdrop-blur sm:px-5">
              <span className="display-md text-[clamp(22px,2.2vw,28px)]">{m.name}</span>
              <span className="hand flex-none text-[17px] text-muted">tap to flip <span className="flip-hint">↻</span></span>
            </span>
          </button>
        </div>
        <div className={`swatch-face swatch-back flex flex-col gap-5 overflow-hidden rounded-[30px] border-2 border-ink ${m.colour} p-6 shadow-[5px_5px_0_var(--color-ink)] sm:p-8`} inert={!flipped}>
          <Img src={m.images[1].src} alt={m.images[1].alt} className="absolute right-5 top-5 size-20 rotate-6 overflow-hidden rounded-full border-2 border-ink sm:size-24" sizes="96px" w={300} />
          <h3 className="display-md pr-24 text-[clamp(30px,3vw,40px)] sm:pr-28">{m.name}</h3>
          <ol className="grid gap-4">
            {m.points.map(([t, d], k) => (
              <li key={t} className="flex gap-4">
                <span className="grid size-10 flex-none place-items-center rounded-full bg-ivory text-[14px] font-extrabold">0{k + 1}</span>
                <span><span className="block text-[17px] font-bold">{t}</span><span className="mt-1 block text-[14.5px] leading-relaxed text-ink/75">{d}</span></span>
              </li>
            ))}
          </ol>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
            <Link to={m.to} className="btn btn-ghost btn-sm">Shop {m.name.toLowerCase()} <ArrowRight size={16} className="arrow" /></Link>
            <button ref={backBtn} type="button" onClick={() => flip(false)} aria-label={`Flip the ${m.name} card back`} className="hand text-[18px] hover:text-moss">↻ flip back</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Materials() {
  return (
    <section aria-labelledby="sim" className="wrap pt-24 md:pt-36">
      <SectionHead eyebrow="Material storytelling" title={<InkTitle id="sim" text="A study in" accent="materials." />} note="flip a swatch ✿" />
      <Reveal className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        {materials.map((m, i) => <Swatch key={m.id} m={m} i={i} />)}
      </Reveal>
      <p className="mt-7 max-w-md text-[13px] leading-relaxed text-muted">Each product page lists its exact material and finish. We describe only what a piece is, never more.</p>
    </section>
  )
}

/* ---------- E. Signature product ---------- */
export function Signature() {
  const p = productBySlug('sculpted-duo')!
  return (
    <section aria-labelledby="sig" className="wrap pt-24 md:pt-36">
      <div className="grid overflow-hidden rounded-[36px] bg-ivory ring-1 ring-line lg:grid-cols-[1.15fr_1fr]">
        <div className="relative min-h-[380px] bg-butter/60 lg:min-h-[640px]">
          <Img src={p.images[0].src} alt={p.images[0].alt} className="absolute inset-0" sizes="(max-width: 1024px) 100vw, 55vw" w={1400} />
          <div className="absolute right-4 top-4 grid size-28 place-items-center rounded-full bg-ivory/90 text-ink backdrop-blur sm:size-32">
            <RingBadge text="LIMITED · SIGNATURE · LIMITED ·" className="w-full" />
            <Sparkles size={20} className="absolute text-moss" />
          </div>
        </div>
        <div className="flex flex-col justify-center gap-6 p-7 sm:p-10 lg:p-14">
          <p className="eyebrow text-moss">Signature object</p>
          <h2 id="sig" className="display text-[clamp(44px,5vw,80px)]">{p.name}</h2>
          <p className="text-[17px] leading-relaxed text-muted">{p.description}</p>
          <dl className="grid grid-cols-2 gap-4 border-y border-line py-5 text-[14.5px]">
            <div><dt className="text-muted">Price</dt><dd className="mt-1 text-[22px] font-extrabold">{formatINR(p.price)}</dd></div>
            <div><dt className="text-muted">Material</dt><dd className="mt-1 font-bold">{p.materialLabel}</dd></div>
            <div><dt className="text-muted">Dimensions</dt><dd className="mt-1 font-bold">{p.dimensions}</dd></div>
            <div>
              <dt className="text-muted">Colours</dt>
              <dd className="mt-1.5 flex items-center gap-1.5">{p.colours.map((c) => <span key={c.id} title={c.name} className="size-6 rounded-full ring-2 ring-ivory outline outline-1 outline-line" style={{ background: c.hex }} />)}<span className="ml-1 font-bold">{p.colours.map((c) => c.name).join(' / ')}</span></dd>
            </div>
          </dl>
          <div className="flex flex-wrap gap-3">
            <Link to={`/product/${p.slug}`} className="btn btn-primary">View Product <ArrowRight size={18} className="arrow" /></Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- F. From Material to Meaning (recipe card) ---------- */
const steps = [
  { n: '01', t: 'Concept & form', d: 'Every object starts as a sketch and a question: where will it live, and what will it hold?', note: 'a sketch & a question', img: '7307273', alt: 'Cement circles and a twig arranged as a form study' },
  { n: '02', t: 'Mould preparation', d: 'Moulds are prepared and checked so edges, facets and curves come out crisp.', note: 'crisp edges start here', img: '7256640', alt: 'Pouring into a pink silicone mould' },
  { n: '03', t: 'Casting', d: 'The mix is poured, tapped to release air, and left to set slowly.', note: 'pour, tap, wait…', img: '7256839', alt: 'A gloved hand pouring into a mould' },
  { n: '04', t: 'Finishing', d: 'Pieces are demoulded, smoothed and checked before they are approved.', note: 'smoothed & checked', img: '8272682', alt: 'Hands checking a concrete candle holder on a table' },
  { n: '05', t: 'Final object', d: 'Photographed, packed and ready to find its spot in your home.', note: 'off to its new home ✿', img: '7175402', alt: 'Finished pastel candle holders on a stand' },
]

// The making process as a handwritten recipe card: tick through the steps and
// the open step's note, the photo and the progress bar follow along.
export function Process() {
  const [step, setStep] = useState(0)
  const s = steps[step]
  return (
    <section aria-labelledby="fmtm" className="wrap pt-24 md:pt-36">
      <SectionHead eyebrow="Craft & process" title={<InkTitle id="fmtm" text={'From material\nto'} accent="meaning." />} note="the house recipe ✿" />
      <Reveal className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="recipe-card relative -rotate-[1.2deg] rounded-[8px_30px_30px_8px] py-7 pl-14 pr-6 shadow-[0_18px_30px_-20px_rgba(40,30,20,.5)] sm:pr-8">
          <h3 className="hand text-[30px] font-bold leading-none">How a piece is made</h3>
          <p className="hand mb-4 mt-1.5 text-[15px] text-muted">Meenal’s little method ✿</p>
          <ol>
            {steps.map((x, i) => {
              const on = i === step
              return (
                <li key={x.n}>
                  <button type="button" onClick={() => setStep(i)} aria-pressed={on} className="flex w-full items-start gap-3 py-2 text-left">
                    <span
                      aria-hidden="true"
                      className={`mt-px grid size-[26px] flex-none place-items-center rounded-lg border-2 border-ink text-[14px] font-extrabold transition-[background-color,color,transform] duration-500 ease-[var(--ease-spring)] ${on ? 'scale-[1.15] -rotate-6 bg-butter text-ink' : i < step ? 'bg-sage text-ink' : 'bg-ivory text-transparent'}`}
                    >✓</span>
                    <span className="min-w-0">
                      <span className="block text-[16.5px] font-bold leading-snug">{x.t}</span>
                      <span className={`grid transition-[grid-template-rows,margin] duration-500 ease-[var(--ease-out)] ${on ? 'mt-1 grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                        <span className="overflow-hidden text-[14px] leading-relaxed text-muted">{x.d}</span>
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
          <div className="mt-4 flex items-center gap-3 text-[13px] font-bold text-moss">
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg2"><span className="block h-full rounded-full bg-moss transition-[width] duration-500 ease-[var(--ease-out)]" style={{ width: `${(step + 1) * 20}%` }} /></span>
            <span aria-live="polite">{step + 1} / {steps.length}</span>
          </div>
        </div>
        <div className="relative order-first aspect-[4/3] rotate-[1.5deg] overflow-hidden rounded-[30px] border-2 border-ink shadow-[6px_6px_0_var(--color-ink)] lg:order-none lg:aspect-[5/4]">
          {steps.map((x, i) => (
            <Img key={x.n} src={x.img} alt={i === step ? x.alt : ''} className={`absolute inset-0 transition-opacity duration-700 ${i === step ? 'opacity-100' : 'opacity-0'}`} sizes="(max-width: 1024px) 100vw, 45vw" w={1000} />
          ))}
          <span key={step} className="hand swap-in absolute left-3.5 top-3.5 rounded-full border-[1.5px] border-ink bg-butter px-3.5 py-1.5 text-[16px]">step {step + 1}: {s.note}</span>
        </div>
      </Reveal>
      <p className="mt-7 text-[13px] text-muted">How a piece is made varies by object and material; each product page lists what it is made of.</p>
    </section>
  )
}

/* ---------- G. Made to Belong ---------- */
export function Philosophy() {
  return (
    <section aria-labelledby="mtb" className="wrap pt-24 md:pt-36">
      <div className="relative overflow-hidden rounded-[36px] bg-sage px-6 py-16 text-center sm:px-12 md:py-24">
        <span aria-hidden="true" className="absolute -left-10 -top-10 size-48 rounded-full bg-butter/60" />
        <span aria-hidden="true" className="absolute -bottom-16 -right-8 size-60 rounded-t-full bg-blush/70" />
        <div className="relative mx-auto max-w-4xl">
          <p className="eyebrow text-moss">Brand philosophy</p>
          <WordsUp as="h2" id="mtb" text="Made to belong." className="display mt-4 block text-[clamp(56px,10vw,160px)]" />
          <Meaning className="mt-2 text-[clamp(20px,2.4vw,30px)] text-deep" />
          <Reveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-ink/80">
              AAKAAR means form. We think a home is shaped by small things: the dish your keys land in, the pot on your desk, the candle you light on a slow evening. So we make those things with care, in soft shapes and honest materials, to fit into contemporary Indian homes as if they were always there.
            </p>
          </Reveal>
          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            {['Soft, sculptural shapes', 'Honest materials', 'Made for real homes', 'Easy to gift'].map((t, i) => (
              <Reveal key={t} delay={0.3 + i * 0.06}><span className="inline-block rounded-full bg-ivory/80 px-4 py-2 text-[14px] font-bold">{t}</span></Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- H. Shop by Space ---------- */
export function ShopBySpace() {
  const withCounts = spaces.map((s) => ({ ...s, count: products.filter((p) => p.spaces.includes(s.id)).length })).filter((s) => s.count > 0)
  return (
    <section aria-labelledby="sbs" className="wrap pt-24 md:pt-36">
      <SectionHead eyebrow="Shop by space" title={<InkTitle id="sbs" text="A little something" accent="for every corner." />} />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        {withCounts.map((s, i) => (
          <Reveal key={s.id} delay={i * 0.06} className={i === 0 ? 'col-span-2 lg:col-span-1' : ''}>
            <Link to={`/shop?space=${s.id}`} className={`tile lift img-zoom group relative block ${i === 0 ? "aspect-[16/10] lg:aspect-[4/5]" : "aspect-[4/5]"}`}>
              <Img src={s.image} alt={s.alt} className="absolute inset-0" sizes="(max-width: 1024px) 50vw, 20vw" />
              <span className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 rounded-[20px] bg-ivory/92 p-3.5 backdrop-blur">
                <span className="min-w-0">
                  <span className="block font-extrabold leading-tight">{s.name}</span>
                  <span className="block text-[12.5px] text-muted">{s.count} objects · {s.note}</span>
                </span>
                <ArrowUpRight size={18} className="flex-none transition-transform duration-500 ease-[var(--ease-spring)] group-hover:rotate-45" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ---------- I. Custom Orders (circle reveal) ---------- */
// The section pins while a moss circle grows from the centre until it fills the
// screen, then the custom-orders content and photos settle in.
const customPhotos = [
  { src: '7175401', alt: 'Assorted colourful candle holders on a wooden stand', cls: 'left-[4%] top-[16%] w-[15vw] max-w-[230px] aspect-[3/4] rounded-t-full rounded-b-[28px]' },
  { src: '7257825', alt: 'Arranging dried flowers into resin moulds', cls: 'right-[5%] top-[13%] w-[13vw] max-w-[200px] aspect-square rounded-full' },
  { src: '7410461', alt: 'Kraft gift boxes tied with ribbon', cls: 'right-[7%] bottom-[9%] w-[16vw] max-w-[250px] aspect-[4/3] rounded-[28px]' },
  { src: '7354480', alt: 'Succulents in pastel pebble pots', cls: 'left-[8%] bottom-[10%] w-[12vw] max-w-[190px] aspect-square rounded-[28px] rounded-tr-full' },
]

export function CustomCallout() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const radius = useTransform(scrollYProgress, [0, 0.62], [5, 80])
  const clip = useMotionTemplate`circle(${radius}% at 50% 50%)`
  const textOpacity = useTransform(scrollYProgress, [0.32, 0.58], [0, 1])
  const textY = useTransform(scrollYProgress, [0.32, 0.62], [40, 0])
  const photoScale = useTransform(scrollYProgress, [0.45, 0.8], [0.5, 1])
  const photoOpacity = useTransform(scrollYProgress, [0.45, 0.7], [0, 1])
  const hintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])

  return (
    <section ref={ref} aria-labelledby="cust" className={`relative mt-24 md:mt-36 ${reduce ? '' : 'h-[260vh]'}`}>
      <div className={reduce ? 'relative' : 'sticky top-0 h-[100svh] overflow-hidden'}>
        {!reduce && (
          <motion.p style={{ opacity: hintOpacity }} aria-hidden="true" className="script absolute inset-x-0 top-[24%] text-center text-[clamp(20px,2.4vw,28px)] text-moss">
            something special is opening ✿
          </motion.p>
        )}
        <motion.div style={reduce ? undefined : { clipPath: clip }} className={`bg-moss text-ivory ${reduce ? 'py-24' : 'absolute inset-0'}`}>
          {customPhotos.map((p) => (
            <motion.div key={p.src} style={reduce ? undefined : { scale: photoScale, opacity: photoOpacity }} className={`absolute hidden overflow-hidden shadow-[0_30px_50px_-24px_rgba(0,0,0,.5)] lg:block ${p.cls}`}>
              <Img src={p.src} alt={p.alt} className="h-full w-full" sizes="16vw" w={500} />
            </motion.div>
          ))}
          <div className="wrap relative grid h-full place-items-center text-center">
            <motion.div style={reduce ? undefined : { opacity: textOpacity, y: textY }} className="flex max-w-3xl flex-col items-center gap-5 px-2">
              <p className="eyebrow text-butter">Custom &amp; bulk orders</p>
              <h2 id="cust" className="display text-[clamp(52px,8.4vw,132px)]">Create something personal.</h2>
              <p className="script -rotate-2 text-[clamp(20px,2.2vw,28px)] text-butter">custom &amp; gifting orders ✿</p>
              <p className="max-w-xl text-[17px] leading-relaxed text-ivory/85">Custom shapes and colours, return gifts, wedding favours, corporate gifting or a bulk order for your café or studio. Tell us what you have in mind and we will reply with what is possible.</p>
              <ul className="flex flex-wrap justify-center gap-2">
                {['Custom colours', 'Gifting sets', 'Bulk & corporate', 'Personal shapes'].map((t) => <li key={t} className="rounded-full bg-ivory/12 px-3.5 py-1.5 text-[13.5px] font-bold ring-1 ring-ivory/25">{t}</li>)}
              </ul>
              <Link to="/custom-orders" className="btn btn-butter mt-1">Create Something Personal <ArrowRight size={18} className="arrow" /></Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ---------- J. Social gallery ---------- */
const gallery = [
  { src: '7223262', alt: 'Faceted cement pots with berries', to: '/product/form-study-vase', cls: 'row-span-2' },
  { src: '7302754', alt: 'A spiral candle in a ceramic holder', to: '/collections/candle-holders', cls: '' },
  { src: '34772398', alt: 'Sunlit houseplants on a wooden table', to: '/shop?space=living', cls: '' },
  { src: '7257922', alt: 'Resin coasters with pressed flowers', to: '/product/bloom-resin-coasters', cls: 'row-span-2' },
  { src: '9130831', alt: 'A tiny succulent pot held in a hand', to: '/collections/planters', cls: '' },
  { src: '7307674', alt: 'Butter-yellow ring sculpture', to: '/product/sculpted-duo', cls: '' },
]

export function Gallery() {
  const ig = site.social.instagram
  return (
    <section aria-labelledby="gal" className="wrap pt-24 md:pt-36">
      <SectionHead
        eyebrow="From the studio"
        title={<InkTitle id="gal" text="Little moments," accent="shaped." />}
        action={ig ? (
          <a href={ig} target="_blank" rel="noreferrer" className="btn btn-ghost"><Camera size={18} /> Follow along</a>
        ) : (
          <span className="rounded-full bg-bg2 px-4 py-2 text-[13px] font-bold text-muted">Instagram coming soon</span>
        )}
      />
      <div className="grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[190px] sm:gap-4 lg:grid-cols-4">
        {gallery.map((g, i) => (
          <Reveal key={g.src} delay={i * 0.05} className={g.cls}>
            <Link to={g.to} className="tile img-zoom block h-full">
              <Img src={g.src} alt={g.alt} className="h-full" sizes="(max-width: 1024px) 50vw, 25vw" />
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
