import { Recipe } from '../../recipe/models/recipe.model'
import { User } from '../../users/utils/user.model'

export class Order {
  id?: string
  createdAt?: number
  main?: any
  extra?: any
  alacarte?: Array<Recipe>
  price?: OrderPrice
  category?: OrderCategory
  progress?: OrderProgressStatus
  status?: OrderStatusValue
  statusHistory?: Array<OrderStatus>
  plates?: Array<OrderItem>
  comment?: string
}

export class OrderStatus {
  user?: User
  status?: OrderStatusValue
  createdAt?: number
}

export class OrderItem {
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

export class OrderCategory {
  type?: OrderType
  delivery?: OrderDelivery
  table?: number
}

export type OrderStatusValue = 'requested' | 'cooking' | 'delivery' | 'paid' | 'canceled'

export type OrderProgressStatus = '60%' | '80%' | '100%'

export class OrderPrice {
  currency?: string
  total?: number
  discount?: number
  delivery?: number
}

export class OrderDelivery {
  id?: string
  time?: string
  name?: string
  phone?: string
  address?: string
  payment?: string
  change?: string
  comments?: string
}


export type OrderDeliveryTime = 'now' | 'delayed'

export type OrderType = 'table' | 'delivery' | 'takeaway'
