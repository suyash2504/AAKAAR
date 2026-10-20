import { CheckCircle2, ImagePlus, Loader2, MessageCircle, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Accordion } from '../components/ui/Accordion'
import { SelectField, TextArea, TextField } from '../components/ui/Field'
import { Img } from '../components/ui/Img'
import { Reveal } from '../components/ui/Reveal'
import { submitDemo } from '../lib/demo'
import { useMeta } from '../lib/meta'
import { isEmail, isIndianPhone, type Errors } from '../lib/validate'
import { whatsappReady, waLink } from '../lib/whatsapp'

type K = 'name' | 'phone' | 'email' | 'type' | 'quantity' | 'budget' | 'details'
const types = ['Planter', 'Candle holder', 'Tray or bowl', 'Resin object', 'Sculptural decor', 'Gifting set', 'Something else']
const budgets = ['Under ₹1,000', '₹1,000 – ₹3,000', '₹3,000 – ₹10,000', '₹10,000 – ₹25,000', 'Over ₹25,000', 'Not sure yet']
const MAX_FILE = 5 * 1024 * 1024

const steps = [
  ['Tell us the idea', 'Share the shape, colour, size and quantity, plus a reference photo if you have one.'],
  ['We reply with options', 'AAKAAR reviews what is possible and replies with materials, timeline and a quote.'],
  ['Approve & make', 'Once you approve, your piece goes into production. Nothing is charged before you say yes.'],
]

export default function Custom() {
  useMeta({ title: 'Custom Orders', description: 'Custom cement and resin decor, gifting sets and bulk orders by AAKAAR by Meenal. Share your idea and get a reply with options.' })
  const [f, setF] = useState<Record<string, string>>({ type: '', budget: '', quantity: '1' })
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [fileErr, setFileErr] = useState('')
  const [err, setErr] = useState<Errors<K>>({})
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [ref, setRef] = useState('')

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

  const set = (k: K | 'colour') => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setF((s) => ({ ...s, [k]: e.target.value }))
    if (err[k as K]) setErr((x) => ({ ...x, [k]: undefined }))
  }

  const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fl = e.target.files?.[0]
    e.target.value = ''
    if (!fl) return
    if (!/^image\/(jpeg|png|webp|heic)$/.test(fl.type)) return setFileErr('Please choose a JPG, PNG, WEBP or HEIC image.')
    if (fl.size > MAX_FILE) return setFileErr('That image is over 5 MB. Please choose a smaller one.')
    setFileErr('')
    setFile(fl)
    setPreview(URL.createObjectURL(fl))
  }

  const validate = () => {
    const e: Errors<K> = {}
    if ((f.name ?? '').trim().length < 2) e.name = 'Please enter your name.'
    if (!isIndianPhone(f.phone ?? '')) e.phone = 'Please enter a 10-digit Indian mobile number.'
    if (!isEmail(f.email ?? '')) e.email = 'Please enter a valid email address.'
    if (!f.type) e.type = 'Please choose a product type.'
    const q = Number(f.quantity)
    if (!Number.isInteger(q) || q < 1 || q > 5000) e.quantity = 'Please enter a quantity between 1 and 5,000.'
    if (!f.budget) e.budget = 'Please choose an approximate budget.'
    if ((f.details ?? '').trim().length < 15) e.details = 'Please tell us a little more (at least 15 characters).'
    setErr(e)
    const first = Object.keys(e)[0]
    if (first) document.querySelector<HTMLElement>(`[data-field="${first}"] :is(input,select,textarea)`)?.focus()
    return !first
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setState('sending')
    try {
      const id = await submitDemo('custom-enquiry', { ...f, referenceImage: file ? { name: file.name, size: file.size } : null })
      setRef(id)
      setState('done')
    } catch {
      setState('error')
    }
  }

  const waText = () => `Hi AAKAAR, custom order enquiry:\nName: ${f.name ?? ''}\nType: ${f.type}\nQuantity: ${f.quantity}\nBudget: ${f.budget}\nColour: ${f.colour ?? ''}\nDetails: ${f.details ?? ''}`

  return (
    <div>
      <section className="wrap pt-4">
        <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <div className="tile flex flex-col justify-between gap-8 bg-butter p-7 sm:p-12">
            <p className="eyebrow">Custom &amp; bulk orders</p>
            <div>
              <h1 className="display text-[clamp(50px,7.4vw,118px)]">Create something personal.</h1>
              <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink/80">Custom shapes and colours, personalised gifts, wedding favours, corporate gifting, or a bulk order for your café, studio or store. Tell us what you are dreaming up.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Img src="7175401" alt="Colourful geometric candle holders on a wooden stand" className="tile row-span-2 min-h-[320px]" sizes="25vw" eager />
            <Img src="7257825" alt="Arranging dried flowers in resin moulds" className="tile rounded-tr-full" sizes="25vw" />
            <Img src="7410461" alt="Kraft gift boxes with ribbon" className="tile" sizes="25vw" />
          </div>
        </div>
      </section>

      <section className="wrap pt-16" aria-labelledby="how">
        <h2 id="how" className="sr-only">How custom orders work</h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {steps.map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.08} className={`tile p-7 ${['bg-sage', 'bg-blush', 'bg-ivory ring-1 ring-line'][i]}`}>
              <li className="list-none">
                <span className="display text-[44px] text-moss/80">0{i + 1}</span>
                <h3 className="display-md mt-2 text-[24px]">{t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink/75">{d}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="wrap grid gap-10 pt-16 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]" aria-labelledby="enq">
        <div className="rounded-[36px] bg-ivory p-6 ring-1 ring-line sm:p-10">
          <h2 id="enq" className="display text-[clamp(36px,4vw,60px)]">Your enquiry</h2>
          <p className="note-box note-demo mt-4"><strong>Demo mode:</strong> enquiries are not sent to AAKAAR yet. Submitting saves a test copy in this browser only.{whatsappReady ? ' To reach AAKAAR now, use the WhatsApp button.' : ''}</p>

          {state === 'done' ? (
            <div className="mt-8 rounded-[28px] bg-sage/50 p-6 sm:p-8" role="status">
              <CheckCircle2 size={36} className="text-moss" />
              <h3 className="display-md mt-3 text-[28px]">Demo enquiry saved</h3>
              <p className="mt-2 text-[15.5px] text-ink/80">Reference {ref}. This test was saved in your browser and was <strong>not</strong> sent to AAKAAR.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {whatsappReady && <a href={waLink(waText())} target="_blank" rel="noreferrer" className="btn btn-primary"><MessageCircle size={17} /> Send on WhatsApp</a>}
                <button type="button" className="btn btn-ghost" onClick={() => { setState('idle'); setF({ type: '', budget: '', quantity: '1' }); setFile(null); setPreview('') }}>Start a new enquiry</button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="mt-8 grid gap-5 sm:grid-cols-2">
              <div data-field="name" className="sm:col-span-2"><TextField label="Name" autoComplete="name" value={f.name ?? ''} onChange={set('name')} error={err.name} /></div>
              <div data-field="phone"><TextField label="Phone" type="tel" inputMode="tel" autoComplete="tel" value={f.phone ?? ''} onChange={set('phone')} error={err.phone} /></div>
              <div data-field="email"><TextField label="Email" type="email" autoComplete="email" value={f.email ?? ''} onChange={set('email')} error={err.email} /></div>
              <div data-field="type">
                <SelectField label="Product type" value={f.type} onChange={set('type')} error={err.type}>
                  <option value="">Choose one</option>
                  {types.map((t) => <option key={t}>{t}</option>)}
                </SelectField>
              </div>
              <div data-field="quantity"><TextField label="Desired quantity" type="number" min={1} max={5000} inputMode="numeric" value={f.quantity} onChange={set('quantity')} error={err.quantity} /></div>
              <div data-field="budget">
                <SelectField label="Approximate budget" value={f.budget} onChange={set('budget')} error={err.budget}>
                  <option value="">Choose a range</option>
                  {budgets.map((b) => <option key={b}>{b}</option>)}
                </SelectField>
              </div>
              <div><TextField label="Preferred colour" optional placeholder="e.g. blush, sage, charcoal" value={f.colour ?? ''} onChange={set('colour')} /></div>
              <div data-field="details" className="sm:col-span-2">
                <TextArea label="Dimensions or custom requirements" placeholder="Shape, size, finish, occasion, deadline…" value={f.details ?? ''} onChange={set('details')} error={err.details} />
              </div>
              <div className="sm:col-span-2"><TextArea label="Message" optional rows={3} value={f.message ?? ''} onChange={(e) => setF((s) => ({ ...s, message: e.target.value }))} /></div>

              <div className="sm:col-span-2">
                <p className="field-label">Reference image <span className="font-medium text-muted">(optional)</span></p>
                {file ? (
                  <div className="flex items-center gap-4 rounded-[20px] bg-bg p-3 ring-1 ring-line">
                    <img src={preview} alt="Your reference" className="size-20 rounded-2xl object-cover" />
                    <div className="min-w-0 flex-1"><p className="truncate font-bold">{file.name}</p><p className="text-[13px] text-muted">{(file.size / 1024 / 1024).toFixed(1)} MB</p></div>
                    <button type="button" onClick={() => { setFile(null); setPreview('') }} className="grid size-10 place-items-center rounded-full hover:bg-bg2" aria-label="Remove image"><X size={18} /></button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center gap-2 rounded-[22px] border-2 border-dashed border-line bg-bg p-6 text-center transition-colors hover:border-moss focus-within:border-moss">
                    <ImagePlus size={26} className="text-moss" />
                    <span className="font-bold">Add a photo or sketch</span>
                    <span className="text-[13px] text-muted">JPG, PNG, WEBP or HEIC, up to 5 MB</span>
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/heic" onChange={pick} className="sr-only" />
                  </label>
                )}
                {fileErr ? <p className="field-error" role="alert">{fileErr}</p> : <p className="field-hint">In demo mode the image stays on your device; uploads switch on with the backend.</p>}
              </div>

              {state === 'error' && <p className="rounded-2xl bg-blush/60 p-3 text-[14px] font-semibold sm:col-span-2" role="alert">Something went wrong. Your details are still here; please try again.</p>}
              <div className="flex flex-wrap gap-3 sm:col-span-2">
                <button type="submit" disabled={state === 'sending'} className="btn btn-primary">
                  {state === 'sending' ? <><Loader2 size={18} className="animate-spin" /> Saving…</> : 'Save demo enquiry'}
                </button>
                {whatsappReady && <a href={waLink(waText())} target="_blank" rel="noreferrer" className="btn btn-ghost"><MessageCircle size={17} /> Send on WhatsApp instead</a>}
              </div>
            </form>
          )}
        </div>

        <aside className="h-max lg:sticky lg:top-28">
          <h2 className="display-md text-[30px]">Good to know</h2>
          <div className="mt-4">
            <Accordion items={[
              { q: 'What can be customised?', a: 'Colours, sizes within what our moulds allow, sets and packaging for gifting. Completely new shapes may need a new mould, which we will discuss with you.' },
              { q: 'Is there a minimum quantity?', a: 'Single custom pieces are welcome. Bulk and corporate orders are quoted separately.' },
              { q: 'How long does it take?', a: 'It depends on the design and quantity. AAKAAR confirms the timeline in the quote, before anything is made.' },
              { q: 'Do I pay upfront?', a: 'Nothing is charged until you approve the quote.' },
            ]} />
          </div>
          <p className="mt-6 text-[14px] text-muted">Looking for something ready to ship? <Link to="/shop" className="font-bold text-moss underline underline-offset-4">Browse the collection</Link>.</p>
        </aside>
      </section>
    </div>
  )
}
