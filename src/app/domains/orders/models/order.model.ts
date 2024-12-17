import { Recipe } from '../../recipe/models/recipe.model'
import { User } from '../../users/models/user.model'

export type Order = {
  id?: string
  createdAt?: number
  main?: any
  extra?: any
  alacarte?: Array<Recipe>
  price?: OrderPrice
  category?: OrderCategory
  progress?: OrderProgress
  status?: OrderStatus
  statusHistory?: Array<OrderStatusHistory>
  plates?: Array<OrderItem>
  comment?: string
}

export type OrderStatusHistory = {
  user?: User
  status?: OrderStatus
  createdAt?: number
}

export type OrderItem = {
  type: string
  name: string
  plate: Recipe
  starter: Recipe
  drink: Recipe
  garnish: Recipe
  rice: Recipe
  salad: Recipe
  dessert: Recipe
}

export type OrderCategory = {
  type?: OrderType
  delivery?: OrderDelivery
  table?: number
}

export type OrderStatus = 'requested' | 'cooking' | 'delivery' | 'paid' | 'canceled'

export enum OrderProgress { '0%', '50%', '80%', '100%' }

export const orderStatusProgress: Record<OrderStatus, keyof typeof OrderProgress> = {
  requested: '0%',
  cooking: '50%',
  delivery: '80%',
  paid: '100%',
  canceled: '100%',
}

export type OrderStatusBar = {
  status: OrderStatus,
  progress: OrderProgress
}

export type OrderPrice = {
  currency?: string
  total?: number
  discount?: number
  delivery?: number
}

export type OrderDelivery = {
  id?: string
  time?: string
  name?: string
  phone?: string
  address?: string
  payment?: string
  change?: string
  comments?: string
}

export type OrderStatusResponse = {
  cooking: number
  delivery: number
  paid: number
  canceled: number
}

export type OrderDeliveryTime = 'now' | 'delayed'

export type OrderType = 'table' | 'delivery' | 'takeaway'

export enum ORDER_STATUS_COLOR {
  cooking = '#fdb16f',
  delivery = '#fcb1fe',
  paid = '#19b7c6',
  canceled = '#ff5c47',
}

export enum ORDER_STATUS_ICON {
  cooking = 'skillet',
  delivery = 'directions_bike',
  paid = 'attach_money',
  canceled = 'delete_forever',
}

export enum ORDER_STATUS_TRANSLATE {
  cooking = 'Cooking',
  delivery = 'In Delivery',
  paid = 'Paid',
  canceled = 'Canceled',
}