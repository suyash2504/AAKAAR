import { Suspense, useEffect, useLayoutEffect, useRef } from 'react'
import { Outlet, useLocation, useNavigationType } from 'react-router-dom'
import { CartDrawer } from '../shop/CartDrawer'
import { Toasts } from '../ui/Toasts'
import { FloatingActions } from './FloatingActions'
import { Footer } from './Footer'
import { Header } from './Header'
import { SearchOverlay } from './SearchOverlay'

function PageFallback() {
  return (
    <div className="wrap grid gap-6 pt-10" aria-busy="true" aria-label="Loading">
      <div className="skeleton h-14 w-2/3 rounded-3xl" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => <div key={i} className="skeleton aspect-[4/5] rounded-[30px]" />)}
      </div>
    </div>
  )
}

// Scroll position of every visited history entry, so Back returns to the same spot.
const scrollByKey = new Map<string, number>()

export function Layout() {
  const loc = useLocation()
  const navType = useNavigationType()
  const prevKey = useRef(loc.key)
  const lastY = useRef(0)

  // we restore scroll ourselves; the browser's own restoration fights the page swap
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    const track = () => { lastY.current = scrollY }
    addEventListener('scroll', track, { passive: true })
    return () => removeEventListener('scroll', track)
  }, [])

  // Back/Forward → the spot you left; a hash → that section; anything else → top
  useLayoutEffect(() => {
    // file away where the reader was on the page they just left
    if (prevKey.current !== loc.key) scrollByKey.set(prevKey.current, lastY.current)
    prevKey.current = loc.key
    if (loc.hash) {
      const t = setTimeout(() => document.querySelector(loc.hash)?.scrollIntoView({ behavior: 'smooth' }), 350)
      return () => clearTimeout(t)
    }
    const target = navType === 'POP' ? scrollByKey.get(loc.key) ?? 0 : 0
    scrollTo({ top: target })
    if (!target) return
    // lazy pages and images grow the page after the first paint; keep trying briefly
    let tries = 0
    const id = setInterval(() => {
      scrollTo({ top: target })
      if (Math.abs(scrollY - target) < 2 || ++tries > 20) clearInterval(id)
    }, 50)
    return () => clearInterval(id)
  }, [loc.key, loc.pathname, loc.hash, navType])

  return (
    <>
      <a href="#main" className="sr-only z-[100] rounded-full bg-ink px-4 py-2 text-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
      <Header />
      {/* a plain CSS fade-in per page: no exit animation, so a quick Back can never leave the page blank */}
      <main id="main" key={loc.pathname} className="page-in min-h-[60vh]">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
      <SearchOverlay />
      <Toasts />
      <FloatingActions />
    </>
  )
}
