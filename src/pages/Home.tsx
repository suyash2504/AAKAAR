import { Bestsellers, CustomCallout, FindYourForm, Gallery, Materials, Philosophy, Process, ShopBySpace, Signature } from '../components/home/Sections'
import { Hero } from '../components/home/Hero'
import { site } from '../config/site'
import { useMeta } from '../lib/meta'

export default function Home() {
  useMeta({
    title: site.name,
    path: '/',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: site.fullName,
      url: site.url,
      slogan: site.tagline,
      description: site.description,
    },
  })
  return (
    <>
      <Hero />
      <FindYourForm />
      <Bestsellers />
      <Materials />
      <Signature />
      <Process />
      <Philosophy />
      <ShopBySpace />
      <CustomCallout />
      <Gallery />
    </>
  )
}
