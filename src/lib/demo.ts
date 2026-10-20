import { load, save } from './storage'

export type DemoKind = 'custom-enquiry' | 'contact' | 'order'

// No backend is connected yet. Demo submissions are kept in this browser only so
// every flow can be tested end to end, and the UI says so plainly. Replace these
// calls with real API requests (see README) before launch.
export async function submitDemo(kind: DemoKind, data: object) {
  await new Promise((r) => setTimeout(r, 900))
  const key = `aak-demo-${kind}`
  const list = load<object[]>(key, [])
  const id = `${kind === 'order' ? 'DEMO' : 'ENQ'}-${Date.now().toString(36).toUpperCase()}`
  list.unshift({ id, at: new Date().toISOString(), ...data })
  save(key, list.slice(0, 20))
  return id
}

export function readDemo<T>(kind: DemoKind): T[] {
  return load<T[]>(`aak-demo-${kind}`, [])
}
