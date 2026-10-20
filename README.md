# AAKAAR by Meenal

*Objects That Shape Your Space.* · आकार — form, shape, presence

A storefront for cute, sculptural cement planters, resin trays, candle holders and decor objects.
React 19 + TypeScript + Vite + Tailwind CSS 4 + Motion (framer-motion) + React Router.

> **Status: demo storefront.** The catalogue is sample data, photos are Pexels stand-ins,
> and checkout, forms and newsletter run in clearly labelled demo mode until the
> integrations below are configured.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5210
npm run build      # type-check, production build, dist/sitemap.xml
npm run preview    # serve the production build
```

Copy `.env.example` to `.env.local` to set environment values.

## Routes

| Route | Page |
|---|---|
| `/` | Home: bento hero, Find Your Form, Objects Worth Keeping, A Study in Materials, signature product, From Material to Meaning, Made to Belong, shop by space, custom orders, studio gallery |
| `/shop` | All products: search, category / material / price / colour / space filters, sort, filter chips, mobile filter drawer. Filters live in the URL (`?kind=planters&material=resin&min=300&sort=price-asc&q=…&space=desk`). |
| `/collections/cement-concrete` · `resin-objects` · `planters` · `trays-bowls` · `candle-holders` | Collections (same filters) |
| `/product/:slug` | Gallery + thumbnails + hover zoom + full-screen view, colours, quantity, stock, add to bag, wishlist, details / care / shipping, related, recently viewed |
| `/cart` · `/checkout` · `/order/:id` | Bag, checkout, order status |
| `/wishlist` | Saved items (this browser) |
| `/our-story` · `/custom-orders` · `/contact` (FAQ at `#faq`) | Brand and enquiry pages |
| `/shipping-returns` · `/privacy-policy` · `/terms` | Policy templates (need business review) |

## What works now

- Bag: add / remove (with undo) / change quantity, live subtotal, slide-out drawer and full page; saved in `localStorage`. No payment data is ever stored.
- Wishlist and recently viewed, saved in `localStorage`, synced across tabs.
- Search overlay and shop search, all filters and sorting, empty states.
- Checkout validation (Indian phone, PIN, state) and a **demo order** flow that says plainly that no money moved.
- Custom order and contact forms: validation, loading and success states. In demo mode they save a copy in the browser only and say so.
- Newsletter form: validation + consent; it does **not** claim to subscribe anyone until a provider is connected.
- WhatsApp buttons (bag, product, checkout, contact, floating) appear only when `VITE_WHATSAPP_NUMBER` is set; they open a prefilled message and never claim an order was received.
- Page titles, descriptions, Open Graph, canonical URLs, organisation JSON-LD, sitemap. Product JSON-LD switches on only when `site.demoInventory` is `false`.
- Reduced-motion support, keyboard focus states, skip link, labelled icon buttons, focus moved into drawers and dialogs, Escape closes them.

## Configuration checklist

### 1. Business details — `src/config/site.ts`
- `contact.email`, `contact.phone`, `contact.city`, `contact.hours` (shown as "to be added" until set)
- `social.instagram` / `social.pinterest` (real profile URLs only)
- `shipping.flatRate`, `shipping.freeAbove` (rupees), `shipping.dispatch` text
- Set `demoInventory: false` once real products, prices and stock are loaded. This lets search engines index the site and enables product structured data. Also replace `public/robots.txt` (instructions inside).

### 2. Products and photos — `src/data/catalog.ts`
Replace the sample products with real ones. For photos, put files in `public/products/` and set `images: [{ src: '/products/monolith-1.webp', alt: '…' }]`; any non-numeric `src` is used as a URL. Remove every Pexels stand-in before launch.

### 3. Payments — Razorpay
1. Create a Supabase project and run `supabase/schema.sql`.
2. Load products, variants (colours) and inventory into the database.
3. Deploy `supabase/functions/razorpay-create-order` and `razorpay-verify` with secrets:
   `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SITE_ORIGIN`, `SHIPPING_FLAT_PAISE`, optional `SHIPPING_FREE_ABOVE_PAISE`.
4. Set `VITE_RAZORPAY_KEY_ID` (public key id only) and `VITE_API_BASE` (functions URL) in the frontend env, and set `site.shipping.flatRate`.
5. Add a Razorpay `payment.captured` webhook as a backstop.

Live checkout switches on only when the key, API base **and** a shipping rule are all set. The server recalculates prices and stock and verifies the payment signature; the browser never sends a trusted total and never sees the key secret. "Buy Now" on product pages appears only in live mode.

### 4. Forms and newsletter
Replace `submitDemo(...)` in `src/pages/Custom.tsx` and `src/pages/Contact.tsx` with inserts into `custom_enquiries` / `contact_messages` (anon key + the RLS insert policies in the schema), or a server function that also sends an email notification. Reference images need a signed upload to the private `custom-references` bucket. For the newsletter, call your provider (with double opt-in) from the submit handler in `src/components/layout/Newsletter.tsx`, then set `site.newsletter.connected = true`.

### 5. Environment variables (`.env.example`)
`VITE_SITE_URL`, `VITE_RAZORPAY_KEY_ID`, `VITE_API_BASE`, `VITE_WHATSAPP_NUMBER`. Never put secret keys in `VITE_*` variables.

## Before launch
- Real product photos, prices, sizes, weights, stock and care details (sample values are illustrative).
- Confirm copy that describes making methods (Our Story, process section) matches how AAKAAR actually makes each piece.
- Complete and review the shipping, returns, privacy and terms templates (items in [brackets]).
- Add `public/og-image.png` (1200×630) and check the favicon.
- No customer reviews, ratings or testimonials are shown; add them only from verified orders.
- Run Lighthouse on the deployed build and check analytics/cookie consent if analytics is added.
