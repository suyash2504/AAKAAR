import { MotionConfig } from 'framer-motion'
import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import Home from './pages/Home'

const Shop = lazy(() => import('./pages/Shop'))
const Product = lazy(() => import('./pages/Product'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const OrderConfirmation = lazy(() => import('./pages/Checkout').then((m) => ({ default: m.OrderConfirmation })))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const Account = lazy(() => import('./pages/Account'))
const Story = lazy(() => import('./pages/Story'))
const Custom = lazy(() => import('./pages/Custom'))
const Contact = lazy(() => import('./pages/Contact'))
const Policy = lazy(() => import('./pages/Policy'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="collections/:slug" element={<Shop />} />
          <Route path="product/:slug" element={<Product />} />
          <Route path="our-story" element={<Story />} />
          <Route path="custom-orders" element={<Custom />} />
          <Route path="contact" element={<Contact />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order/:id" element={<OrderConfirmation />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="account" element={<Account />} />
          <Route path="shipping-returns" element={<Policy page="shipping-returns" />} />
          <Route path="privacy-policy" element={<Policy page="privacy" />} />
          <Route path="terms" element={<Policy page="terms" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </MotionConfig>
  )
}
