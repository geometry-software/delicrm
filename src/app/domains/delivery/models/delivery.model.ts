import { Auth } from '../../../auth/models/auth.model'
import { Order } from '../../orders/models/order.model'
import { User } from '../../users/models/user.model'

export type Delivery = {
  id?: string
  orderId?: string
  order?: Order
  authId?: string
  deliveryInfo?: DeliveryInfo
  status?: DeliveryStatus
  progress?: DeliveryProgress
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

export enum DELIVERY_STATUS_COLOR {
  requested = '#fdb16f',
  confirmed = '#fdb16f',
  accepted = '#fdb16f',
  ontheway = '#fdb16f',
  received = '#fdb16f',
  closed = '#fdb16f',
}

export enum DELIVERY_STATUS_ICON {
  requested = 'directions_bike',
  confirmed = 'directions_bike',
  accepted = 'directions_bike',
  ontheway = 'directions_bike',
  received = 'directions_bike',
  closed = 'directions_bike',
}

export enum DELIVERY_STATUS_TRANSLATE {
  requested = 'DELIVERY.STATUS.REQUESTED',
  confirmed = 'DELIVERY.STATUS.CONFIRMED',
  accepted = 'DELIVERY.STATUS.ACCEPTED',
  ontheway = 'DELIVERY.STATUS.ONTHEWAY',
  received = 'DELIVERY.STATUS.RECEIVED',
  closed = 'DELIVERY.STATUS.CLOSED',
}