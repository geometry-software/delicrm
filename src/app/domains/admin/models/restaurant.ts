import { Order } from "../../orders/models/order.model"
import { Recipe } from "../../recipe/models/recipe.model"

export type Restaurant = {
    name: string
    address: string
    description: string
    phone: string
    delivery: number
    discount: number
    currency: string
}

export type DailyMenu = {
    main: Array<MenuItem>
    extras: Extras
    open: boolean
    createdAt: number
    orders: Array<Order>
}

export type Extras = {
    starters: Array<MenuItem>
    drinks: Array<MenuItem>
    garnish: MenuItem
    rice: MenuItem
    salad: MenuItem
    dessert: MenuItem
}

export type MenuItem = Recipe & { eightySix: boolean }