export type Auth = {
  authId: string
  createdAt: number
  status: AuthStatus
  locale: string
  name: string
  phone: string
  address: string
  email: string
  avatar: string
  deliveries: string[]
}

export type AuthStatusResponse = {
  auth: number
  requested: number
  active: number
  blocked: number
}

export type AuthStatus = 'auth' | 'requested' | 'active' | 'blocked'

export type AuthProvider = 'google' | 'firebase' | 'anonymous'