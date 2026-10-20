import { ArrowRight, Check } from 'lucide-react'
import { useId, useState } from 'react'
import { site } from '../../config/site'
import { isEmail } from '../../lib/validate'

/**
 * No mailing-list provider is connected yet, so a valid email is never
 * reported as "subscribed". Wire `subscribe` to the provider (see README).
 */
export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const id = useId()
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [err, setErr] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'unavailable'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isEmail(email)) return setErr('Please enter a valid email address.')
    if (!consent) return setErr('Please tick the box so we know it is okay to email you.')
    setErr('')
    setState('sending')
    await new Promise((r) => setTimeout(r, 600))
    setState(site.newsletter.connected ? 'done' : 'unavailable')
  }

  if (state === 'done') {
    return <p className={`flex items-center gap-2 font-bold ${dark ? 'text-butter' : 'text-moss'}`}><Check size={18} /> You are on the list. Thank you!</p>
  }

  return (
    <form onSubmit={submit} noValidate className="w-full max-w-[520px]">
      <label htmlFor={id} className="sr-only">Email address</label>
      <div className={`flex items-center gap-2 rounded-full p-1.5 pl-5 ${dark ? 'bg-ivory/10 ring-1 ring-ivory/25 focus-within:ring-2 focus-within:ring-butter' : 'bg-ivory ring-1 ring-line focus-within:ring-2 focus-within:ring-moss'}`}>
        <input
          id={id}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErr(''); if (state === 'unavailable') setState('idle') }}
          placeholder="you@example.com"
          aria-invalid={!!err}
          aria-describedby={`${id}-msg`}
          className={`h-11 min-w-0 flex-1 bg-transparent text-[15.5px] font-semibold outline-none ${dark ? 'text-ivory placeholder:text-ivory/50' : 'placeholder:text-muted/70'}`}
        />
        <button type="submit" disabled={state === 'sending'} className={`btn btn-sm ${dark ? 'btn-butter' : 'btn-primary'}`}>
          {state === 'sending' ? 'Sending…' : <>Join <ArrowRight size={16} className="arrow" /></>}
        </button>
      </div>
      <label className={`mt-3 flex items-start gap-2.5 text-[13px] leading-snug ${dark ? 'text-ivory/75' : 'text-muted'}`}>
        <input type="checkbox" checked={consent} onChange={(e) => { setConsent(e.target.checked); setErr('') }} className="mt-0.5 size-4 flex-none accent-[var(--color-moss)]" />
        I would like occasional emails about new objects and studio news. I can unsubscribe at any time.
      </label>
      <div id={`${id}-msg`} aria-live="polite">
        {err && <p className={`mt-2 text-[13.5px] font-semibold ${dark ? 'text-blush' : 'text-[#A33A43]'}`}>{err}</p>}
        {state === 'unavailable' && (
          <p className={`mt-2 text-[13.5px] font-semibold ${dark ? 'text-butter' : 'text-moss'}`}>
            Thanks! Our mailing list is not switched on yet, so we have not saved your email. Please check back soon.
          </p>
        )}
      </div>
    </form>
  )
}
