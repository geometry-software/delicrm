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

export enum UserLoadingStatus {
  NotLoaded = 'NotLoaded',
  Loading = 'Loading',
  LoadingFailed = 'LoadingFailed',
  LoadingSuccess = 'LoadingSuccess'
}

export type UserStatusResponse = {
  requested: number
  confirmed: number
  blocked: number
}

export type UserLanguage = 'en' | 'es' | 'pt'

export type UserRole = 'waiter' | 'delivery' | 'admin' | 'client'