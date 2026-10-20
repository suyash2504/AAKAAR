import { Camera } from 'lucide-react'
import { Link } from 'react-router-dom'
import { site } from '../../config/site'
import { collections } from '../../data/catalog'
import { Meaning } from '../ui/Bits'
import { Logo } from './Logo'
import { NewsletterForm } from './Newsletter'

export function Footer() {
  const { contact, social } = site
  return (
    <footer className="relative mt-24 overflow-hidden rounded-t-[40px] bg-deep text-ivory md:mt-32">
      <div className="wrap pb-8 pt-16 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="script text-[22px] text-butter">letters from the studio</p>
            <h2 className="display mt-3 max-w-[16ch] text-[clamp(40px,5vw,72px)]">A little more thoughtfulness.</h2>
            <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-ivory/75">New objects, small-batch drops and the odd behind-the-scenes note. Not too often, promise.</p>
            <div className="mt-6"><NewsletterForm dark /></div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="eyebrow mb-4 text-butter">Shop</h3>
              <ul className="grid gap-2.5 text-[15px]">
                <li><Link to="/shop" className="link-u">Shop all</Link></li>
                {collections.map((c) => <li key={c.slug}><Link to={`/collections/${c.slug}`} className="link-u">{c.name}</Link></li>)}
              </ul>
            </div>
            <div>
              <h3 className="eyebrow mb-4 text-butter">Help</h3>
              <ul className="grid gap-2.5 text-[15px]">
                <li><Link to="/shipping-returns" className="link-u">Shipping &amp; Returns</Link></li>
                <li><Link to="/contact#faq" className="link-u">FAQ &amp; Care</Link></li>
                <li><Link to="/custom-orders" className="link-u">Custom Orders</Link></li>
                <li><Link to="/contact" className="link-u">Contact</Link></li>
                <li><Link to="/wishlist" className="link-u">Wishlist</Link></li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h3 className="eyebrow mb-4 text-butter">Studio</h3>
              <ul className="grid gap-2.5 text-[15px]">
                <li><Link to="/our-story" className="link-u">Our Story</Link></li>
                {contact.email && <li><a href={`mailto:${contact.email}`} className="link-u">{contact.email}</a></li>}
                {contact.phone && <li><a href={`tel:${contact.phone}`} className="link-u">{contact.phone}</a></li>}
                {social.instagram && <li><a href={social.instagram} target="_blank" rel="noreferrer" className="link-u inline-flex items-center gap-2"><Camera size={15} /> Instagram</a></li>}
                {!contact.email && !contact.phone && <li className="text-[13.5px] text-ivory/55">Contact details coming soon</li>}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-end justify-between gap-6 border-t border-ivory/15 pt-10">
          <div>
            <Logo light size="lg" />
            <div className="mt-7 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <p className="text-[16px] font-semibold">{site.tagline}</p>
              <Meaning className="text-[19px] text-ivory/70" />
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-between gap-4 text-[13px] text-ivory/60">
          <p>© {new Date().getFullYear()} {site.fullName}. All rights reserved.</p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="/shipping-returns" className="link-u">Shipping &amp; Returns</Link>
            <Link to="/privacy-policy" className="link-u">Privacy Policy</Link>
            <Link to="/terms" className="link-u">Terms &amp; Conditions</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
