// Supabase Edge Function (Deno). NOT DEPLOYED — reference implementation.
// Prices the bag from the database (never from the browser), checks stock,
// records a pending order and creates the matching Razorpay order.
// Secrets: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
//          SITE_ORIGIN, SHIPPING_FLAT_PAISE, SHIPPING_FREE_ABOVE_PAISE (optional)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

const cors = { 'Access-Control-Allow-Origin': Deno.env.get('SITE_ORIGIN') ?? '', 'Access-Control-Allow-Headers': 'content-type' }
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
const isPhone = (v: string) => /^(?:\+?91|0)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, ''))

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors })
  try {
    const { lines, customer, address } = await req.json()
    if (!Array.isArray(lines) || lines.length === 0 || lines.length > 30) throw new Error('bad bag')
    if (!customer?.name || !isEmail(String(customer.email)) || !isPhone(String(customer.phone))) throw new Error('bad customer')
    if (!address?.line1 || !address?.city || !address?.state || !/^[1-9]\d{5}$/.test(String(address.pin))) throw new Error('bad address')
    const flat = Deno.env.get('SHIPPING_FLAT_PAISE')
    if (flat == null) throw new Error('shipping not configured') // never charge without a confirmed rule
    const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    // 1. price and stock-check every line on the server
    let subtotal = 0
    const items = []
    for (const l of lines) {
      const qty = Number(l.qty)
      if (!Number.isInteger(qty) || qty < 1 || qty > 10) throw new Error('bad qty')
      const { data: p } = await db.from('products').select('id, price_paise, active').eq('id', l.productId).single()
      if (!p || !p.active) throw new Error('unavailable product')
      const { data: v } = await db.from('product_variants').select('id, price_delta_paise, inventory(quantity)').eq('product_id', p.id).eq('code', l.colourId).single()
      if (!v) throw new Error('bad variant')
      const stock = (v.inventory as { quantity: number | null } | null)?.quantity
      if (stock != null && stock < qty) throw new Error('not enough stock')
      const unit = p.price_paise + v.price_delta_paise
      subtotal += unit * qty
      items.push({ product_id: p.id, variant_id: v.id, qty, unit_paise: unit })
    }

    // 2. shipping from the configured rule
    const freeAbove = Deno.env.get('SHIPPING_FREE_ABOVE_PAISE')
    const shipping = freeAbove != null && subtotal >= Number(freeAbove) ? 0 : Number(flat)
    const total = subtotal + shipping

    // 3. pending order
    const { data: cust } = await db.from('customer_profiles').insert({ name: String(customer.name).slice(0, 120), email: customer.email, phone: customer.phone }).select('id').single()
    const number = `AAK-${Date.now().toString(36).toUpperCase()}`
    const { data: order, error } = await db.from('orders').insert({
      number, customer_id: cust!.id, subtotal_paise: subtotal, shipping_paise: shipping, total_paise: total,
      shipping_address: { line1: address.line1, line2: address.line2 ?? '', city: address.city, state: address.state, pin: address.pin },
    }).select('id').single()
    if (error) throw error
    await db.from('order_items').insert(items.map((i) => ({ ...i, order_id: order!.id })))

    // 4. Razorpay order for exactly that amount
    const auth = btoa(`${Deno.env.get('RAZORPAY_KEY_ID')}:${Deno.env.get('RAZORPAY_KEY_SECRET')}`)
    const rz = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: total, currency: 'INR', receipt: number }),
    })
    if (!rz.ok) throw new Error('razorpay order failed')
    const rzOrder = await rz.json()
    await db.from('orders').update({ razorpay_order_id: rzOrder.id }).eq('id', order!.id)

    return Response.json({ orderId: number, razorpayOrderId: rzOrder.id, amount: total, currency: 'INR' }, { headers: cors })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Could not create the order.' }, { status: 400, headers: cors })
  }
})
