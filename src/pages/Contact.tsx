import { CheckCircle2, Clock, Loader2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Accordion } from '../components/ui/Accordion'
import { Meaning } from '../components/ui/Bits'
import { SelectField, TextArea, TextField } from '../components/ui/Field'
import { site } from '../config/site'
import { submitDemo } from '../lib/demo'
import { useMeta } from '../lib/meta'
import { isEmail, type Errors } from '../lib/validate'
import { whatsappReady, waLink } from '../lib/whatsapp'

type K = 'name' | 'email' | 'topic' | 'message'
const topics = ['A question about a product', 'An order', 'Custom or bulk order', 'Collaboration', 'Something else']

export const faqs = [
  { q: 'What are your products made of?', a: 'Each product page lists the exact material: cast cement, cast concrete or resin, plus the finish. We only describe what a piece is made of.' },
  { q: 'Why does my piece look slightly different from the photo?', a: 'Cast cement naturally has small air pockets and tonal variation, and resin pieces with flowers or flecks vary a little. Those differences are part of the material, not defects.' },
  { q: 'How do I care for cement pieces?', a: 'Dust with a soft, dry cloth and avoid harsh cleaners. Place a mat or coaster under them to protect delicate surfaces.' },
  { q: 'How do I care for resin pieces?', a: 'Wipe with a soft, damp cloth and dry straight away. Keep them away from direct heat, flames and long hours of harsh sunlight. Resin pieces are not for food use.' },
  { q: 'Can I put plants directly in the planters?', a: 'Drainage and sealing details are listed on each planter once AAKAAR confirms them. Until then, we suggest keeping your plant in its nursery pot inside the planter.' },
  { q: 'Do you ship across India?', a: 'Shipping areas, charges and timelines are being finalised and will be shown here and at checkout before launch.' },
  { q: 'Can I return or exchange an item?', a: <>Please see our <Link to="/shipping-returns" className="font-bold text-moss underline underline-offset-4">shipping &amp; returns policy</Link>.</> },
]

export default function Contact() {
  useMeta({ title: 'Contact', description: 'Get in touch with AAKAAR by Meenal about products, orders, custom pieces and gifting.' })
  const [f, setF] = useState<Record<string, string>>({ topic: '' })
  const [err, setErr] = useState<Errors<K>>({})
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [ref, setRef] = useState('')
  const set = (k: K) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setF((s) => ({ ...s, [k]: e.target.value }))
    if (err[k]) setErr((x) => ({ ...x, [k]: undefined }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const x: Errors<K> = {}
    if ((f.name ?? '').trim().length < 2) x.name = 'Please enter your name.'
    if (!isEmail(f.email ?? '')) x.email = 'Please enter a valid email address.'
    if (!f.topic) x.topic = 'Please choose a topic.'
    if ((f.message ?? '').trim().length < 10) x.message = 'Please write a short message (at least 10 characters).'
    setErr(x)
    const first = Object.keys(x)[0]
    if (first) return document.querySelector<HTMLElement>(`[data-field="${first}"] :is(input,select,textarea)`)?.focus()
    setState('sending')
    setRef(await submitDemo('contact', f))
    setState('done')
  }

  const { contact } = site
  const details = [
    { icon: <Mail size={18} />, label: 'Email', value: contact.email, href: contact.email ? `mailto:${contact.email}` : undefined },
    { icon: <Phone size={18} />, label: 'Phone', value: contact.phone, href: contact.phone ? `tel:${contact.phone}` : undefined },
    { icon: <MapPin size={18} />, label: 'Studio', value: contact.city },
    { icon: <Clock size={18} />, label: 'Hours', value: contact.hours },
  ]

  return (
    <div>
      <section className="wrap pt-4">
        <div className="tile bg-blush p-7 sm:p-12">
          <p className="eyebrow text-moss">Contact</p>
          <h1 className="display mt-3 text-[clamp(52px,8vw,124px)]">Say hello.</h1>
          <Meaning className="mt-2 text-[22px] text-ink/70" />
          <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-ink/80">Questions about an object, an order or a custom idea? Write to us and Meenal will get back to you.</p>
        </div>
      </section>

      <section className="wrap grid gap-8 pt-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="rounded-[36px] bg-ivory p-6 ring-1 ring-line sm:p-10">
          <h2 className="display-md text-[32px]">Send a message</h2>
          <p className="note-box note-demo mt-4"><strong>Demo mode:</strong> messages are not delivered yet. Submitting saves a test copy in this browser only.</p>
          {state === 'done' ? (
            <div className="mt-6 rounded-[28px] bg-sage/50 p-6" role="status">
              <CheckCircle2 size={32} className="text-moss" />
              <p className="mt-3 font-bold">Demo message saved (ref {ref}).</p>
              <p className="mt-1 text-[15px] text-ink/75">It was <strong>not</strong> sent to AAKAAR. Once the inbox is connected, messages will be delivered for real.</p>
              <button type="button" onClick={() => { setState('idle'); setF({ topic: '' }) }} className="btn btn-ghost btn-sm mt-4">Write another</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="mt-6 grid gap-5 sm:grid-cols-2">
              <div data-field="name"><TextField label="Name" autoComplete="name" value={f.name ?? ''} onChange={set('name')} error={err.name} /></div>
              <div data-field="email"><TextField label="Email" type="email" autoComplete="email" value={f.email ?? ''} onChange={set('email')} error={err.email} /></div>
              <div data-field="topic" className="sm:col-span-2">
                <SelectField label="Topic" value={f.topic} onChange={set('topic')} error={err.topic}>
                  <option value="">Choose a topic</option>
                  {topics.map((t) => <option key={t}>{t}</option>)}
                </SelectField>
              </div>
              <div data-field="message" className="sm:col-span-2"><TextArea label="Message" value={f.message ?? ''} onChange={set('message')} error={err.message} /></div>
              <div className="sm:col-span-2">
                <button type="submit" disabled={state === 'sending'} className="btn btn-primary">{state === 'sending' ? <><Loader2 size={18} className="animate-spin" /> Saving…</> : 'Save demo message'}</button>
              </div>
            </form>
          )}
        </div>

        <aside className="grid h-max gap-4">
          <div className="rounded-[36px] bg-ivory p-6 ring-1 ring-line sm:p-8">
            <h2 className="display-md text-[26px]">Studio details</h2>
            <ul className="mt-5 grid gap-4">
              {details.map((d) => (
                <li key={d.label} className="flex items-center gap-3">
                  <span className="grid size-11 flex-none place-items-center rounded-full bg-bg">{d.icon}</span>
                  <span>
                    <span className="block text-[13px] text-muted">{d.label}</span>
                    {d.value ? (d.href ? <a href={d.href} className="link-u font-bold">{d.value}</a> : <span className="font-bold">{d.value}</span>) : <span className="font-semibold text-muted">To be added by AAKAAR</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {whatsappReady && (
            <a href={waLink('Hi AAKAAR! I have a question.')} target="_blank" rel="noreferrer" className="tile lift flex items-center gap-4 bg-moss p-6 text-ivory">
              <span className="grid size-14 place-items-center rounded-full bg-butter text-ink"><MessageCircle size={24} /></span>
              <span><span className="block text-[18px] font-bold">Chat on WhatsApp</span><span className="text-[14px] text-ivory/75">Quickest for order questions</span></span>
            </a>
          )}
        </aside>
      </section>

      <section id="faq" className="wrap grid gap-8 pt-20 lg:grid-cols-[1fr_1.6fr]" aria-labelledby="faq-h">
        <div>
          <p className="eyebrow text-moss">FAQ &amp; care</p>
          <h2 id="faq-h" className="display mt-3 text-[clamp(40px,5vw,76px)]">Good questions.</h2>
        </div>
        <Accordion items={faqs} defaultOpen={0} />
      </section>
    </div>
  )
}
