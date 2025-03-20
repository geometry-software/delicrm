export type User = {
  userId: string
  status: UserStatus
  role: UserRole
  locale: string
  name: string
  email: string
  avatar: string
  createdAt: number
}

export const usersTabIndexByStatus: Record<UserStatus, number> = {
  active: 0,
  requested: 1,
  blocked: 2
}

export type UserStatusResponse = {
  requested: number
  active: number
  blocked: number
}

export type UserStatus = 'requested' | 'active' | 'blocked'

export type UserLanguage = 'en' | 'es' | 'pt' | 'ru'

export type UserRole = 'waiter' | 'delivery' | 'admin'