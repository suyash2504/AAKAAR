import { useInView } from 'framer-motion'
import { Fragment, useRef, type CSSProperties } from 'react'

// Section headline that starts as an outline and fills with ink letter by letter
// when it scrolls into view. `text` is the ink part, `accent` the moss part;
// a "\n" in `text` becomes a line break from the sm breakpoint up.
export function InkTitle({ id, text, accent }: { id: string; text: string; accent: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  let i = 0
  const word = (w: string, k: string) => (
    <span key={k} className="inline-block whitespace-nowrap">
      {[...w].map((c) => <span key={i} className="ink-ch" style={{ '--i': i++ } as CSSProperties}>{c}</span>)}
    </span>
  )
  const words = (s: string, key: string) => s.split(' ').map((w, n) => <Fragment key={`${key}${n}`}>{n > 0 && ' '}{word(w, `${key}w${n}`)}</Fragment>)
  const lines = text.split('\n')
  return (
    <span id={id} ref={ref} className={`ink-fill ${inView ? 'is-in' : ''}`}>
      <span className="sr-only">{`${text.replace('\n', ' ')} ${accent}`}</span>
      <span aria-hidden="true">
        {lines.map((l, n) => <Fragment key={n}>{n > 0 && <br className="hidden sm:block" />}{n > 0 && <span className="sm:hidden"> </span>}{words(l, `l${n}`)}</Fragment>)}{' '}
        <span className="text-moss [--ink-c:var(--color-moss)]">{words(accent, 'a')}</span>
      </span>
    </span>
  )
}
