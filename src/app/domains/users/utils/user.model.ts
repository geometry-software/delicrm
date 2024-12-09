import { AuthStatus, Auth } from '../../../auth/models/auth.model'
import { UserConstants } from './user.constants'

export interface User {
  auth: Auth
  name: string
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

export interface UserStatusTotalResponse {
  requested: number
  confirmed: number
  blocked: number
}

export type UserLanguage = 'en' | 'es' | 'pt'

export type UserRole = 'waiter' | 'delivery' | 'admin' | 'client'
