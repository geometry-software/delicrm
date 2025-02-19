import { CheckoutOrder } from "../../menu/models/checkout"
import { Recipe } from "../../recipe/models/recipe.model"

export type Restaurant = {
    name: string
    address: string
    description: string
    phone: string
    web: string
    // locale: string
    delivery: number
    closedTitle: string
    titleFontSize: string
    currency: string
}

export type RestaurantInfo = {
    restaurant: Restaurant,
    open: boolean
}

export type DailyMenu = {
    createdAt: number
    main: Array<MenuItem>
    extras: Extras
    extrasAmount: ExtrasAmount
}

export type Extras = {
    starters: Array<MenuItem>
    drinks: Array<MenuItem>
    sideDishes: Array<MenuItem>
    desserts: Array<MenuItem>
}

export type MenuItem = Recipe & {
    currency?: string
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