import { DeliveryInfo } from "../../domains/delivery/models/delivery.model"

export type Auth = {
  providerId: AuthProvider
  authId: string
  createdAt: number
  status: AuthStatus
  deliveryInfo: DeliveryInfo
  extra: ExtraData | null
}

export type ExtraData = {
  name: string
  email: string
  avatar: string
  locale: string
}

export type AuthStatusTotalResponse = {
  requested: number
  client: number
  employee: number
  blocked: number
}

export type AuthStatus = 'requested' | 'blocked' | 'confirmed'

export type AuthProvider = 'google' | 'firebase' | 'anonymous'