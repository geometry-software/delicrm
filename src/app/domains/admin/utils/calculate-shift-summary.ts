import { getCurrentUnixTime } from "../../../shared/utils/format-unix-time"
import { CheckoutOrder } from "../../menu/models/checkout"
import { Shift } from "../models/shift"

export const calculateShiftSummary = (orders: CheckoutOrder[], createdAt: number): Shift => {
    const totalPrice = orders.map(el => el.total).reduce((sum, total) => sum + total, 0)
    const totalOrders = orders.length
    const averageOrder = totalPrice / totalOrders
    const ids = orders.map(el => el.id)
    return {
        totalPrice,
        totalOrders,
        averageOrder,
        createdAt,
        closedAt: getCurrentUnixTime(),
        orders: ids,
        status: 'active'
    }
}