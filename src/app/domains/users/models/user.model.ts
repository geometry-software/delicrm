import { AuthStatus, Auth } from '../../../auth/models/auth.model'

export type User = {
  auth: Auth
  name: string
  email: string
  avatar: string
  role: UserRole
  locale: string
  createdAt: number
  status: AuthStatus
}

export const usersTabIndexByStatus: Record<AuthStatus, number> = {
  active: 0,
  requested: 1,
  blocked: 2
}

export type UserStatusResponse = {
  requested: number
  active: number
  blocked: number
}

export type UserLanguage = 'en' | 'es' | 'pt'

export type UserRole = 'waiter' | 'delivery' | 'admin' | 'client'