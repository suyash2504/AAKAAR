// Razorpay — client half. Inactive until VITE_RAZORPAY_KEY_ID and VITE_API_BASE
// are set and supabase/functions are deployed. The server prices the order and
// verifies the payment signature; the browser never decides the amount and never
// sees the key secret.
import { site } from '../config/site'
import type { CartLine } from '../types'

// also needs a confirmed shipping rule, so the total shown always matches what the server charges
export const razorpayLive = !!(site.payments.razorpayKeyId && site.payments.apiBase && site.shipping.flatRate != null)

interface Customer { name: string; email: string; phone: string }

declare global {
  interface Window {
    Razorpay?: new (o: Record<string, unknown>) => { open: () => void }
  }
}

function loadCheckout() {
  return new Promise<void>((res, rej) => {
    if (window.Razorpay) return res()
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => res()
    s.onerror = () => rej(new Error('Could not load the payment window. Check your connection and try again.'))
    document.head.appendChild(s)
  })
}

export async function payWithRazorpay(lines: CartLine[], customer: Customer, address: object) {
  const api = site.payments.apiBase
  const created = await fetch(`${api}/razorpay-create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lines: lines.map(({ productId, colourId, qty }) => ({ productId, colourId, qty })), customer, address }),
  })
  if (!created.ok) throw new Error('We could not start the payment. Please try again.')
  const order = (await created.json()) as { razorpayOrderId: string; amount: number; currency: string; orderId: string }
  await loadCheckout()

  return new Promise<{ orderId: string }>((resolve, reject) => {
    const rz = new window.Razorpay!({
      key: site.payments.razorpayKeyId,
      order_id: order.razorpayOrderId,
      amount: order.amount,
      currency: order.currency,
      name: site.fullName,
      description: site.tagline,
      prefill: { name: customer.name, email: customer.email, contact: customer.phone },
      theme: { color: '#5B6849' },
      handler: async (resp: Record<string, string>) => {
        const v = await fetch(`${api}/razorpay-verify`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...resp, orderId: order.orderId }) })
        if (v.ok) {
          // remembered for this tab only, so the confirmation page can't be faked with a URL
          try { sessionStorage.setItem('aak-verified', order.orderId) } catch { /* ignore */ }
          resolve({ orderId: order.orderId })
        } else reject(new Error('Payment could not be verified. If money was deducted, contact us with your order number.'))
      },
      modal: { ondismiss: () => reject(new Error('Payment was cancelled.')) },
    })
    rz.open()
  })
}
