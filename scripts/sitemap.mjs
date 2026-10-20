// Writes dist/sitemap.xml from the routes and the product catalogue.
// Runs after `vite build`. Set VITE_SITE_URL so the URLs use the real domain.
import fs from 'node:fs'

const src = fs.readFileSync(new URL('../src/data/catalog.ts', import.meta.url), 'utf8')
const slugs = [...src.matchAll(/slug: '([a-z0-9-]+)'/g)].map((m) => m[1])
const collectionSlugs = ['cement-concrete', 'resin-objects', 'planters', 'trays-bowls', 'candle-holders']
const productSlugs = slugs.filter((s) => !collectionSlugs.includes(s))
const base = (process.env.VITE_SITE_URL || 'https://aakaar.example').replace(/\/$/, '')
const paths = ['/', '/shop', '/our-story', '/custom-orders', '/contact', '/shipping-returns', '/privacy-policy', '/terms',
  ...collectionSlugs.map((s) => `/collections/${s}`), ...productSlugs.map((s) => `/product/${s}`)]
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((p) => `  <url><loc>${base}${p}</loc></url>`).join('\n')}\n</urlset>\n`
fs.mkdirSync(new URL('../dist/', import.meta.url), { recursive: true })
fs.writeFileSync(new URL('../dist/sitemap.xml', import.meta.url), xml)
console.log(`sitemap.xml: ${paths.length} URLs for ${base}`)
