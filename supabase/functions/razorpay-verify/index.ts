// Supabase Edge Function (Deno). NOT DEPLOYED — reference implementation.
// Verifies the Razorpay payment signature with the key secret before an order is
// marked paid, then decrements stock. Also configure the Razorpay `payment.captured`
// webhook as a backstop for shoppers who close the tab mid-payment.
// Secrets: RAZORPAY_KEY_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SITE_ORIGIN
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

const cors = { 'Access-Control-Allow-Origin': Deno.env.get('SITE_ORIGIN') ?? '', 'Access-Control-Allow-Headers': 'content-type' }

async function hmacHex(secret: string, msg: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(msg))
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let r = 0
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return r === 0
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors })
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()
  const expected = await hmacHex(Deno.env.get('RAZORPAY_KEY_SECRET')!, `${razorpay_order_id}|${razorpay_payment_id}`)
  if (!razorpay_signature || !safeEqual(expected, String(razorpay_signature))) {
    return Response.json({ ok: false }, { status: 400, headers: cors })
  }
  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { data: order, error } = await db
    .from('orders')
    .update({ status: 'paid', razorpay_payment_id, paid_at: new Date().toISOString() })
    .eq('razorpay_order_id', razorpay_order_id)
    .eq('status', 'pending_payment')
    .select('id')
    .single()
  if (error || !order) return Response.json({ ok: false }, { status: 409, headers: cors })

  // decrement tracked stock for each item (null quantity = made to order, untouched)
  const { data: items } = await db.from('order_items').select('variant_id, qty').eq('order_id', order.id)
  for (const it of items ?? []) {
    const { data: inv } = await db.from('inventory').select('quantity').eq('variant_id', it.variant_id).maybeSingle()
    if (inv?.quantity != null) await db.from('inventory').update({ quantity: Math.max(0, inv.quantity - it.qty), updated_at: new Date().toISOString() }).eq('variant_id', it.variant_id)
  }
  return Response.json({ ok: true }, { headers: cors })
})
