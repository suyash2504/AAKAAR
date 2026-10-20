import { useState } from 'react'
import { photoSrcSet, photoUrl } from '../../lib/images'

interface Props {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  sizes?: string
  /** above-the-fold images load eagerly */
  eager?: boolean
  w?: number
}

/** Photo with a shimmer placeholder, responsive srcset and a soft fade-in. */
export function Img({ src, alt, className = '', imgClassName = '', sizes = '(max-width: 768px) 50vw, 25vw', eager, w = 800 }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  // callers that position the photo themselves must not also get `relative`
  const placed = className.split(/\s+/).some((c) => c === 'absolute' || c === 'fixed' || c === 'tile')
  return (
    <div className={`${placed ? '' : 'relative'} overflow-hidden bg-bg2 ${loaded || failed ? '' : 'skeleton'} ${className}`}>
      {failed ? (
        <div className="absolute inset-0 grid place-items-center p-4 text-center text-[13px] font-semibold text-muted">Photo coming soon</div>
      ) : (
        <img
          src={photoUrl(src, w)}
          srcSet={photoSrcSet(src)}
          sizes={sizes}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={eager ? 'high' : undefined}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        />
      )}
    </div>
  )
}
