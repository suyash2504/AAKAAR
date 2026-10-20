import { motion, useScroll, useTransform, type Variants } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { site } from '../../config/site'
import { productBySlug, products } from '../../data/catalog'
import { formatINR } from '../../lib/format'
import { Meaning, RingBadge } from '../ui/Bits'
import { Img } from '../ui/Img'

const tile: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 18 },
  show: (i: number) => ({ opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 160, damping: 20, delay: 0.08 + i * 0.08 } }),
}
const label: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.75 + i * 0.1 } }),
}

function PhotoTile({ slug, area, i, eager }: { slug: string; area: string; i: number; eager?: boolean }) {
  const p = productBySlug(slug)!
  return (
    <motion.div variants={tile} custom={i} className={`tile lift group ${area}`}>
      <Link to={`/product/${p.slug}`} className="img-zoom absolute inset-0 block" aria-label={`${p.name}, ${formatINR(p.price)}`}>
        <Img src={p.images[0].src} alt={p.images[0].alt} className="absolute inset-0" sizes="(max-width: 1024px) 50vw, 26vw" w={1000} eager={eager} />
        <motion.span variants={label} custom={i} className="absolute bottom-3 left-3 right-3 flex w-max max-w-[calc(100%-24px)] items-center gap-2 rounded-full bg-ivory/90 py-2 pl-3.5 pr-2 text-[13px] font-bold backdrop-blur">
          <span className="truncate">{p.name}</span>
          <span className="text-moss">{formatINR(p.price)}</span>
          <span className="grid size-6 flex-none place-items-center rounded-full bg-ink text-ivory transition-transform duration-500 ease-[var(--ease-spring)] group-hover:rotate-45"><ArrowUpRight size={14} /></span>
        </motion.span>
      </Link>
    </motion.div>
  )
}

export function Hero() {
  const { scrollY } = useScroll()
  const blobY = useTransform(scrollY, [0, 800], [0, 160])
  const blobY2 = useTransform(scrollY, [0, 800], [0, -120])
  const from = Math.min(...products.map((p) => p.price))

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-x-clip pb-6 pt-2">
      {/* decorative shapes drift with scroll */}
      <motion.div aria-hidden="true" style={{ y: blobY }} className="absolute -left-24 top-40 -z-10 size-72 rounded-full bg-blush/50 blur-3xl" />
      <motion.div aria-hidden="true" style={{ y: blobY2 }} className="absolute -right-16 top-[55%] -z-10 size-80 rounded-full bg-butter/45 blur-3xl" />

      <motion.div
        initial="hidden"
        animate="show"
        className="wrap grid grid-cols-2 gap-3 [grid-template-areas:'head_head''img1_drop''img1_price''img2_img3''badge_img3'] [grid-template-rows:auto_190px_150px_230px_170px] sm:gap-3.5 lg:h-[calc(100svh-150px)] lg:max-h-[880px] lg:min-h-[640px] lg:grid-cols-[1.25fr_1fr_1fr_1fr] lg:[grid-template-areas:'head_head_img1_drop''head_head_img1_img2''price_badge_img3_img2'] lg:[grid-template-rows:1fr_1fr_.62fr]"
      >
        <motion.div variants={tile} custom={0} className="tile flex flex-col justify-between gap-5 bg-moss p-6 text-ivory [grid-area:head] sm:p-8 xl:p-10">
          <span className="chip"><span className="dot" />{site.tagline}</span>
          <div>
            <h1 id="hero-title" className="display text-[clamp(48px,5.6vw,104px)]">
              Small objects,<br />happy spaces.{' '}
              <span className="script inline-block -translate-y-[0.3em] -rotate-[8deg] text-[0.34em] tracking-normal text-butter">by Meenal</span>
            </h1>
            <Meaning className="mt-2 text-[clamp(18px,1.6vw,24px)] text-ivory/85" />
          </div>
          <p className="max-w-[460px] text-[16.5px] leading-relaxed text-ivory/85">
            Cement planters, resin trays and candle holders with soft shapes and softer colours, made to sit pretty on every shelf.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/shop" className="btn btn-butter">Explore the Collection <ArrowRight size={18} className="arrow" /></Link>
            <Link to="/our-story" className="btn btn-ghost-light">Discover Our Craft</Link>
            <a href="#find-your-form" aria-label="Scroll to the collections" className="script group ml-auto hidden items-center gap-1.5 text-[22px] text-butter xl:flex">
              scroll
              <svg viewBox="0 0 46 56" aria-hidden="true" className="h-14 w-[46px] fill-none stroke-butter stroke-[2.4] transition-transform duration-500 ease-[var(--ease-spring)] [stroke-linecap:round] [stroke-linejoin:round] group-hover:translate-y-1">
                <path className="scroll-doodle" d="M8 6c18 2 26 12 18 22s-14 4-8-4 16 0 16 14c0 6-2 10-4 14M24 48l6 6 6-8" />
              </svg>
            </a>
          </div>
        </motion.div>

        <PhotoTile slug="form-study-vase" area="[grid-area:img1]" i={1} eager />

        <motion.div variants={tile} custom={2} className="tile lift [grid-area:drop]">
          <Link to="/product/pastel-pebble-pots" className="group flex h-full flex-col justify-between bg-butter p-5 sm:p-6">
            <span className="eyebrow">New drop</span>
            <span className="display-md text-[clamp(26px,2.6vw,42px)] leading-[.95]">The Pastel<br />Pots Edit</span>
            <span className="grid size-12 place-items-center self-end rounded-full bg-ink text-bg transition-transform duration-500 ease-[var(--ease-spring)] group-hover:-rotate-45 group-hover:scale-110"><ArrowRight size={20} /></span>
          </Link>
        </motion.div>

        <PhotoTile slug="pastel-pebble-pots" area="[grid-area:img2]" i={3} eager />

        <motion.div variants={tile} custom={4} className="tile lift [grid-area:price]">
          <Link to="/shop?sort=price-asc" className="flex h-full flex-col justify-end bg-blush p-5 sm:p-6">
            <span className="script text-[clamp(18px,1.5vw,22px)] leading-tight">pretty things from</span>
            <span className="display text-[clamp(44px,4.6vw,76px)]">{formatINR(from)}</span>
          </Link>
        </motion.div>

        <motion.div variants={tile} custom={5} className="tile grid place-items-center bg-sage text-ink [grid-area:badge]">
          <RingBadge text="AAKAAR · AAKAAR · AAKAAR · AAKAAR ·" center="Meenal" className="w-[min(150px,78%)]" />
        </motion.div>

        <PhotoTile slug="orbit-candle-holder" area="[grid-area:img3]" i={6} />
      </motion.div>
    </section>
  )
}
