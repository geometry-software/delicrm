import { AuthStatus, Auth } from '../../../auth/models/auth.model'

export type User = {
  userId: string
  status: AuthStatus
  role: UserRole
  locale: string
  name: string
  email: string
  avatar: string
  createdAt: number
}

export const usersTabIndexByStatus: Record<AuthStatus, number> = {
  auth: 0,
  requested: 1,
  active: 2,
  blocked: 3
}

export type UserStatusResponse = {
  auth: number
  requested: number
  active: number
  blocked: number
}

export type UserLanguage = 'en' | 'es' | 'pt'

export type UserRole = 'waiter' | 'delivery' | 'admin' | 'client'