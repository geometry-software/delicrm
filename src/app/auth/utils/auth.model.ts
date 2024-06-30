import { AuthConstants } from './auth.constants'

export interface AuthUser {
  name?: string
  provider?: string
  providerId?: string
  phone?: string
  uid?: string
  email?: string
  avatar?: string
  locale?: string
  status?: AuthStatus
  timestamp?: Date
  role?: AuthRole
}

export interface Restaurant {
  name?: string
  address?: string
  phone?: string
  deliveryPrice?: number
  discountPrice?: number
}

export interface AuthStatusTotalResponse {
  requested: number
  client: number
  employee: number
  blocked: number
}

export type AuthProvider = 'google' | 'facebook' | 'apple' | 'anonymous'

export type AuthStatus = 'requested' | 'client' | 'employee' | 'blocked'

export type AuthRole = 'requested' | 'waiter' | 'delivery' | 'admin' | 'client'
