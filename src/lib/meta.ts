import { useEffect } from 'react'
import { site } from '../config/site'

interface Meta {
  title: string
  description?: string
  image?: string
  path?: string
  jsonLd?: object
  noindex?: boolean
}

function setTag(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

/** Page title, description, Open Graph, canonical and optional JSON-LD. */
export function useMeta({ title, description = site.description, image = '/og-image.png', path, jsonLd, noindex }: Meta) {
  const ld = jsonLd ? JSON.stringify(jsonLd) : ''
  useEffect(() => {
    const full = title === site.name ? `${site.fullName} — ${site.tagline}` : `${title} · ${site.fullName}`
    document.title = full
    const url = site.url + (path ?? location.pathname)
    setTag('name', 'description', description)
    setTag('property', 'og:title', full)
    setTag('property', 'og:description', description)
    setTag('property', 'og:image', image.startsWith('http') ? image : site.url + image)
    setTag('property', 'og:url', url)
    setTag('name', 'twitter:card', 'summary_large_image')
    // sample inventory stays out of search indexes until real products are configured
    setTag('name', 'robots', noindex || site.demoInventory ? 'noindex' : 'index,follow')
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = url
    let script: HTMLScriptElement | null = null
    if (ld) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = ld
      document.head.appendChild(script)
    }
    return () => script?.remove()
  }, [title, description, image, path, ld, noindex])
}
