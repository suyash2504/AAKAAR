// Product and editorial photos. Numeric ids are Pexels stand-ins (free licence);
// any other value is treated as a URL, so real photos drop in without code changes.
const isPexels = (src: string) => /^\d+$/.test(src)

export function photoUrl(src: string, w = 800) {
  if (!isPexels(src)) return src
  return `https://images.pexels.com/photos/${src}/pexels-photo-${src}.jpeg?auto=compress&cs=tinysrgb&w=${w}`
}

export function photoSrcSet(src: string, widths = [400, 700, 1000, 1400]) {
  if (!isPexels(src)) return undefined
  return widths.map((w) => `${photoUrl(src, w)} ${w}w`).join(', ')
}
