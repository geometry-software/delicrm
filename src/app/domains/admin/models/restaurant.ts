import { Order } from "../../menu/utils/menu.model"

export type Restaurant = {
    name: string
    address: string
    description: string
    phone: string
    delivery: string
    discount: string
    currency: string
}

export type DailyMenu = {
    main: any
    extra: any
    open: boolean
    createdAt: number
    orders: Array<Order>
}