export interface Auth {
  displayName: string
  providerId: AuthProvider
  email: string
  authId: string
  createdAt: number
  status: AuthStatus
  avatar: string
  locale: string
}

export interface AuthStatusTotalResponse {
  requested: number
  client: number
  employee: number
  blocked: number
}

export type AuthStatus = 'requested' | 'blocked' | 'confirmed'
export type AuthProvider = 'google' | 'firebase' | 'anonymous'