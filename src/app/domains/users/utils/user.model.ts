import { AuthUser } from '../../../auth/models/auth.model'
import { UserConstants } from './user.constants'

export interface AppUser {
  auth: AuthUser
  name: string
  role: UserRole
  locale?: string
  createdAt?: number
}

export interface AuthStatusTotalResponse {
  requested: number
  client: number
  employee: number
  blocked: number
}

export type AuthStatus = 'requested' | 'client' | 'employee' | 'blocked'
export type UserRole = 'waiter' | 'delivery' | 'admin' | 'client'