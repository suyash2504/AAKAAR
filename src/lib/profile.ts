import { load, save } from './storage'

// Guest profile kept on this device only. When accounts are switched on
// (Supabase Auth), this becomes the signed-in customer's saved details.
export interface Profile {
  name: string
  email: string
  phone: string
  line1: string
  line2: string
  city: string
  state: string
  pin: string
}

const KEY = 'aak-profile'
export const emptyProfile: Profile = { name: '', email: '', phone: '', line1: '', line2: '', city: '', state: '', pin: '' }

export const loadProfile = (): Profile => ({ ...emptyProfile, ...load<Partial<Profile>>(KEY, {}) })
export const saveProfile = (p: Profile) => save(KEY, p)
export const clearProfile = () => save(KEY, {})
export const hasProfile = (p: Profile) => Object.values(p).some((v) => v.trim())
