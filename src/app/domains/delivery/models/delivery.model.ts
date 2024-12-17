import { Order } from '../../orders/models/order.model'
import { User } from '../../users/models/user.model'

export type Delivery = {
  id?: string
  createdAt: number
  order: Order
  user: User
  client: any
  status: DeliveryStatus
  statusHistory: DeliveryStatusHistory[]
}

export type DeliveryStatus = 'requested' | 'confirmed' | 'canceled'

export type DeliveryStatusHistory = {
  user: User
  status: DeliveryStatus
  createdAt: number
}

export type DeliveryStatusResponse = {
  requested: number
  confirmed: number
  canceled: number
}

// export enum OrderProgress { '0%', '50%', '80%', '100%' }

// export const orderStatusProgress: Record<DeliveryStatus, keyof typeof OrderProgress> = {
//   requested: '0%',
//   confirmed: '100%',
//   canceled: '100%',
// }

// export type OrderStatusBar = {
//   status: OrderStatus,
//   progress: OrderProgress
// }