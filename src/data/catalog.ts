// SAMPLE CATALOGUE for development. Names follow the brief; prices, sizes,
// weights and availability are illustrative, not confirmed business data.
// Photos are licensed Pexels stand-ins until AAKAAR's own product shots exist —
// replace `images` with real photos before launch.
import type { Collection, Colour, Kind, Material, Product, Space } from '../types'

const c = (id: string, name: string, hex: string): Colour => ({ id, name, hex })
const GREY = c('natural-grey', 'Natural grey', '#B9B6AE')
const IVORY = c('ivory', 'Ivory', '#EFE9DD')
const CHARCOAL = c('charcoal', 'Charcoal', '#55534D')
const BLUSH = c('blush', 'Blush', '#EBC3BC')
const BUTTER = c('butter', 'Butter', '#EED98F')
const SAGE = c('sage', 'Sage', '#B9C6A4')
const MOSS = c('moss', 'Moss', '#6E7A57')
const TERRA = c('terracotta', 'Terracotta', '#C98D6E')
const CLEAR = c('clear-floral', 'Clear with florals', '#F4EEF0')
const SPECKLE = c('speckle', 'Pastel speckle', '#E9DCD8')

const cementCare = [
  'Dust with a soft, dry cloth. Avoid harsh cleaners.',
  'Small air pockets and tonal variation are natural to cast cement.',
  'Place on a mat or coaster to protect delicate surfaces.',
]
const planterCare = [
  ...cementCare.slice(0, 2),
  'Use a nursery pot inside, or water sparingly; drainage details are listed per product once confirmed.',
]
const candleCare = [
  'Never leave a burning candle unattended. Keep away from curtains and children.',
  'Trim the wick and burn on a heat-safe, level surface.',
  ...cementCare.slice(0, 1),
]
const resinCare = [
  'Wipe with a soft, damp cloth and dry straight away.',
  'Keep away from direct heat, flames and long hours of harsh sunlight.',
  'Not for food use.',
]

const P = (p: Omit<Product, 'id' | 'sku'> & { n: number }): Product => {
  const { n, ...rest } = p
  return { id: `p${String(n).padStart(2, '0')}`, sku: `AAK-${String(n).padStart(3, '0')}`, ...rest }
}

export const products: Product[] = [
  P({
    n: 1, slug: 'form-no-01-cement-planter', name: 'Form No. 01', short: 'Cement planter',
    description: 'A soft, stout planter with a gently rounded rim. Small enough for a desk or windowsill, sturdy enough to anchor a succulent or a little jade.',
    price: 449, kind: 'planters', material: 'cement', materialLabel: 'Cast cement', finish: 'Matte, raw',
    dimensions: 'Approx. 10 cm Ø × 9 cm H', weight: 'Approx. 550 g', colours: [GREY, IVORY, CHARCOAL],
    images: [{ src: '1022922', alt: 'Form No. 01 cement planter holding a green succulent' }, { src: '1931143', alt: 'Close view of a succulent in a textured cement pot' }],
    availability: 'in_stock', spaces: ['desk', 'living', 'gifting'], featured: true, bestseller: true, care: planterCare, added: '2026-08-02',
  }),
  P({
    n: 2, slug: 'monolith-planter', name: 'Monolith Planter', short: 'Faceted concrete planter',
    description: 'Crisp facets catch the light differently through the day. A small architectural planter that turns a single plant into a centrepiece.',
    price: 799, kind: 'planters', material: 'concrete', materialLabel: 'Cast concrete', finish: 'Matte, faceted',
    dimensions: 'Approx. 12 × 12 × 11 cm', weight: 'Approx. 900 g', colours: [GREY, CHARCOAL],
    images: [{ src: '30890916', alt: 'Monolith faceted concrete planter with a succulent beside books' }, { src: '5586238', alt: 'Faceted concrete planter with a cactus, tied with rope' }],
    availability: 'in_stock', spaces: ['living', 'desk'], featured: true, bestseller: true, care: planterCare, added: '2026-08-02',
  }),
  P({
    n: 3, slug: 'terra-catchall-tray', name: 'Terra Catchall Tray', short: 'Embossed cement tray',
    description: 'An oval tray with a raised floral emboss for keys, rings and earrings. Tinted cement in soft blush, so the everyday clutter looks intentional.',
    price: 349, kind: 'trays-bowls', material: 'cement', materialLabel: 'Tinted cement', finish: 'Smooth matte',
    dimensions: 'Approx. 16 × 9 × 1.5 cm', weight: 'Approx. 300 g', colours: [BLUSH, IVORY, TERRA],
    images: [{ src: '31926121', alt: 'Three blush oval trays with embossed rose patterns' }, { src: '16664386', alt: 'A scalloped dish holding a gold necklace' }],
    availability: 'in_stock', spaces: ['bedroom', 'gifting', 'living'], bestseller: true, care: cementCare, added: '2026-08-10',
  }),
  P({
    n: 4, slug: 'orbit-candle-holder', name: 'Orbit Candle Holder', short: 'Geometric cement candle holder',
    description: 'A stacked, faceted holder for a single pillar or tealight. Pair two in contrasting colours for a playful little tablescape.',
    price: 299, kind: 'candle-holders', material: 'cement', materialLabel: 'Cast cement', finish: 'Matte with colour wash',
    dimensions: 'Approx. 7 × 7 × 8 cm', weight: 'Approx. 350 g', colours: [IVORY, BUTTER, GREY],
    images: [{ src: '7175385', alt: 'White and butter-yellow geometric candle holders stacked on a table' }, { src: '7175391', alt: 'Geometric cement candle holders in the workshop' }],
    availability: 'in_stock', spaces: ['living', 'bedroom', 'gifting'], featured: true, bestseller: true, care: candleCare, added: '2026-08-02',
  }),
  P({
    n: 5, slug: 'moss-ripple-resin-dish', name: 'Moss Resin Object', short: 'Ripple dish in moss resin',
    description: 'A wavy, sculptural dish in deep moss green. Use it under a candle, for rings by the basin, or simply as a small piece of colour.',
    price: 599, kind: 'trays-bowls', material: 'resin', materialLabel: 'Tinted resin', finish: 'Satin',
    dimensions: 'Approx. 15 cm Ø × 2 cm H', weight: 'Approx. 250 g', colours: [MOSS, SAGE],
    images: [{ src: '26969144', alt: 'A moss-green ripple dish holding a candle, with pine sprigs' }],
    availability: 'low_stock', spaces: ['living', 'bedroom'], featured: true, isNew: true, care: resinCare, added: '2026-09-20',
  }),
  P({
    n: 6, slug: 'pebble-decorative-bowl', name: 'Pebble Decorative Bowl', short: 'Speckled catch-all bowl',
    description: 'A low, rounded bowl with a soft speckle. Fill it with pebbles, keys or a few seasonal eggs; it is happiest on a console or coffee table.',
    price: 499, kind: 'trays-bowls', material: 'cement', materialLabel: 'Cast cement', finish: 'Speckled matte',
    dimensions: 'Approx. 14 cm Ø × 6 cm H', weight: 'Approx. 600 g', colours: [IVORY, GREY],
    images: [{ src: '6619764', alt: 'Speckled bowl holding pastel eggs on a cement block' }, { src: '6945266', alt: 'Minimal bowl resting on a textured cement plinth' }],
    availability: 'in_stock', spaces: ['living', 'gifting'], bestseller: true, care: cementCare, added: '2026-08-12',
  }),
  P({
    n: 7, slug: 'sculpted-duo', name: 'Sculpted Duo', short: 'Two-piece cement sculpture',
    description: 'A ring and a soft wave, cast to sit together or apart. A small sculptural moment for a shelf that needs something without a job.',
    price: 899, kind: 'decor', material: 'cement', materialLabel: 'Tinted cement', finish: 'Smooth matte',
    dimensions: 'Ring approx. 12 cm Ø; wave approx. 14 × 6 cm', weight: 'Approx. 700 g (pair)', colours: [BUTTER, IVORY],
    images: [{ src: '7307674', alt: 'Butter-yellow cement ring and white wave sculpture on a beige surface' }, { src: '8166400', alt: 'Pastel geometric sculptures on a yellow table' }],
    availability: 'made_to_order', spaces: ['living', 'bedroom'], featured: true, limited: true, setOf: 2, care: cementCare, added: '2026-09-05',
  }),
  P({
    n: 8, slug: 'form-study-vase', name: 'Form Study Vase', short: 'Faceted cement bud vase',
    description: 'A faceted bud vase for a few dried stems or a single sprig of berries. Lovely in odd numbers along a windowsill.',
    price: 699, kind: 'decor', material: 'cement', materialLabel: 'Cast cement', finish: 'Matte, faceted',
    dimensions: 'Approx. 8 × 8 × 12 cm', weight: 'Approx. 650 g', colours: [GREY, CHARCOAL, BLUSH],
    images: [{ src: '7223258', alt: 'Faceted cement vases holding red berries on a pastel backdrop' }, { src: '7223257', alt: 'Faceted vases with berries seen from above' }],
    availability: 'in_stock', spaces: ['living', 'desk', 'gifting'], featured: true, bestseller: true, care: [...cementCare.slice(0, 2), 'For dried or faux stems; fresh flowers need a glass liner.'], added: '2026-08-05',
  }),
  P({
    n: 9, slug: 'confetti-candle-holders', name: 'Confetti Candle Holders', short: 'Set of three pastel holders',
    description: 'Three chunky holders in mixed pastels. Line them up for a birthday table or scatter them across a bookshelf.',
    price: 749, kind: 'candle-holders', material: 'cement', materialLabel: 'Tinted cement', finish: 'Colour-washed matte',
    dimensions: 'Each approx. 6 × 6 × 6 cm', weight: 'Approx. 750 g (set)', colours: [c('pastel-mix', 'Pastel mix', '#E9C9C4')],
    images: [{ src: '7175402', alt: 'Pastel geometric candle holders on a wooden stand against a pink and green wall' }, { src: '7175401', alt: 'Multicoloured geometric candle holders on a stand' }],
    availability: 'in_stock', spaces: ['gifting', 'living'], isNew: true, setOf: 3, care: candleCare, added: '2026-09-28',
  }),
  P({
    n: 10, slug: 'prism-candle-pair', name: 'Prism Candle Pair', short: 'Two faceted taper holders',
    description: 'A pair of faceted holders for tapers or tealights, cast in quiet grey. Made for slow evenings and stacks of books.',
    price: 549, kind: 'candle-holders', material: 'concrete', materialLabel: 'Cast concrete', finish: 'Matte, raw',
    dimensions: 'Each approx. 6 × 6 × 7 cm', weight: 'Approx. 600 g (pair)', colours: [GREY, CHARCOAL],
    images: [{ src: '7175398', alt: 'Faceted concrete candle holders on a pile of books near a plant sprig' }, { src: '7175396', alt: 'Candles going out in faceted holders' }],
    availability: 'in_stock', spaces: ['bedroom', 'living', 'desk'], setOf: 2, care: candleCare, added: '2026-08-20',
  }),
  P({
    n: 11, slug: 'glow-votive', name: 'Glow Votive', short: 'Concrete tealight cup',
    description: 'A heavy little cup for a tealight or a small poured candle. Pure, simple and warm when lit.',
    price: 349, kind: 'candle-holders', material: 'concrete', materialLabel: 'Cast concrete', finish: 'Matte, raw',
    dimensions: 'Approx. 8 cm Ø × 6 cm H', weight: 'Approx. 450 g', colours: [GREY, IVORY],
    images: [{ src: '8251479', alt: 'A lit candle glowing inside a concrete cup' }, { src: '32541187', alt: 'Concrete votive with a cork accent on marble' }],
    availability: 'in_stock', spaces: ['bedroom', 'living'], care: candleCare, added: '2026-08-22',
  }),
  P({
    n: 12, slug: 'speckle-taper-holders', name: 'Speckle Taper Holders', short: 'Pastel speckled resin holders',
    description: 'Little round holders cast in pastel-speckled resin, sized for tapers. Bright, cheerful and easy to gift in twos.',
    price: 599, kind: 'candle-holders', material: 'resin', materialLabel: 'Speckled resin', finish: 'Polished',
    dimensions: 'Each approx. 6 cm Ø × 4 cm H', weight: 'Approx. 220 g (pair)', colours: [SPECKLE],
    images: [{ src: '11848190', alt: 'Pastel speckled candle holders with candles on a textured surface' }, { src: '11848191', alt: 'Speckled holders with pink taper candles' }],
    availability: 'in_stock', spaces: ['gifting', 'bedroom'], isNew: true, setOf: 2, care: [...resinCare.slice(0, 2), 'Never leave a burning candle unattended.'], added: '2026-09-30',
  }),
  P({
    n: 13, slug: 'bloom-resin-coasters', name: 'Bloom Resin Coasters', short: 'Set of four with pressed florals',
    description: 'Clear resin coasters with tiny pressed flowers set inside. Each set varies slightly, because every bloom does.',
    price: 799, kind: 'trays-bowls', material: 'resin', materialLabel: 'Clear resin, dried flowers', finish: 'Glossy',
    dimensions: 'Each approx. 10 cm Ø', weight: 'Approx. 400 g (set)', colours: [CLEAR],
    images: [{ src: '7257922', alt: 'Resin coasters and tray with pink pressed flowers on a wooden table' }, { src: '7258051', alt: 'Resin art coasters shown indoors' }],
    availability: 'made_to_order', spaces: ['living', 'gifting'], limited: true, setOf: 4, care: [...resinCare, 'Hot cups are fine for short periods; avoid placing pans or open flames on them.'], added: '2026-09-12',
  }),
  P({
    n: 14, slug: 'blossom-resin-tray', name: 'Blossom Resin Tray', short: 'Floral resin tray',
    description: 'A glossy tray with flowers suspended inside, made for a dresser, a perfume shelf or a very special set of earrings.',
    price: 1199, kind: 'trays-bowls', material: 'resin', materialLabel: 'Clear resin, dried flowers', finish: 'Glossy',
    dimensions: 'Approx. 22 × 14 × 2 cm', weight: 'Approx. 450 g', colours: [CLEAR],
    images: [{ src: '6858596', alt: 'Fresh blooms suspended in clear resin on a dark surface' }, { src: '7257821', alt: 'Arranging dried flowers beside finished resin plates' }],
    availability: 'made_to_order', spaces: ['bedroom', 'gifting'], limited: true, care: resinCare, added: '2026-09-15',
  }),
  P({
    n: 15, slug: 'desk-trio-planters', name: 'Desk Trio Planters', short: 'Three little cement pots',
    description: 'Three small straight-sided pots for succulents, cuttings or pens. Lined up on a desk they feel like a tiny garden.',
    price: 849, kind: 'planters', material: 'cement', materialLabel: 'Cast cement', finish: 'Matte, raw',
    dimensions: 'Each approx. 7 cm Ø × 7 cm H', weight: 'Approx. 900 g (set)', colours: [GREY],
    images: [{ src: '32092481', alt: 'Three green succulents in small cement pots on a white background' }, { src: '6349701', alt: 'Succulents in minimalist pots in soft light' }],
    availability: 'in_stock', spaces: ['desk', 'gifting'], bestseller: true, setOf: 3, care: planterCare, added: '2026-08-15',
  }),
  P({
    n: 16, slug: 'pastel-pebble-pots', name: 'Pastel Pebble Pots', short: 'Round planters on little plinths',
    description: 'Round, pebble-like pots in sorbet colours, each sitting on its own tiny plinth. The cutest way to show off a small succulent.',
    price: 999, kind: 'planters', material: 'cement', materialLabel: 'Tinted cement', finish: 'Smooth matte',
    dimensions: 'Pots approx. 7–9 cm Ø', weight: 'Approx. 1.1 kg (set)', colours: [c('sorbet', 'Sorbet mix', '#F2C7A6')],
    images: [{ src: '7354480', alt: 'Succulents in round pastel pots on pastel plinths against pink' }, { src: '7354473', alt: 'Succulents and vases on geometric pastel shapes' }],
    availability: 'low_stock', spaces: ['desk', 'gifting', 'balcony'], featured: true, limited: true, isNew: true, setOf: 3, care: planterCare, added: '2026-10-01',
  }),
  P({
    n: 17, slug: 'hexa-pocket-planter', name: 'Hexa Pocket Planter', short: 'Hexagonal cement planter',
    description: 'A hexagonal planter with a generous mouth, sized for a pothos cutting or a cluster of succulents on a balcony ledge.',
    price: 549, kind: 'planters', material: 'concrete', materialLabel: 'Cast concrete', finish: 'Matte, raw',
    dimensions: 'Approx. 13 × 13 × 12 cm', weight: 'Approx. 1 kg', colours: [GREY, IVORY],
    images: [{ src: '9412392', alt: 'Hand holding a hexagonal concrete planter indoors' }, { src: '30890917', alt: 'Concrete pot with a succulent on a wooden shelf with books' }],
    availability: 'in_stock', spaces: ['balcony', 'living'], care: planterCare, added: '2026-08-18',
  }),
  P({
    n: 18, slug: 'arc-sphere-object', name: 'Arc & Sphere Object', short: 'Pastel sculptural set',
    description: 'A cone, a ball and a half-moon in pastel cement. Rearrange them whenever the mood changes.',
    price: 649, kind: 'decor', material: 'cement', materialLabel: 'Tinted cement', finish: 'Smooth matte',
    dimensions: 'Tallest piece approx. 10 cm', weight: 'Approx. 500 g (set)', colours: [c('lilac-mix', 'Lilac & butter', '#D9CBE3')],
    images: [{ src: '7307436', alt: 'Pastel cones, a ball and a ring sculpture on lilac' }, { src: '7307331', alt: 'Cement circles with a twig on a pale backdrop' }],
    availability: 'in_stock', spaces: ['living', 'bedroom', 'gifting'], isNew: true, setOf: 3, care: cementCare, added: '2026-09-25',
  }),
]

export const productById = (id: string) => products.find((p) => p.id === id)
export const productBySlug = (slug: string) => products.find((p) => p.slug === slug)

export const kindLabel: Record<Kind, string> = {
  planters: 'Planters', 'candle-holders': 'Candle Holders', 'trays-bowls': 'Trays & Bowls', decor: 'Sculptural Decor',
}
export const materialLabel: Record<Material, string> = { cement: 'Cement', concrete: 'Concrete', resin: 'Resin' }

export const collections: Collection[] = [
  { slug: 'cement-concrete', name: 'Cement & Concrete', label: 'Material study 01', blurb: 'Mineral texture, matte finish and soft sculptural silhouettes.', image: { src: '7175391', alt: 'Geometric cement candle holders in the workshop' }, tint: 'var(--color-sage)', match: (p) => p.material !== 'resin' },
  { slug: 'resin-objects', name: 'Resin Objects', label: 'Material study 02', blurb: 'Colour depth, gloss and tiny pressed flowers caught in place.', image: { src: '7257922', alt: 'Resin coasters with pressed pink flowers' }, tint: 'var(--color-blush)', match: (p) => p.material === 'resin' },
  { slug: 'planters', name: 'Planters', label: 'For tiny greens', blurb: 'Little homes for succulents, cuttings and desk plants.', image: { src: '7354480', alt: 'Succulents in pastel pebble pots' }, tint: 'var(--color-butter)', match: (p) => p.kind === 'planters' },
  { slug: 'trays-bowls', name: 'Trays & Bowls', label: 'For keys & rings', blurb: 'Catch-alls that make everyday clutter look intentional.', image: { src: '31926121', alt: 'Blush embossed trays' }, tint: 'var(--color-blush)', match: (p) => p.kind === 'trays-bowls' },
  { slug: 'candle-holders', name: 'Candle Holders', label: 'For slow evenings', blurb: 'Faceted, speckled and stacked holders for pillars, tapers and tealights.', image: { src: '7175402', alt: 'Pastel candle holders on a wooden stand' }, tint: 'var(--color-sage)', match: (p) => p.kind === 'candle-holders' },
]
export const collectionBySlug = (slug: string) => collections.find((c) => c.slug === slug)

export const spaces: { id: Space; name: string; note: string; image: string; alt: string }[] = [
  { id: 'living', name: 'Living Room', note: 'Coffee tables & consoles', image: '16449954', alt: 'A calm living room with a beige sofa and a potted plant' },
  { id: 'desk', name: 'Work Desk', note: 'Little greens & pen pots', image: '20683569', alt: 'A plant in a ribbed pot on a wooden desk' },
  { id: 'bedroom', name: 'Bedroom', note: 'Bedside rituals', image: '9616051', alt: 'A bedside table with dried pampas grass' },
  { id: 'balcony', name: 'Balcony & Plants', note: 'Ledges & corners', image: '10361662', alt: 'A balcony filled with potted greenery' },
  { id: 'gifting', name: 'Gifting', note: 'Easy, cute gifts', image: '7679913', alt: 'A stack of gift boxes on a beige background' },
]
export const spaceName = (id: string) => spaces.find((s) => s.id === id)?.name
