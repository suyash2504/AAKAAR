import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Img } from '../components/ui/Img'
import { useMeta } from '../lib/meta'

export default function NotFound() {
  useMeta({ title: 'Page not found', noindex: true })
  return (
    <div className="wrap grid items-center gap-8 pt-6 md:grid-cols-2">
      <div>
        <p className="script text-[26px] text-moss">oops, wrong shelf</p>
        <h1 className="display mt-2 text-[clamp(56px,9vw,140px)]">Lost its form.</h1>
        <p className="mt-4 max-w-md text-[17px] text-muted">This page has moved or never existed. Let us get you back to the good stuff.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/shop" className="btn btn-primary">Explore the Collection <ArrowRight size={18} className="arrow" /></Link>
          <Link to="/" className="btn btn-ghost">Back home</Link>
        </div>
      </div>
      <Img src="7307436" alt="Pastel cones, a ball and a ring sculpture" className="aspect-square rounded-full" sizes="(max-width: 768px) 100vw, 45vw" eager />
    </div>
  )
}
