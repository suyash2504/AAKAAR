import { AnimatePresence, motion } from 'framer-motion'
import { Check, Info, X } from 'lucide-react'
import { useStore } from '../../state/store'

export function Toasts() {
  const { toasts, dismiss } = useStore()
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[80] flex flex-col items-center gap-2 px-4 sm:bottom-6" role="status" aria-live="polite">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            className="pointer-events-auto flex max-w-[460px] items-center gap-3 rounded-full bg-ink py-2 pl-2 pr-2 text-[14px] font-semibold text-ivory shadow-[0_18px_40px_-16px_rgba(0,0,0,.5)]"
          >
            <span className={`grid size-8 flex-none place-items-center rounded-full ${t.tone === 'ok' ? 'bg-butter text-ink' : 'bg-white/15'}`}>
              {t.tone === 'ok' ? <Check size={16} strokeWidth={2.6} /> : <Info size={16} />}
            </span>
            <span className="min-w-0 flex-1">{t.text}</span>
            {t.action && (
              <button type="button" onClick={() => { t.action!.run(); dismiss(t.id) }} className="rounded-full bg-white/12 px-3 py-1.5 text-[13px] font-bold text-butter hover:bg-white/20">
                {t.action.label}
              </button>
            )}
            <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss notification" className="grid size-7 place-items-center rounded-full text-ivory/70 hover:bg-white/10 hover:text-ivory">
              <X size={15} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
