import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Meaning, RingBadge } from '../components/ui/Bits'
import { Img } from '../components/ui/Img'
import { MaskReveal, Reveal, WordsUp } from '../components/ui/Reveal'
import { site } from '../config/site'
import { useMeta } from '../lib/meta'

const principles = [
  { t: 'Shape first', d: 'We start with silhouette: how a piece looks from across the room, and how it feels in the hand.', c: 'bg-butter' },
  { t: 'Honest materials', d: 'Cement looks like cement, resin looks like resin. We describe each piece exactly as it is.', c: 'bg-blush' },
  { t: 'Made for real homes', d: 'Sized for Indian shelves, desks, balconies and bedside tables, not for a showroom.', c: 'bg-sage' },
  { t: 'Joy in small things', d: 'A pastel candle holder or a tiny planter should make an ordinary corner feel a little happier.', c: 'bg-ivory' },
]

export default function Story() {
  useMeta({ title: 'Our Story', description: 'The idea behind AAKAAR by Meenal: soft, sculptural cement and resin objects for contemporary Indian homes.' })
  return (
    <div>
      {/* intro */}
      <section className="wrap pt-4">
        <div className="relative overflow-hidden rounded-[40px] bg-moss px-6 pb-14 pt-14 text-ivory sm:px-12 md:pb-20 md:pt-20">
          <span aria-hidden="true" className="absolute -right-20 -top-24 size-80 rounded-full bg-butter/25" />
          <p className="eyebrow text-butter">Our story</p>
          <WordsUp as="h1" text="Every object begins with a question." className="display mt-4 block max-w-[14ch] text-[clamp(52px,8vw,128px)]" />
          <Meaning className="mt-4 text-[clamp(20px,2.4vw,30px)] text-ivory/85" />
          <Reveal delay={0.3}>
            <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-ivory/85">A question of form, of material, and of the space it will live in. AAKAAR is where Meenal answers those questions with planters, trays, candle holders and little sculptures you will want to keep.</p>
          </Reveal>
          <div className="absolute bottom-6 right-6 hidden size-36 text-ivory md:block"><RingBadge text="AAKAAR · BY MEENAL · AAKAAR ·" className="w-full" /></div>
        </div>
      </section>

      {/* the idea */}
      <section className="wrap grid items-center gap-10 pt-24 md:grid-cols-2 md:pt-32">
        <MaskReveal><Img src="7307674" alt="A butter-yellow ring and white wave sculpture" className="aspect-[4/5] rounded-t-full" sizes="(max-width: 768px) 100vw, 45vw" w={1100} /></MaskReveal>
        <Reveal>
          <p className="eyebrow text-moss">The idea behind AAKAAR</p>
          <h2 className="display mt-4 text-[clamp(40px,5vw,76px)]">Small objects that change a room.</h2>
          <p className="mt-5 text-[17px] leading-relaxed text-muted">{site.devanagari} (aakaar) is the Hindi word for form, shape and presence. That is exactly what we hope each object brings: a soft shape on a shelf, a pop of colour by the window, a little presence in an everyday corner.</p>
          <p className="mt-4 text-[17px] leading-relaxed text-muted">The pieces are designed to be cute without being fussy, and sculptural without being serious, so they sit just as happily in a first apartment as in a carefully styled living room.</p>
        </Reveal>
      </section>

      {/* philosophy + materials */}
      <section className="wrap pt-24 md:pt-32">
        <div className="grid gap-4 md:grid-cols-3">
          <Reveal className="tile bg-sage p-8 md:col-span-2 md:p-12">
            <p className="eyebrow text-moss">Design philosophy</p>
            <h2 className="display mt-4 text-[clamp(36px,4.4vw,64px)]">Soft shapes, soft colours, honest materials.</h2>
            <p className="mt-4 max-w-xl text-[16.5px] leading-relaxed text-ink/75">We like curves you want to touch, facets that catch the afternoon light and colours borrowed from sorbet, sand and moss. Nothing loud, nothing shiny for the sake of it.</p>
          </Reveal>
          <Reveal delay={0.1}><Img src="7175402" alt="Pastel geometric candle holders on a wooden stand" className="tile h-full min-h-[300px]" sizes="(max-width: 768px) 100vw, 33vw" /></Reveal>
          <Reveal className="md:row-span-2"><Img src="7256640" alt="Pouring into a pink silicone mould" className="tile h-full min-h-[300px]" sizes="(max-width: 768px) 100vw, 33vw" /></Reveal>
          <Reveal delay={0.05} className="tile bg-blush p-8 md:col-span-2 md:p-12">
            <p className="eyebrow text-moss">Material exploration</p>
            <h2 className="display-md mt-3 text-[clamp(30px,3.4vw,48px)]">Cement for calm. Resin for colour.</h2>
            <p className="mt-4 max-w-xl text-[16.5px] leading-relaxed text-ink/75">Cement and concrete give us matte, mineral surfaces with gentle tonal variation. Resin lets us play with depth, gloss and tiny pressed flowers. Each product page tells you which material a piece is made from and how to care for it.</p>
          </Reveal>
          <Reveal delay={0.1} className="tile bg-butter p-8 md:col-span-2 md:p-12">
            <p className="eyebrow text-moss">Making &amp; finishing</p>
            <h2 className="display-md mt-3 text-[clamp(30px,3.4vw,48px)]">Cast, set, smoothed, checked.</h2>
            <p className="mt-4 max-w-xl text-[16.5px] leading-relaxed text-ink/75">Pieces are cast in moulds, left to set, then demoulded and finished. Because they are cast, small air pockets and slight colour shifts are part of the character; we tell you when a piece is made to order.</p>
          </Reveal>
        </div>
      </section>

      {/* principles */}
      <section className="wrap pt-24 md:pt-32">
        <h2 className="display text-[clamp(40px,5.6vw,84px)]">Our design <span className="text-moss">principles.</span></h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p, i) => (
            <Reveal key={p.t} delay={i * 0.08} className={`tile lift flex min-h-[260px] flex-col justify-between p-7 ring-1 ring-line ${p.c}`}>
              <span className="display text-[56px] text-moss/70">0{i + 1}</span>
              <div>
                <h3 className="display-md text-[26px]">{p.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink/75">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* cta */}
      <section className="wrap pt-24 md:pt-32">
        <div className="flex flex-col items-center rounded-[40px] bg-ivory px-6 py-16 text-center ring-1 ring-line md:py-24">
          <p className="script text-[26px] text-moss">ready to find yours?</p>
          <h2 className="display mt-2 max-w-[16ch] text-[clamp(44px,6vw,96px)]">Objects that shape your space.</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/shop" className="btn btn-primary">Explore the Collection <ArrowRight size={18} className="arrow" /></Link>
            <Link to="/custom-orders" className="btn btn-ghost">Create Something Personal</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
