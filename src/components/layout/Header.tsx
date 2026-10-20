import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Heart, Menu, Search, ShoppingBag, UserRound } from 'lucide-react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { site } from '../../config/site'
import { collections, spaces } from '../../data/catalog'
import { useStore } from '../../state/store'
import { Img } from '../ui/Img'
import { Marquee } from '../ui/Bits'
import { Logo } from './Logo'
import { MobileMenu } from './MobileMenu'

export function Header() {
  const { cart, wishlist, setCartOpen, setSearchOpen } = useStore()
  const count = cart.reduce((n, l) => n + l.qty, 0)
  const [stuck, setStuck] = useState(false)
  const [mega, setMega] = useState(false)
  const [menu, setMenu] = useState(false)
  const loc = useLocation()
  const closeTimer = useRef<number>(0)
  const megaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const on = () => setStuck(scrollY > 40)
    on()
    addEventListener('scroll', on, { passive: true })
    return () => removeEventListener('scroll', on)
  }, [])
  useEffect(() => { setMega(false); setMenu(false) }, [loc.pathname, loc.search])
  useEffect(() => {
    if (!mega) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMega(false)
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [mega])

  // bag count bumps when it changes
  const [bump, setBump] = useState(0)
  const prev = useRef(count)
  useEffect(() => { if (count !== prev.current) setBump((b) => b + 1); prev.current = count }, [count])

  const openMega = () => { clearTimeout(closeTimer.current); setMega(true) }
  const closeMegaSoon = () => { closeTimer.current = window.setTimeout(() => setMega(false), 160) }

  // liquid glass: a soft sheen follows the cursor, and a glass bead slides to the
  // link you point at, resting on the current page's link (hidden on pages without one)
  const barRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const [bead, setBead] = useState({ left: 0, width: 0 })
  const activeKey = loc.pathname === '/shop' ? 'shop' : loc.pathname.startsWith('/collections') ? 'collections' : loc.pathname === '/our-story' ? 'story' : loc.pathname === '/custom-orders' ? 'custom' : ''
  const place = (el: HTMLElement | null) => setBead(el ? { left: el.offsetLeft, width: el.offsetWidth } : (b) => ({ ...b, width: 0 }))
  const settleBead = useCallback(() => {
    place(activeKey ? navRef.current?.querySelector<HTMLElement>(`[data-key="${activeKey}"]`) ?? null : null)
  }, [activeKey])
  const beadTo = (e: React.SyntheticEvent<HTMLElement>) => place(e.currentTarget)
  useLayoutEffect(() => {
    settleBead()
    const nav = navRef.current
    if (!nav) return
    const ro = new ResizeObserver(() => settleBead())
    ro.observe(nav)
    return () => ro.disconnect()
  }, [settleBead])
  const sheen = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = barRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <>
      <div className="relative z-50 bg-moss py-2.5 text-[12.5px] font-semibold tracking-[0.03em] text-ivory">
        <p className="sr-only">{site.announcement[0]}</p>
        <Marquee dur={36} gap={30} className="[&_.marquee-track]:items-center">
          {[...site.announcement, ...site.announcement].map((t, i) => (
            <span key={i} className="flex items-center gap-[30px] whitespace-nowrap" aria-hidden="true">{t}<span className="text-butter">✿</span></span>
          ))}
        </Marquee>
      </div>

      <header className="sticky top-0 z-50 pt-3" onMouseLeave={closeMegaSoon}>
        <div className="wrap">
          <div ref={barRef} onPointerMove={sheen} className={`glass-bar ${stuck ? 'is-stuck' : ''}`}>
            <Logo />

            <nav ref={navRef} aria-label="Primary" onPointerLeave={settleBead} className="relative mx-auto hidden items-center gap-0.5 p-1 lg:flex">
              <span aria-hidden="true" className="glass-bead" style={{ left: bead.left, width: bead.width, opacity: bead.width ? 1 : 0 }} />
              <NavLink to="/shop" end data-key="shop" onPointerEnter={beadTo} onFocus={beadTo} className="glass-link">Shop</NavLink>
              <button
                type="button"
                data-key="collections"
                aria-expanded={mega}
                aria-controls="mega-menu"
                onMouseEnter={(e) => { openMega(); beadTo(e) }}
                onFocus={(e) => { openMega(); beadTo(e) }}
                onClick={() => setMega((m) => !m)}
                className="glass-link"
              >
                Collections
              </button>
              <NavLink to="/our-story" data-key="story" onPointerEnter={beadTo} onFocus={beadTo} className="glass-link">Our Story</NavLink>
              <NavLink to="/custom-orders" data-key="custom" onPointerEnter={beadTo} onFocus={beadTo} className="glass-link">Custom Orders</NavLink>
            </nav>

            <div className="ml-auto flex items-center gap-1 lg:ml-0">
              <button type="button" className="glass-ib" aria-label="Search" onClick={() => setSearchOpen(true)}><Search size={19} /></button>
              <Link to="/wishlist" className="glass-ib hidden sm:grid" aria-label={`Wishlist, ${wishlist.length} saved`}>
                <Heart size={19} />
                {wishlist.length > 0 && <span className="absolute right-1 top-1 size-2.5 rounded-full bg-rose ring-2 ring-white/70" />}
              </Link>
              <Link to="/account" className="glass-ib hidden sm:grid" aria-label="Your profile"><UserRound size={19} /></Link>
              <button type="button" className="glass-ib" aria-label={`Bag, ${count} item${count === 1 ? '' : 's'}`} onClick={() => setCartOpen(true)}>
                <ShoppingBag size={19} />
                <span key={bump} className={`absolute -right-1 -top-1 grid h-[19px] min-w-[19px] place-items-center rounded-full bg-moss px-1 text-[10.5px] font-extrabold text-ivory ${bump ? 'bump' : ''}`}>{count}</span>
              </button>
              <button type="button" className="glass-ib lg:hidden" aria-label="Open menu" aria-expanded={menu} onClick={() => setMenu(true)}><Menu size={21} /></button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mega && (
            <motion.div
              id="mega-menu"
              ref={megaRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={openMega}
              onMouseLeave={closeMegaSoon}
              className="absolute inset-x-0 top-full hidden lg:block"
            >
              <div className="wrap pb-4 pt-2">
                <div className="grid grid-cols-[1fr_2.1fr] gap-6 rounded-[30px] bg-ivory p-6 shadow-[0_30px_60px_-30px_rgba(40,40,20,.35)] ring-1 ring-line">
                  <div className="flex flex-col">
                    <p className="eyebrow mb-3 text-moss">Collections</p>
                    <ul className="grid gap-1">
                      {collections.map((c) => (
                        <li key={c.slug}>
                          <Link to={`/collections/${c.slug}`} className="group flex items-center justify-between rounded-2xl px-3 py-2.5 hover:bg-bg">
                            <span>
                              <span className="block text-[17px] font-bold">{c.name}</span>
                              <span className="block text-[13px] text-muted">{c.label}</span>
                            </span>
                            <ArrowUpRight size={18} className="opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <p className="eyebrow mb-3 mt-5 text-moss">Shop by space</p>
                    <div className="flex flex-wrap gap-2">
                      {spaces.map((s) => (
                        <Link key={s.id} to={`/shop?space=${s.id}`} className="rounded-full bg-bg px-3 py-1.5 text-[13px] font-semibold hover:bg-butter">{s.name}</Link>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[collections[0], collections[1], collections[4]].map((c, i) => (
                      <Link key={c.slug} to={`/collections/${c.slug}`} className="tile img-zoom group relative block min-h-[300px]">
                        <Img src={c.image.src} alt="" className="absolute inset-0" sizes="20vw" w={600} />
                        <span className="absolute inset-x-3 bottom-3 rounded-[20px] bg-ivory/92 p-3.5 backdrop-blur">
                          <span className="eyebrow block text-[10.5px] text-moss">{c.label}</span>
                          <span className="display-md mt-1 block text-[22px]">{c.name}</span>
                        </span>
                        {i === 1 && <span className="script absolute right-4 top-4 rotate-6 rounded-full bg-blush px-3 py-1 text-[15px]">new!</span>}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <MobileMenu open={menu} onClose={() => setMenu(false)} />
    </>
  )
}
