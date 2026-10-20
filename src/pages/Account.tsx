import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, FlaskConical, Heart, Package, Sparkles, Trash2, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Meaning } from '../components/ui/Bits'
import { SelectField, TextField } from '../components/ui/Field'
import { Img } from '../components/ui/Img'
import { productById } from '../data/catalog'
import { readDemo } from '../lib/demo'
import { formatINR } from '../lib/format'
import { useMeta } from '../lib/meta'
import { clearProfile, emptyProfile, hasProfile, loadProfile, saveProfile, type Profile } from '../lib/profile'
import { INDIAN_STATES, isEmail, isIndianPhone, isPIN, type Errors } from '../lib/validate'
import { useStore } from '../state/store'
import type { CartLine } from '../types'

interface DemoOrder { id: string; at: string; lines: CartLine[]; totals: { total: number; count: number } }
interface DemoEnquiry { id: string; at: string; type: string; quantity: string }

type K = 'name' | 'email' | 'phone' | 'pin'

export default function Account() {
  useMeta({ title: 'Your profile', noindex: true })
  const { wishlist } = useStore()
  const [p, setP] = useState<Profile>(loadProfile)
  const [err, setErr] = useState<Errors<K>>({})
  const [saved, setSaved] = useState(false)
  const orders = readDemo<DemoOrder>('order')
  const enquiries = readDemo<DemoEnquiry>('custom-enquiry')
  const first = p.name.trim().split(' ')[0]

  const set = (k: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setP((x) => ({ ...x, [k]: e.target.value }))
    setSaved(false)
    if (err[k as K]) setErr((x) => ({ ...x, [k]: undefined }))
  }

  // every field is optional, but whatever is filled in must be valid
  const save = (e: React.FormEvent) => {
    e.preventDefault()
    const x: Errors<K> = {}
    if (p.email.trim() && !isEmail(p.email)) x.email = 'Please enter a valid email address.'
    if (p.phone.trim() && !isIndianPhone(p.phone)) x.phone = 'Please enter a 10-digit Indian mobile number.'
    if (p.pin.trim() && !isPIN(p.pin)) x.pin = 'Please enter a valid 6-digit PIN code.'
    setErr(x)
    if (Object.keys(x).length) return
    saveProfile(p)
    setSaved(true)
  }
  const forget = () => { clearProfile(); setP(emptyProfile); setSaved(false); setErr({}) }

  return (
    <div className="wrap pt-4">
      {/* greeting */}
      <section className="tile flex flex-wrap items-end justify-between gap-6 bg-sage p-7 sm:p-10">
        <div className="flex items-center gap-5">
          <span className="grid size-20 flex-none place-items-center rounded-full bg-ivory text-moss shadow-[inset_0_1px_0_#fff]">
            {first ? <span className="display text-[40px]">{first[0].toUpperCase()}</span> : <UserRound size={34} />}
          </span>
          <div>
            <p className="eyebrow text-moss">Your profile</p>
            <h1 className="display mt-2 text-[clamp(44px,6vw,88px)]">{first ? `Hello, ${first}!` : 'Hello there!'}</h1>
            <Meaning className="mt-1 text-[19px] text-ink/70" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { n: orders.length, l: 'orders', to: '#orders' },
            { n: wishlist.length, l: 'saved', to: '/wishlist' },
            { n: enquiries.length, l: 'enquiries', to: '#enquiries' },
          ].map((s) => (
            s.to.startsWith('#')
              ? <a key={s.l} href={s.to} className="rounded-[20px] bg-ivory/80 px-4 py-3 transition-transform hover:-translate-y-0.5"><span className="display block text-[30px]">{s.n}</span><span className="text-[12.5px] font-semibold text-muted">{s.l}</span></a>
              : <Link key={s.l} to={s.to} className="rounded-[20px] bg-ivory/80 px-4 py-3 transition-transform hover:-translate-y-0.5"><span className="display block text-[30px]">{s.n}</span><span className="text-[12.5px] font-semibold text-muted">{s.l}</span></Link>
          ))}
        </div>
      </section>

      <p className="note-box note-demo mt-5"><strong>Accounts are not switched on yet.</strong> Sign-in arrives when the store backend is connected. Until then, everything on this page is saved in this browser only, and your details fill in checkout for you.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        {/* details */}
        <form onSubmit={save} noValidate className="grid min-w-0 gap-4 rounded-[32px] bg-ivory p-6 ring-1 ring-line sm:grid-cols-2 sm:p-8">
          <div className="sm:col-span-2">
            <h2 className="display-md text-[28px]">Your details</h2>
            <p className="mt-1 text-[14px] text-muted">All optional. Used to fill in checkout faster.</p>
          </div>
          <div className="sm:col-span-2"><TextField label="Full name" autoComplete="name" value={p.name} onChange={set('name')} /></div>
          <TextField label="Email" type="email" autoComplete="email" value={p.email} onChange={set('email')} error={err.email} />
          <TextField label="Phone" type="tel" inputMode="tel" autoComplete="tel" value={p.phone} onChange={set('phone')} error={err.phone} />
          <p className="eyebrow pt-2 text-moss sm:col-span-2">Saved address</p>
          <div className="sm:col-span-2"><TextField label="House / flat, street" autoComplete="address-line1" value={p.line1} onChange={set('line1')} /></div>
          <div className="sm:col-span-2"><TextField label="Area, landmark" autoComplete="address-line2" value={p.line2} onChange={set('line2')} /></div>
          <TextField label="City" autoComplete="address-level2" value={p.city} onChange={set('city')} />
          <TextField label="PIN code" inputMode="numeric" maxLength={6} autoComplete="postal-code" value={p.pin} onChange={set('pin')} error={err.pin} />
          <div className="sm:col-span-2">
            <SelectField label="State" autoComplete="address-level1" value={p.state} onChange={set('state')}>
              <option value="">Choose state</option>
              {INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}
            </SelectField>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
            <button type="submit" className="btn btn-primary">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={String(saved)} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} className="flex items-center gap-2">
                  {saved ? <><Check size={18} /> Saved on this device</> : 'Save details'}
                </motion.span>
              </AnimatePresence>
            </button>
            {hasProfile(p) && <button type="button" onClick={forget} className="btn btn-ghost btn-sm"><Trash2 size={15} /> Forget my details</button>}
          </div>
        </form>

        <div className="grid h-max gap-6">
          {/* orders */}
          <section id="orders" className="rounded-[32px] bg-ivory p-6 ring-1 ring-line sm:p-8" aria-labelledby="orders-h">
            <h2 id="orders-h" className="display-md flex items-center gap-2 text-[26px]"><Package size={22} /> Your orders</h2>
            {orders.length ? (
              <ul className="mt-4 grid gap-3">
                {orders.slice(0, 5).map((o) => {
                  const firstLine = o.lines[0]
                  const prod = firstLine ? productById(firstLine.productId) : undefined
                  return (
                    <li key={o.id}>
                      <Link to={`/order/${o.id}`} className="flex items-center gap-3 rounded-[20px] p-2 hover:bg-bg">
                        {prod && <Img src={prod.images[0].src} alt="" className="size-14 flex-none rounded-2xl" w={160} sizes="56px" />}
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2 font-bold"><FlaskConical size={14} className="text-muted" /> {o.id}</span>
                          <span className="block text-[13px] text-muted">{new Date(o.at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {o.totals.count} item{o.totals.count === 1 ? '' : 's'} · demo</span>
                        </span>
                        <span className="font-extrabold">{formatINR(o.totals.total)}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="mt-3 text-[15px] text-muted">No orders yet. <Link to="/shop" className="font-bold text-moss underline underline-offset-4">Find your first object</Link>.</p>
            )}
            {orders.length > 0 && <p className="mt-3 text-[12.5px] text-muted">These are demo orders from this browser; no payment was taken.</p>}
          </section>

          {/* wishlist peek */}
          <Link to="/wishlist" className="tile lift group flex items-center gap-4 bg-blush p-6">
            <span className="grid size-14 flex-none place-items-center rounded-full bg-ivory"><Heart size={22} className={wishlist.length ? 'fill-rose stroke-rose' : ''} /></span>
            <span className="flex-1">
              <span className="block text-[18px] font-bold">Wishlist</span>
              <span className="text-[14px] text-ink/70">{wishlist.length ? `${wishlist.length} object${wishlist.length === 1 ? '' : 's'} saved` : 'Nothing saved yet'}</span>
            </span>
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </Link>

          {/* enquiries */}
          <section id="enquiries" className="rounded-[32px] bg-ivory p-6 ring-1 ring-line sm:p-8" aria-labelledby="enq-h">
            <h2 id="enq-h" className="display-md flex items-center gap-2 text-[26px]"><Sparkles size={20} /> Custom enquiries</h2>
            {enquiries.length ? (
              <ul className="mt-3 grid gap-2 text-[14.5px]">
                {enquiries.slice(0, 4).map((q) => (
                  <li key={q.id} className="flex justify-between gap-3 rounded-2xl bg-bg px-4 py-3"><span className="font-bold">{q.type}</span><span className="text-muted">qty {q.quantity} · demo</span></li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-[15px] text-muted">Dreaming up something special? <Link to="/custom-orders" className="font-bold text-moss underline underline-offset-4">Start a custom order</Link>.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
