import { Minus, Plus } from 'lucide-react'
import { useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { site } from '../../config/site'

/** Circular text that slowly turns, with an upright centre word. */
const RING_R = 58
const RING_C = 2 * Math.PI * RING_R
const RING_FONT = 12
const RING_TRACK = 0.24 * RING_FONT // letter-spacing, also added after the last letter

// Words separated by "·" go round the ring with exactly equal gaps and a dot centred
// in each gap. Words are measured once fonts load so different lengths still space evenly.
export function RingBadge({ text, center, className = '' }: { text: string; center?: string; className?: string }) {
  const id = useId().replace(/:/g, '')
  const words = text.split('·').map((w) => w.trim()).filter(Boolean)
  const refs = useRef<(SVGTextElement | null)[]>([])
  const [measured, setMeasured] = useState<number[] | null>(null)
  useLayoutEffect(() => {
    let live = true
    const measure = () => { if (live) setMeasured(refs.current.slice(0, words.length).map((t) => t?.getComputedTextLength() ?? 0)) }
    measure()
    document.fonts?.ready.then(measure)
    return () => { live = false }
  }, [text, words.length])
  // visible width of each word, without the trailing letter-spacing
  const widths = words.map((w, i) => (measured?.[i] ?? w.length * RING_FONT * 0.95) - RING_TRACK)
  const gap = (RING_C - widths.reduce((a, b) => a + b, 0)) / words.length
  // the path runs round twice; starting half a lap in keeps every word clear of its ends
  let at = RING_C / 2
  const placed = words.map((w, i) => {
    const start = at
    at += widths[i] + gap
    return { w, start, dot: start + widths[i] + gap / 2 }
  })
  const font = `700 ${RING_FONT}px var(--font-sans)`
  return (
    <svg viewBox="0 0 160 160" className={className} aria-hidden="true">
      <defs><path id={id} d="M80 80m-58 0a58 58 0 1 1 116 0a58 58 0 1 1-116 0a58 58 0 1 1 116 0a58 58 0 1 1-116 0" /></defs>
      <g className="spin-slow" style={{ transformOrigin: '80px 80px' }} fill="currentColor">
        {placed.map((p, i) => (
          <g key={i}>
            <text ref={(el) => { refs.current[i] = el }} style={{ font, letterSpacing: `${RING_TRACK}px` }}><textPath href={`#${id}`} startOffset={p.start}>{p.w}</textPath></text>
            <text textAnchor="middle" style={{ font }}><textPath href={`#${id}`} startOffset={p.dot}>·</textPath></text>
          </g>
        ))}
      </g>
      {center && <text x="80" y="91" textAnchor="middle" fill="var(--color-moss)" style={{ font: '700 36px var(--font-script)' }}>{center}</text>}
    </svg>
  )
}

export function Qty({ value, onChange, max = 10, size = 'md', label }: { value: number; onChange: (n: number) => void; max?: number; size?: 'sm' | 'md'; label: string }) {
  const h = size === 'sm' ? 'h-9' : 'h-12'
  const b = size === 'sm' ? 'w-9' : 'w-12'
  return (
    <div className={`inline-flex ${h} items-center rounded-full bg-ivory ring-1 ring-line`} role="group" aria-label={label}>
      <button type="button" className={`grid ${h} ${b} place-items-center rounded-full hover:bg-bg2 disabled:opacity-40`} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity"><Minus size={15} /></button>
      <span className="min-w-8 text-center text-[15px] font-bold tabular-nums" aria-live="polite">{value}</span>
      <button type="button" className={`grid ${h} ${b} place-items-center rounded-full hover:bg-bg2 disabled:opacity-40`} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity"><Plus size={15} /></button>
    </div>
  )
}

export function Marquee({ children, dur = 32, gap = 28, className = '' }: { children: ReactNode; dur?: number; gap?: number; className?: string }) {
  const style = { '--dur': `${dur}s`, '--gap': `${gap}px` } as React.CSSProperties
  return (
    <div className={`marquee ${className}`} style={style}>
      <div className="marquee-track">{children}</div>
      <div className="marquee-track" aria-hidden="true">{children}</div>
    </div>
  )
}

/** The Devanagari line — आकार — form, shape, presence. */
export function Meaning({ className = '' }: { className?: string }) {
  return (
    <p className={`hand ${className}`} lang="hi">
      {site.devanagari} <span lang="en">— {site.meaning}</span>
    </p>
  )
}

export function SectionHead({ eyebrow, title, note, action, className = '' }: { eyebrow?: string; title: ReactNode; note?: string; action?: ReactNode; className?: string }) {
  return (
    <div className={`mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 md:mb-10 ${className}`}>
      <div className="max-w-3xl">
        {eyebrow && <p className="eyebrow mb-4 text-moss">{eyebrow}</p>}
        <h2 className="display text-[clamp(40px,5.6vw,84px)]">{title}</h2>
      </div>
      {(note || action) && (
        <div className="flex flex-col items-start gap-3 md:items-end">
          {note && <p className="script max-w-[260px] -rotate-3 text-[19px] leading-snug text-muted md:text-right">{note}</p>}
          {action}
        </div>
      )}
    </div>
  )
}

export const DemoNote = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <p className={`note-box note-demo ${className}`}>{children}</p>
)
