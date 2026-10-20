import { CheckCircle2, ChevronLeft, CreditCard, FlaskConical, Loader2, Lock, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { EmptyBag } from '../components/shop/CartDrawer'
import { SelectField, TextField } from '../components/ui/Field'
import { Img } from '../components/ui/Img'
import { site } from '../config/site'
import { productById } from '../data/catalog'
import { readDemo, submitDemo } from '../lib/demo'
import { formatINR } from '../lib/format'
import { useMeta } from '../lib/meta'
import { payWithRazorpay, razorpayLive } from '../lib/payments'
import { loadProfile } from '../lib/profile'
import { computeTotals, type Totals } from '../lib/pricing'
import { INDIAN_STATES, isEmail, isIndianPhone, isPIN, type Errors } from '../lib/validate'
import { cartMessage, whatsappReady, waLink } from '../lib/whatsapp'
import { useStore } from '../state/store'
import type { CartLine } from '../types'

type K = 'name' | 'email' | 'phone' | 'line1' | 'city' | 'state' | 'pin'
type Method = 'razorpay' | 'demo' | 'whatsapp'

export default function Checkout() {
  useMeta({ title: 'Checkout', noindex: true })
  const { cart, clearCart } = useStore()
  const nav = useNavigate()
  // details saved on the profile page prefill the form
  const [f, setF] = useState<Record<string, string>>(() => ({ ...loadProfile() }))
  const [err, setErr] = useState<Errors<K>>({})
  const [method, setMethod] = useState<Method>(razorpayLive ? 'razorpay' : 'demo')
  const [busy, setBusy] = useState(false)
  const [payErr, setPayErr] = useState('')
  const t = computeTotals(cart)

  const set = (k: K | 'line2') => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setF((s) => ({ ...s, [k]: e.target.value }))
    if (err[k as K]) setErr((x) => ({ ...x, [k]: undefined }))
  }

  const validate = () => {
    const e: Errors<K> = {}
    if ((f.name ?? '').trim().length < 2) e.name = 'Please enter your full name.'
    if (!isEmail(f.email ?? '')) e.email = 'Please enter a valid email address.'
    if (!isIndianPhone(f.phone ?? '')) e.phone = 'Please enter a 10-digit Indian mobile number.'
    if ((f.line1 ?? '').trim().length < 5) e.line1 = 'Please enter your house / street address.'
    if ((f.city ?? '').trim().length < 2) e.city = 'Please enter your city.'
    if (!f.state) e.state = 'Please choose your state.'
    if (!isPIN(f.pin ?? '')) e.pin = 'Please enter a valid 6-digit PIN code.'
    setErr(e)
    const first = Object.keys(e)[0]
    if (first) document.querySelector<HTMLElement>(`[data-field="${first}"] input, [data-field="${first}"] select`)?.focus()
    return !first
  }

  const place = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    const customer = { name: f.name.trim(), email: f.email.trim(), phone: f.phone.trim() }
    const address = { line1: f.line1, line2: f.line2 ?? '', city: f.city, state: f.state, pin: f.pin }
    if (method === 'whatsapp') {
      const msg = `${cartMessage(cart, t.subtotal)}\n\nName: ${customer.name}\nPhone: ${customer.phone}\nAddress: ${address.line1}${address.line2 ? ', ' + address.line2 : ''}, ${address.city}, ${address.state} ${address.pin}`
      window.open(waLink(msg), '_blank', 'noreferrer')
      return
    }
    setBusy(true)
    setPayErr('')
    try {
      if (method === 'razorpay') {
        const { orderId } = await payWithRazorpay(cart, customer, address)
        clearCart()
        nav(`/order/${orderId}`)
        return
      }
      const id = await submitDemo('order', { customer, address, lines: cart, totals: t })
      clearCart()
      nav(`/order/${id}`)
    } catch (x) {
      setPayErr((x as Error).message)
    } finally {
      setBusy(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="wrap pt-4">
        <h1 className="display text-[clamp(44px,6vw,90px)]">Checkout</h1>
        <div className="mt-8 rounded-[36px] bg-ivory ring-1 ring-line"><EmptyBag /></div>
      </div>
    )
  }

  const methods: { id: Method; title: string; note: string; icon: React.ReactNode; show: boolean }[] = [
    { id: 'razorpay', title: 'Pay online (Razorpay)', note: 'UPI, cards, net banking and wallets in a secure Razorpay window.', icon: <CreditCard size={20} />, show: razorpayLive },
    { id: 'demo', title: 'Demo order', note: 'Online payment is not connected yet. This records a demo order in this browser only: no money moves and nothing ships.', icon: <FlaskConical size={20} />, show: !razorpayLive },
    { id: 'whatsapp', title: 'Order on WhatsApp', note: 'Opens WhatsApp with your bag and address. Your order is confirmed only when AAKAAR replies.', icon: <MessageCircle size={20} />, show: whatsappReady },
  ]

  return (
    <div className="wrap pt-4">
      <Link to="/cart" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-muted hover:text-ink"><ChevronLeft size={16} /> Back to bag</Link>
      <h1 className="display mt-3 text-[clamp(44px,6vw,90px)]">Checkout</h1>
      {!razorpayLive && (
        <p className="note-box note-demo mt-5 max-w-3xl"><strong>Demo checkout.</strong> Online payments are not connected yet, so no real order can be placed here. The demo flow lets you test every step safely.</p>
      )}

      <form onSubmit={place} noValidate className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-12">
        <div className="grid min-w-0 gap-6">
          <fieldset className="grid min-w-0 gap-4 rounded-[30px] bg-ivory p-5 ring-1 ring-line sm:grid-cols-2 sm:p-7">
            <legend className="sr-only">Contact details</legend>
            <h2 className="display-md text-[24px] sm:col-span-2">1. Contact</h2>
            <div data-field="name" className="sm:col-span-2"><TextField label="Full name" autoComplete="name" value={f.name ?? ''} onChange={set('name')} error={err.name} /></div>
            <div data-field="email"><TextField label="Email" type="email" autoComplete="email" value={f.email ?? ''} onChange={set('email')} error={err.email} hint="For your order confirmation." /></div>
            <div data-field="phone"><TextField label="Phone" type="tel" inputMode="tel" autoComplete="tel" value={f.phone ?? ''} onChange={set('phone')} error={err.phone} hint="For delivery updates." /></div>
          </fieldset>

          <fieldset className="grid min-w-0 gap-4 rounded-[30px] bg-ivory p-5 ring-1 ring-line sm:grid-cols-2 sm:p-7">
            <legend className="sr-only">Shipping address</legend>
            <h2 className="display-md text-[24px] sm:col-span-2">2. Shipping address</h2>
            <div data-field="line1" className="sm:col-span-2"><TextField label="House / flat, street" autoComplete="address-line1" value={f.line1 ?? ''} onChange={set('line1')} error={err.line1} /></div>
            <div className="sm:col-span-2"><TextField label="Area, landmark" optional autoComplete="address-line2" value={f.line2 ?? ''} onChange={set('line2')} /></div>
            <div data-field="city"><TextField label="City" autoComplete="address-level2" value={f.city ?? ''} onChange={set('city')} error={err.city} /></div>
            <div data-field="pin"><TextField label="PIN code" inputMode="numeric" maxLength={6} autoComplete="postal-code" value={f.pin ?? ''} onChange={set('pin')} error={err.pin} /></div>
            <div data-field="state" className="sm:col-span-2">
              <SelectField label="State" autoComplete="address-level1" value={f.state} onChange={set('state')} error={err.state}>
                <option value="">Choose state</option>
                {INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}
              </SelectField>
            </div>
          </fieldset>

          <fieldset className="grid min-w-0 gap-3 rounded-[30px] bg-ivory p-5 ring-1 ring-line sm:p-7">
            <legend className="sr-only">Payment method</legend>
            <h2 className="display-md text-[24px]">3. Payment</h2>
            {methods.filter((m) => m.show).map((m) => (
              <label key={m.id} className={`flex cursor-pointer gap-4 rounded-[22px] p-4 ring-2 transition-colors ${method === m.id ? 'bg-sage/40 ring-moss' : 'ring-line hover:bg-bg'}`}>
                <input type="radio" name="method" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} className="mt-1 size-4 flex-none accent-[var(--color-moss)]" />
                <span className="grid size-10 flex-none place-items-center rounded-full bg-bg">{m.icon}</span>
                <span><span className="block font-bold">{m.title}</span><span className="mt-0.5 block text-[14px] leading-snug text-muted">{m.note}</span></span>
              </label>
            ))}
            <p className="mt-1 flex items-center gap-2 text-[13px] text-muted"><Lock size={14} /> We never see or store your card details.</p>
          </fieldset>
        </div>

        <aside className="h-max min-w-0 rounded-[30px] bg-ivory p-5 ring-1 ring-line sm:p-7 lg:sticky lg:top-28" aria-labelledby="ord-sum">
          <h2 id="ord-sum" className="display-md text-[24px]">Your order</h2>
          <Summary lines={cart} t={t} />
          {payErr && <p className="mt-4 rounded-2xl bg-blush/60 p-3 text-[14px] font-semibold" role="alert">{payErr}</p>}
          <button type="submit" disabled={busy} className="btn btn-primary btn-block mt-5">
            {busy ? <><Loader2 size={18} className="animate-spin" /> {method === 'razorpay' ? 'Opening payment…' : 'Placing demo order…'}</> : method === 'razorpay' ? `Pay ${formatINR(t.total)}` : method === 'whatsapp' ? 'Continue on WhatsApp' : 'Place demo order'}
          </button>
          <p className="mt-3 text-center text-[12.5px] text-muted">By continuing you agree to our <Link to="/terms" className="underline underline-offset-2">terms</Link> and <Link to="/privacy-policy" className="underline underline-offset-2">privacy policy</Link>.</p>
        </aside>
      </form>
    </div>
  )
}

function Summary({ lines, t }: { lines: CartLine[]; t: Totals }) {
  return (
    <>
      <ul className="mt-5 grid gap-4">
        {lines.map((l) => {
          const p = productById(l.productId)
          if (!p) return null
          return (
            <li key={l.key} className="flex items-center gap-3">
              <span className="relative flex-none">
                <Img src={p.images[0].src} alt="" className="size-16 rounded-[16px]" w={160} sizes="64px" />
                <span className="absolute -right-1.5 -top-1.5 grid size-6 place-items-center rounded-full bg-ink text-[11px] font-extrabold text-ivory">{l.qty}</span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-bold">{p.name}</span>
                <span className="block text-[13px] text-muted">{p.colours.find((c) => c.id === l.colourId)?.name}</span>
              </span>
              <span className="font-bold">{formatINR(p.price * l.qty)}</span>
            </li>
          )
        })}
      </ul>
      <dl className="mt-5 grid gap-2.5 border-t border-line pt-4 text-[15px]">
        <div className="flex justify-between"><dt>Subtotal</dt><dd className="font-bold">{formatINR(t.subtotal)}</dd></div>
        <div className="flex justify-between gap-4"><dt>Shipping</dt><dd className="text-right font-bold">{t.shipping == null ? <span className="font-semibold text-muted">To be confirmed</span> : t.shipping === 0 ? 'Free' : formatINR(t.shipping)}</dd></div>
        <div className="flex items-baseline justify-between border-t border-line pt-3"><dt className="text-[17px] font-bold">Total</dt><dd className="text-[24px] font-extrabold">{formatINR(t.total)}</dd></div>
      </dl>
      {t.shipping == null && <p className="mt-2 text-[12.5px] text-muted">Delivery charges are not set yet; AAKAAR will confirm them before anything is dispatched.</p>}
    </>
  )
}

interface DemoOrder { id: string; at: string; customer: { name: string; email: string }; lines: CartLine[]; totals: Totals }

export function OrderConfirmation() {
  const { id = '' } = useParams()
  useMeta({ title: 'Order status', noindex: true })
  const demo = id.startsWith('DEMO-') ? readDemo<DemoOrder>('order').find((o) => o.id === id) : undefined
  let verified = false
  try { verified = sessionStorage.getItem('aak-verified') === id } catch { /* ignore */ }

  if (demo) {
    return (
      <div className="wrap max-w-3xl pt-4">
        <div className="rounded-[36px] bg-ivory p-6 ring-1 ring-line sm:p-10">
          <span className="chip bg-butter"><FlaskConical size={15} /> Demo order</span>
          <h1 className="display mt-5 text-[clamp(40px,5vw,72px)]">Demo order recorded</h1>
          <p className="mt-3 text-[16px] leading-relaxed text-muted">Thanks, {demo.customer.name.split(' ')[0]}! This was a test of the checkout flow. <strong className="text-ink">No payment was taken and no order was sent to AAKAAR.</strong> Reference: {demo.id}.</p>
          <Summary lines={demo.lines} t={demo.totals} />
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
            <Link to="/" className="btn btn-ghost">Back home</Link>
          </div>
        </div>
      </div>
    )
  }

  if (verified) {
    return (
      <div className="wrap max-w-3xl pt-4">
        <div className="rounded-[36px] bg-ivory p-6 text-center ring-1 ring-line sm:p-12">
          <CheckCircle2 size={48} className="mx-auto text-moss" />
          <h1 className="display mt-5 text-[clamp(40px,5vw,72px)]">Thank you!</h1>
          <p className="mt-3 text-[16.5px] text-muted">Your payment was confirmed and your order <strong className="text-ink">{id}</strong> is with {site.fullName}. Please keep this order number for reference.</p>
          <Link to="/shop" className="btn btn-primary mt-8">Continue Shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="wrap max-w-3xl pt-4">
      <div className="rounded-[36px] bg-ivory p-6 ring-1 ring-line sm:p-10">
        <h1 className="display-md text-[36px]">We can't show this order here</h1>
        <p className="mt-3 text-muted">Order {id} could not be confirmed in this browser. If you completed a payment, please check your confirmation email or <Link to="/contact" className="font-bold text-moss underline underline-offset-4">contact us</Link> with the order number.</p>
      </div>
    </div>
  )
}
