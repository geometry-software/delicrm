export type Auth = {
  providerId: AuthProvider
  authId: string
  createdAt: number
  status: AuthStatus
  authDelivery: AuthDelivery
  name: string | null
  locale: string
  userRequest: UserRequest | null
}

export type UserRequest = {
  email: string
  avatar: string
}

export type AuthDelivery = {
  phone: string
  address: string
}

export type AuthStatusTotalResponse = {
  requested: number
  client: number
  employee: number
  blocked: number
}

export type AuthStatus = 'requested' | 'blocked' | 'active'

export type AuthProvider = 'google' | 'firebase' | 'anonymous'