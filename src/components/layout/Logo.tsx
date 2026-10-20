import { Link } from 'react-router-dom'

/** Wordmark: AAKAAR in condensed Bricolage with a little "by Meenal" signature. */
export function Logo({ light = false, size = 'md', onClick }: { light?: boolean; size?: 'md' | 'lg'; onClick?: () => void }) {
  const big = size === 'lg'
  return (
    <Link to="/" onClick={onClick} aria-label="AAKAAR by Meenal — home" className="group relative inline-flex flex-col leading-none">
      <span className={`display tracking-[0.01em] transition-transform duration-500 ease-[var(--ease-spring)] group-hover:-rotate-2 ${big ? 'text-[clamp(64px,12vw,170px)]' : 'text-[27px] sm:text-[30px]'} ${light ? 'text-ivory' : 'text-ink'}`}>
        AAKAAR
      </span>
      <span className={`script -rotate-6 self-end ${big ? '-mt-[0.3em] text-[clamp(22px,3.6vw,48px)]' : '-mt-1.5 text-[14px] sm:text-[15px]'} ${light ? 'text-butter' : 'text-moss'}`}>
        by Meenal
      </span>
    </Link>
  )
}
