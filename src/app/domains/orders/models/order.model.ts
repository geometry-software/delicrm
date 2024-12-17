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

export const orderStatusTest: Record<OrderStatus, string> = {
  requested: '0%',
  cooking: '50%',
  delivery: '80%',
  paid: '100%',
  canceled: '0%',
}

export enum OrderProgress {
  Requested = '0%',
  Cooking = '50%',
  Delivery = '80%',
  Paid = '100%',
  Canceled = '0%'
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
