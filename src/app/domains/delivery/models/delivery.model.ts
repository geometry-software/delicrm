import { Auth } from '../../../auth/models/auth.model'
import { Order } from '../../orders/models/order.model'
import { User } from '../../users/models/user.model'

export type Delivery = {
  id?: string
  orderId?: string
  order?: Order
  deliveryInfo?: DeliveryInfo
  status?: DeliveryStatus
  createdAt: number
  createdByClient: Auth | null
  createdByUser: User | null
  confirmed?: DeliveryStatusStamp
  accepted?: DeliveryStatusStamp
  ontheway?: DeliveryStatusStamp
  received?: DeliveryStatusStamp
  closedAt?: number
  closedBy?: User
}

export type DeliveryInfo = {
  name: string
  phone: string
  address: string
  time: DeliveryTime
  delayedTime: string | null
  payment: DeliveryPayment
  change: string | null
}

export type DeliveryTime = 'now' | 'delayed'

export type DeliveryPayment = 'cash' | 'card'

export type DeliveryStatus = 'requested' | 'confirmed' | 'accepted' | 'ontheway' | 'received' | 'closed'

export const deliveryTabIndexByStatus: Record<DeliveryStatus, number> = {
  requested: 0,
  confirmed: 1,
  accepted: 2,
  ontheway: 3,
  received: 4,
  closed: 5
}

export type DeliveryStatusResponse = {
  requested: number
  confirmed: number
  accepted: number
  ontheway: number
  received: number
  closed: number
}

export enum DeliveryProgress { '0%', '30%', '50%', '70%', '90%', '100%' }

export const deliveryStatusProgress: Record<DeliveryStatus, keyof typeof DeliveryProgress> = {
  requested: '0%',
  confirmed: '30%',
  accepted: '50%',
  ontheway: '70%',
  received: '90%',
  closed: '100%'
}

export type DeliveryStatusBar = {
  status: DeliveryStatus,
  progress: DeliveryProgress
}

export type DeliveryStatusStamp = {
  status: DeliveryStatus,
  createdBy: User,
  createdAt: number
}