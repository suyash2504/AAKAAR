import { AnimatePresence, motion } from 'framer-motion'
import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
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

export function Layout() {
  const loc = useLocation()

  // new page → top of page; same page with a hash → that section
  useEffect(() => {
    if (loc.hash) {
      const t = setTimeout(() => document.querySelector(loc.hash)?.scrollIntoView({ behavior: 'smooth' }), 350)
      return () => clearTimeout(t)
    }
    scrollTo({ top: 0 })
  }, [loc.pathname, loc.hash])

  return (
    <>
      <a href="#main" className="sr-only z-[100] rounded-full bg-ink px-4 py-2 text-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
      <Header />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          id="main"
          key={loc.pathname}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-[60vh]"
        >
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </motion.main>
      </AnimatePresence>
      <Footer />
      <CartDrawer />
      <SearchOverlay />
      <Toasts />
      <FloatingActions />
    </>
  )
}
