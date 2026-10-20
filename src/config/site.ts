// Everything the business needs to confirm lives here. Values marked
// "owner to confirm" are placeholders and are shown as such on the site.
const env = import.meta.env

export const site = {
  name: 'AAKAAR',
  byline: 'by Meenal',
  fullName: 'AAKAAR by Meenal',
  tagline: 'Objects That Shape Your Space.',
  devanagari: 'आकार',
  meaning: 'form, shape, presence',
  description:
    'AAKAAR by Meenal makes cute, sculptural cement planters, resin trays, candle holders and decor objects for contemporary Indian homes.',
  url: (env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') || 'https://aakaar.example',
  announcement: ['Thoughtfully made objects for considered spaces', 'Objects That Shape Your Space', 'Custom & gifting orders open'],

  // Sample catalogue: keep the store out of search indexes and label stock as sample data.
  demoInventory: true,

  contact: {
    // owner to confirm — leave null to show "to be added" instead of a fake address
    email: null as string | null,
    phone: null as string | null,
    city: null as string | null,
    hours: null as string | null,
    whatsapp: ((env.VITE_WHATSAPP_NUMBER as string | undefined) || '').replace(/\D/g, '') || null,
  },
  // owner to confirm — real profile URLs only
  social: {
    instagram: null as string | null,
    pinterest: null as string | null,
  },

  // No shipping rule has been confirmed yet. When the business sets one, fill these
  // in (rupees) and keep supabase/functions/razorpay-create-order in sync.
  shipping: {
    flatRate: null as number | null,
    freeAbove: null as number | null,
    dispatch: 'Dispatch timelines will be confirmed by AAKAAR before launch.',
  },

  payments: {
    razorpayKeyId: (env.VITE_RAZORPAY_KEY_ID as string | undefined) || '',
    apiBase: ((env.VITE_API_BASE as string | undefined) || '').replace(/\/$/, ''),
  },

  newsletter: {
    // no mailing-list provider is connected; the form says so instead of pretending
    connected: false,
  },
}

export const nav = [
  { label: 'Shop', to: '/shop' },
  { label: 'Collections', to: '/shop', mega: true },
  { label: 'Our Story', to: '/our-story' },
  { label: 'Custom Orders', to: '/custom-orders' },
] as const
