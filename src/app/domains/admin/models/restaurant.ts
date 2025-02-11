import { CheckoutOrder } from "../../menu/models/checkout"
import { Recipe } from "../../recipe/models/recipe.model"

export type Restaurant = {
    name: string
    address: string
    description: string
    phone: string
    web: string
    locale: string
    startersAmount: number
    drinksAmount: number
    sideDishesAmount: number
    dessertAmount: number
    delivery: number
    discount: number
    closed: string
    currency: string
}

export type DailyMenu = {
    main: Array<MenuItem>
    alacarte: Array<MenuItem>
    extras: Extras
    open: boolean
    createdAt: number
    orders: Array<CheckoutOrder>
}

export type Extras = {
    starters: Array<MenuItem>
    drinks: Array<MenuItem>
    sideDishes: Array<MenuItem>
}

export type MenuItem = Recipe &
{
    eightySix?: boolean
    isAdded?: boolean
    isSkipped?: boolean
    skippedTitle?: string
}