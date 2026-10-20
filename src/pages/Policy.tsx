import { Link } from 'react-router-dom'
import { site } from '../config/site'
import { useMeta } from '../lib/meta'

type Page = 'shipping-returns' | 'privacy' | 'terms'

const titles: Record<Page, string> = {
  'shipping-returns': 'Shipping & Returns',
  privacy: 'Privacy Policy',
  terms: 'Terms & Conditions',
}

const contactLine = site.contact.email ? <a href={`mailto:${site.contact.email}`} className="font-bold text-moss underline underline-offset-4">{site.contact.email}</a> : <Link to="/contact" className="font-bold text-moss underline underline-offset-4">our contact page</Link>

function Shipping() {
  return (
    <>
      <h2>Where we ship</h2>
      <p>[To be confirmed by AAKAAR] The areas we deliver to within India, and any locations we cannot serve.</p>
      <h2>Shipping charges</h2>
      <p>{site.shipping.flatRate != null ? `Standard shipping is ₹${site.shipping.flatRate}${site.shipping.freeAbove != null ? `, and free on orders of ₹${site.shipping.freeAbove} or more` : ''}.` : '[To be confirmed by AAKAAR] Delivery charges are not set yet. They will be shown at checkout before you pay.'}</p>
      <h2>Dispatch &amp; delivery times</h2>
      <p>{site.shipping.dispatch} Made-to-order and custom pieces take longer; we confirm their timeline before production.</p>
      <h2>Packaging</h2>
      <p>[To be confirmed by AAKAAR] How fragile cement and resin pieces are packed for transit.</p>
      <h2>Damaged in transit</h2>
      <p>[To be confirmed by AAKAAR] What to do if a piece arrives damaged, for example: record an unboxing video and contact us within a stated number of days with photos and your order number.</p>
      <h2>Returns &amp; exchanges</h2>
      <p>[To be confirmed by AAKAAR] Whether returns or exchanges are accepted, the time window, item condition, who pays return shipping, and which items are excluded (for example custom or personalised pieces).</p>
      <h2>Refunds</h2>
      <p>[To be confirmed by AAKAAR] How and when approved refunds are issued to the original payment method.</p>
      <h2>Natural variation</h2>
      <p>Cast cement has small air pockets and tonal variation, and resin pieces with inclusions vary slightly. These are part of the material and are not treated as defects.</p>
      <h2>Questions</h2>
      <p>Write to {contactLine} with your order number.</p>
    </>
  )
}

function Privacy() {
  return (
    <>
      <h2>Who we are</h2>
      <p>{site.fullName} ("AAKAAR", "we") runs this website. [Legal business name, address and grievance officer details to be added by AAKAAR.]</p>
      <h2>What we collect</h2>
      <ul>
        <li>Details you give us: name, email, phone and delivery address when you check out, and anything you write in contact or custom order forms.</li>
        <li>Order details: products, quantities and amounts.</li>
        <li>Payment: handled by our payment provider (for example Razorpay). We do not see or store your full card details.</li>
        <li>Your bag, wishlist and recently viewed items are stored in your own browser (local storage) so they are there when you return.</li>
      </ul>
      <h2>How we use it</h2>
      <ul>
        <li>To process, deliver and support your orders and enquiries.</li>
        <li>To send emails you asked for, such as order updates or, with your consent, the newsletter.</li>
        <li>To keep the website secure and working well.</li>
      </ul>
      <h2>Sharing</h2>
      <p>We share only what is needed with service providers who help us run the shop, such as payment, delivery, hosting and email providers. We do not sell your personal data.</p>
      <h2>Your choices</h2>
      <p>You can ask to access, correct or delete your personal data, and you can unsubscribe from emails at any time. Contact {contactLine}.</p>
      <h2>Retention</h2>
      <p>[To be confirmed by AAKAAR] How long order and enquiry records are kept, for example as required for tax and accounting.</p>
      <h2>Changes</h2>
      <p>We may update this policy. The latest version will always be on this page.</p>
    </>
  )
}

function Terms() {
  return (
    <>
      <h2>About these terms</h2>
      <p>These terms apply when you browse or buy from {site.fullName}. [Legal business name and registered address to be added by AAKAAR.]</p>
      <h2>Products &amp; photos</h2>
      <p>We describe and photograph our products as accurately as we can. Cast cement and resin vary naturally, so colour, texture and small details may differ slightly from photos.</p>
      <h2>Prices &amp; payment</h2>
      <p>Prices are in Indian Rupees (INR). The final amount, including any delivery charges, is shown before you pay and is confirmed by our server at checkout. Payments are processed by our payment provider.</p>
      <h2>Orders</h2>
      <p>An order is confirmed only after successful payment, or after AAKAAR confirms an order placed via WhatsApp. We may cancel and refund an order if an item is unavailable or a pricing error occurs.</p>
      <h2>Custom orders</h2>
      <p>Custom work starts only after you approve a written quote. [Terms for deposits, changes and cancellations of custom orders to be added by AAKAAR.]</p>
      <h2>Shipping, returns &amp; refunds</h2>
      <p>See our <Link to="/shipping-returns" className="font-bold text-moss underline underline-offset-4">Shipping &amp; Returns</Link> page.</p>
      <h2>Intellectual property</h2>
      <p>Designs, text and images on this site belong to AAKAAR or are used with permission, and may not be copied without consent.</p>
      <h2>Governing law</h2>
      <p>[To be confirmed by AAKAAR] These terms are governed by the laws of India; jurisdiction to be specified.</p>
    </>
  )
}

export default function Policy({ page }: { page: Page }) {
  const title = titles[page]
  useMeta({ title, description: `${title} for ${site.fullName}.` })
  return (
    <div className="wrap max-w-4xl pt-4">
      <p className="eyebrow text-moss">Customer care</p>
      <h1 className="display mt-3 text-[clamp(46px,7vw,100px)]">{title}</h1>
      <p className="note-box note-demo mt-6"><strong>Template:</strong> this page is a starting draft and must be reviewed and completed by AAKAAR (and ideally a legal adviser) before launch. Items in [brackets] still need business details.</p>
      <div className="prose-aak mt-4 rounded-[32px] bg-ivory p-6 ring-1 ring-line sm:p-10">
        {page === 'shipping-returns' ? <Shipping /> : page === 'privacy' ? <Privacy /> : <Terms />}
      </div>
    </div>
  )
}
