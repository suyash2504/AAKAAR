import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { whatsappReady, waLink } from '../../lib/whatsapp'
import { useStore } from '../../state/store'

// WhatsApp's mark (lucide has no brand icons)
function WhatsAppMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2.2a9.7 9.7 0 0 0-8.3 14.7L2.3 21.8l5-1.3A9.7 9.7 0 1 0 12 2.2zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.9 2c0 1.2.9 2.3 1 2.5.1.2 1.7 2.6 4.2 3.7 1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.5-.5z" />
    </svg>
  )
}

// Two soft clay-like blobs in the corner: WhatsApp (only once a number is set)
// and back to top, which shows up after the first screen of scrolling.
export function FloatingActions() {
  const { notify } = useStore()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 480)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const toTop = () => scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <button
        type="button"
        onClick={toTop}
        aria-label="Back to top"
        tabIndex={scrolled ? 0 : -1}
        aria-hidden={!scrolled}
        className={`fab-blob fab-blob-alt mr-[5px] size-12 bg-blush text-ink ${scrolled ? 'fab-in' : 'fab-out'}`}
      >
        <ArrowUp size={21} strokeWidth={2.6} />
      </button>
      {whatsappReady ? (
        <a href={waLink('Hi AAKAAR! I have a question.')} target="_blank" rel="noreferrer" aria-label="Chat with AAKAAR on WhatsApp" className="fab-blob size-[58px] bg-[#25D366] text-white">
          <WhatsAppMark className="size-[30px]" />
        </a>
      ) : import.meta.env.DEV && (
        // local preview only, so the design can be seen before a number is added;
        // production builds never show a WhatsApp button without a number
        <button type="button" onClick={() => notify('WhatsApp number not added yet. This button is a local preview only.', 'info')} aria-label="WhatsApp (preview: number not added yet)" className="fab-blob size-[58px] bg-[#25D366] text-white">
          <WhatsAppMark className="size-[30px]" />
        </button>
      )}
    </div>
  )
}
