import { CheckoutOrder } from "../../menu/models/checkout"
import { Recipe } from "../../recipe/models/recipe.model"

export type Restaurant = {
    name: string
    address: string
    description: string
    phone: string
    web: string
    locale: string
    delivery: number
    closed: string
    currency: string
}

export type DailyMenu = {
    main: Array<MenuItem>
    extras: Extras
    open: boolean
    createdAt: number
    extrasAmount: ExtrasAmount
    orders: Array<CheckoutOrder>
    alacarte?: Array<MenuItem>
}

export type Extras = {
    starters: Array<MenuItem>
    drinks: Array<MenuItem>
    sideDishes: Array<MenuItem>
    desserts: Array<MenuItem>
}

export type MenuItem = Recipe & {
    eightySix?: boolean
    isAdded?: boolean
    isSkipped?: boolean
    skippedTitle?: string
}

export type ExtrasAmount = {
    starters: number
    drinks: number
    sideDishes: number
    desserts: number
}