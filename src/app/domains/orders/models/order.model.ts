import { Auth } from '../../../auth/models/auth.model'
import { MenuItem } from '../../admin/models/restaurant'
import { Delivery } from '../../delivery/models/delivery.model'
import { User } from '../../users/models/user.model'

export type Order = {
  id?: string
  main: Array<OrderItem>
  alacarte: Array<MenuItem>
  price: OrderPrice
  progress: OrderProgress
  status: OrderStatus
  comment: string
  currency: string
  category: OrderCategory
  isCreatedByUser: boolean
  createdAt?: number
  createdBy?: User
  closedAt?: number
  closedBy?: User
}

export type OrderStatusHistory = {
  status: OrderStatus
  createdBy: User | Auth
  createdAt: number
}

export type OrderItem = {
  plate: MenuItem
  starter: MenuItem
  drink: MenuItem
  sideDishes: Array<MenuItem>
  desserts: Array<MenuItem>
  name: string
}

export type OrderCategory = {
  type?: OrderType
  clientName?: string
  table?: number
  delivery?: Delivery
}

export type OrderStatus = 'dining' | 'delivery' | 'closed'

export type OrderProgress = '0%' | '60%' | '100%'

export const orderStatusProgress: Record<OrderStatus, string> = {
  dining: '60%',
  delivery: '60%',
  closed: '100%',
}

export const ordersTabIndexByStatus: Record<OrderStatus, number> = {
  dining: 0,
  delivery: 1,
  closed: 2,
}

export type OrderStatusBar = {
  status: OrderStatus,
  progress: OrderProgress
}

export type OrderPrice = {
  total: number
  order: number
  delivery: number
  alacarte: number
  currency: string
}

export type OrderStatusResponse = {
  dining: number
  delivery: number
  closed: number
}

export type OrderType = 'table' | 'delivery' | 'takeaway'

export enum ORDER_STATUS_COLOR {
  dining = '#fdb16f',
  delivery = '#fcb1fe',
  closed = '#19b7c6',
}

export enum ORDER_STATUS_ICON {
  dining = 'deck',
  delivery = 'directions_bike',
  closed = 'attach_money',
}

export enum ORDER_STATUS_TRANSLATE {
  dining = 'ORDERS.DETAIL.STATUS.DINING',
  delivery = 'ORDERS.DETAIL.STATUS.DELIVERY',
  closed = 'ORDERS.DETAIL.STATUS.CLOSED',
}