export type Auth = {
  authId: string
  createdAt: number
  status: AuthStatus
  locale: string
  name: string
  phone: string
  address: string
  deliveries: string[]
  createdByUserName: string | false
  email?: string
  avatar?: string
}

export type AuthStatusResponse = {
  auth: number
  requested: number
  active: number
  blocked: number
}

export type AuthStatus = 'auth' | 'requested' | 'active' | 'blocked'

export type AuthProvider = 'google' | 'firebase' | 'anonymous'