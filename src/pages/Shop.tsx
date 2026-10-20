import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/shop/ProductCard'
import { Img } from '../components/ui/Img'
import { site } from '../config/site'
import { collectionBySlug, kindLabel, materialLabel, products, spaceName, spaces } from '../data/catalog'
import { applyFilters, readFilters, sortLabels, type Sort } from '../lib/filter'
import { formatINR } from '../lib/format'
import { useMeta } from '../lib/meta'
import type { Colour, Kind, Material } from '../types'
import NotFound from './NotFound'

const pricePresets = [
  { label: `Under ${formatINR(500)}`, min: null, max: 499 },
  { label: `${formatINR(500)} – ${formatINR(800)}`, min: 500, max: 800 },
  { label: `Over ${formatINR(800)}`, min: 801, max: null },
]

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="min-w-0 border-b border-line pb-6">
      <legend className="eyebrow mb-3 text-moss">{title}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  )
}

function Pill({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} className={`rounded-full px-3.5 py-2 text-[13.5px] font-bold transition-[background-color,transform] duration-300 hover:-translate-y-0.5 ${on ? 'bg-ink text-ivory' : 'bg-ivory ring-1 ring-line hover:bg-bg2'}`}>{children}</button>
  )
}

export default function Shop() {
  const { slug } = useParams()
  const collection = slug ? collectionBySlug(slug) : undefined
  const [sp, setSp] = useSearchParams()
  const f = readFilters(sp)
  const [drawer, setDrawer] = useState(false)
  const [q, setQ] = useState(f.q)
  useEffect(() => setQ(f.q), [f.q])

  const base = useMemo(() => (collection ? products.filter(collection.match) : products), [collection])
  const list = useMemo(() => applyFilters([...base], f), [base, sp]) // eslint-disable-line react-hooks/exhaustive-deps

  const title = collection?.name ?? (f.q ? `Search: ${f.q}` : f.spaces.length === 1 ? `For the ${spaceName(f.spaces[0])}` : 'Shop all objects')
  useMeta({
    title: collection?.name ?? 'Shop all',
    description: collection ? `${collection.blurb} Shop ${collection.name.toLowerCase()} by AAKAAR by Meenal.` : 'Shop designer cement planters, concrete decor, resin trays and candle holders by AAKAAR by Meenal.',
    path: collection ? `/collections/${collection.slug}` : '/shop',
  })

  useEffect(() => {
    if (!drawer) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawer(false)
    addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = prev; removeEventListener('keydown', onKey) }
  }, [drawer])

  if (slug && !collection) return <NotFound />

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(sp)
    for (const [k, v] of Object.entries(patch)) (v ? next.set(k, v) : next.delete(k))
    setSp(next, { replace: true })
  }
  const toggle = (key: string, value: string, current: string[]) =>
    update({ [key]: (current.includes(value) ? current.filter((x) => x !== value) : [...current, value]).join(',') || null })
  const clearAll = () => setSp(f.sort !== 'featured' ? { sort: f.sort } : {}, { replace: true })

  const kinds = [...new Set(base.map((p) => p.kind))] as Kind[]
  const mats = [...new Set(base.map((p) => p.material))] as Material[]
  const colours = [...new Map(base.flatMap((p) => p.colours).map((c) => [c.id, c])).values()] as Colour[]

  const chips = [
    ...(f.q ? [{ label: `“${f.q}”`, clear: () => update({ q: null }) }] : []),
    ...f.kinds.map((k) => ({ label: kindLabel[k as Kind], clear: () => toggle('kind', k, f.kinds) })),
    ...f.materials.map((m) => ({ label: materialLabel[m as Material], clear: () => toggle('material', m, f.materials) })),
    ...f.colours.map((c) => ({ label: colours.find((x) => x.id === c)?.name ?? c, clear: () => toggle('colour', c, f.colours) })),
    ...f.spaces.map((s) => ({ label: spaceName(s) ?? s, clear: () => toggle('space', s, f.spaces) })),
    ...(f.min != null || f.max != null ? [{ label: `${f.min != null ? formatINR(f.min) : '₹0'} – ${f.max != null ? formatINR(f.max) : 'any'}`, clear: () => update({ min: null, max: null }) }] : []),
  ]

  const filters = (
    <div className="grid gap-6">
      {!collection && kinds.length > 1 && (
        <Group title="Category">{kinds.map((k) => <Pill key={k} on={f.kinds.includes(k)} onClick={() => toggle('kind', k, f.kinds)}>{kindLabel[k]}</Pill>)}</Group>
      )}
      {mats.length > 1 && (
        <Group title="Material">{mats.map((m) => <Pill key={m} on={f.materials.includes(m)} onClick={() => toggle('material', m, f.materials)}>{materialLabel[m]}</Pill>)}</Group>
      )}
      <Group title="Price">
        {pricePresets.map((p) => {
          const on = f.min === p.min && f.max === p.max
          return <Pill key={p.label} on={on} onClick={() => update(on ? { min: null, max: null } : { min: p.min?.toString() ?? null, max: p.max?.toString() ?? null })}>{p.label}</Pill>
        })}
        <div className="mt-1 flex w-full items-center gap-2">
          <label className="sr-only" htmlFor="pmin">Minimum price</label>
          <input id="pmin" inputMode="numeric" placeholder="Min ₹" defaultValue={f.min ?? ''} key={`min${f.min}`} onBlur={(e) => update({ min: e.target.value.replace(/\D/g, '') || null })} className="field-input !min-h-11 !rounded-full !py-2" />
          <span className="text-muted">–</span>
          <label className="sr-only" htmlFor="pmax">Maximum price</label>
          <input id="pmax" inputMode="numeric" placeholder="Max ₹" defaultValue={f.max ?? ''} key={`max${f.max}`} onBlur={(e) => update({ max: e.target.value.replace(/\D/g, '') || null })} className="field-input !min-h-11 !rounded-full !py-2" />
        </div>
      </Group>
      {colours.length > 1 && (
        <Group title="Colour">
          {colours.map((c) => {
            const on = f.colours.includes(c.id)
            return (
              <button key={c.id} type="button" aria-pressed={on} onClick={() => toggle('colour', c.id, f.colours)} className={`flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 text-[13px] font-bold transition-colors ${on ? 'bg-ink text-ivory' : 'bg-ivory ring-1 ring-line hover:bg-bg2'}`}>
                <span className="size-6 rounded-full ring-1 ring-ink/15" style={{ background: c.hex }} />{c.name}
              </button>
            )
          })}
        </Group>
      )}
      <Group title="Space">{spaces.map((s) => <Pill key={s.id} on={f.spaces.includes(s.id)} onClick={() => toggle('space', s.id, f.spaces)}>{s.name}</Pill>)}</Group>
    </div>
  )

  return (
    <div className="pb-10">
      {/* header */}
      <section className="wrap pt-4">
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-[13px] font-semibold text-muted">
          <Link to="/" className="hover:text-ink">Home</Link><ChevronRight size={14} />
          {collection ? <><Link to="/shop" className="hover:text-ink">Shop</Link><ChevronRight size={14} /><span className="text-ink" aria-current="page">{collection.name}</span></> : <span className="text-ink" aria-current="page">Shop</span>}
        </nav>
        <div className={`grid items-end gap-6 overflow-hidden rounded-[36px] p-6 sm:p-10 ${collection ? 'md:grid-cols-[1.4fr_1fr]' : ''}`} style={{ background: collection?.tint ?? 'var(--color-bg2)' }}>
          <div>
            <p className="eyebrow text-moss">{collection?.label ?? 'The whole collection'}</p>
            <h1 className="display mt-3 text-[clamp(46px,7vw,110px)]">{title}</h1>
            <p className="mt-4 max-w-xl text-[16.5px] leading-relaxed text-ink/75">{collection?.blurb ?? 'Planters, candle holders, trays, bowls and little sculptures in cement, concrete and resin.'}</p>
          </div>
          {collection && <Img src={collection.image.src} alt={collection.image.alt} className="hidden aspect-[5/4] rounded-[28px] md:block" sizes="35vw" eager />}
        </div>
      </section>

      {/* toolbar */}
      <section className="wrap mt-8 grid gap-8 lg:grid-cols-[270px_minmax(0,1fr)]">
        <aside className="hidden lg:block" aria-label="Filters">
          <div className="sticky top-28">{filters}</div>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <form role="search" onSubmit={(e) => { e.preventDefault(); update({ q: q.trim() || null }) }} className="flex min-w-[220px] flex-1 items-center gap-2 rounded-full bg-ivory px-4 ring-1 ring-line focus-within:ring-2 focus-within:ring-moss">
              <Search size={18} className="text-muted" />
              <label htmlFor="shop-q" className="sr-only">Search this collection</label>
              <input id="shop-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search objects…" className="h-12 min-w-0 flex-1 bg-transparent font-semibold outline-none" />
              {q && <button type="button" onClick={() => { setQ(''); update({ q: null }) }} aria-label="Clear search" className="grid size-8 place-items-center rounded-full hover:bg-bg2"><X size={16} /></button>}
            </form>
            <button type="button" onClick={() => setDrawer(true)} className="btn btn-ghost btn-sm lg:hidden"><SlidersHorizontal size={16} /> Filters{chips.length ? ` (${chips.length})` : ''}</button>
            <label className="flex items-center gap-2 text-[14px] font-semibold">
              <span className="hidden sm:inline">Sort</span>
              <select value={f.sort} onChange={(e) => update({ sort: e.target.value === 'featured' ? null : (e.target.value as Sort) })} className="field-input !min-h-12 !w-auto !rounded-full !py-2">
                {Object.entries(sortLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-4 flex min-h-9 flex-wrap items-center gap-2" aria-live="polite">
            <p className="mr-2 text-[14px] font-bold">{list.length} {list.length === 1 ? 'object' : 'objects'}</p>
            <AnimatePresence initial={false}>
              {chips.map((c) => (
                <motion.button key={c.label} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} type="button" onClick={c.clear} className="flex items-center gap-1.5 rounded-full bg-butter py-1.5 pl-3 pr-2 text-[13px] font-bold" aria-label={`Remove filter ${c.label}`}>
                  {c.label} <X size={14} />
                </motion.button>
              ))}
            </AnimatePresence>
            {chips.length > 0 && <button type="button" onClick={clearAll} className="link-u ml-1 text-[13.5px] font-bold text-moss">Clear all</button>}
          </div>

          {list.length ? (
            <motion.div layout className="mt-6 grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {list.map((p, i) => (
                  <motion.div key={p.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.35, delay: Math.min(i, 8) * 0.03 }}>
                    <ProductCard p={p} index={i} sizes="(max-width: 1280px) 50vw, 26vw" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="mt-8 grid place-items-center rounded-[36px] bg-ivory px-6 py-16 text-center ring-1 ring-line">
              <p className="script text-[26px] text-moss">hmm, nothing here yet</p>
              <h2 className="display-md mt-2 text-[30px]">No objects match these filters</h2>
              <p className="mt-2 max-w-md text-muted">Try removing a filter or two, or tell us what you are looking for and we may be able to make it.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button type="button" onClick={clearAll} className="btn btn-primary">Clear all filters</button>
                <Link to="/custom-orders" className="btn btn-ghost">Request a custom piece</Link>
              </div>
            </div>
          )}
          {site.demoInventory && <p className="mt-10 text-[12.5px] text-muted">Sample catalogue for development: product photos are stand-ins and prices, sizes and stock are illustrative.</p>}
        </div>
      </section>

      {/* mobile filter drawer */}
      <AnimatePresence>
        {drawer && (
          <div className="fixed inset-0 z-[75] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
            <motion.button type="button" aria-label="Close filters" onClick={() => setDrawer(false)} className="absolute inset-0 bg-ink/35" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 34 }} className="absolute inset-x-0 bottom-0 flex max-h-[88svh] flex-col rounded-t-[30px] bg-bg">
              <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-oat" />
              <div className="flex items-center justify-between px-5 pb-2 pt-3">
                <h2 className="display-md text-[26px]">Filters</h2>
                <button type="button" onClick={() => setDrawer(false)} className="grid size-11 place-items-center rounded-full bg-ivory" aria-label="Close filters"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 pb-4">{filters}</div>
              <div className="grid grid-cols-2 gap-3 border-t border-line p-4">
                <button type="button" onClick={clearAll} className="btn btn-ghost">Clear all</button>
                <button type="button" onClick={() => setDrawer(false)} className="btn btn-primary">Show {list.length}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
