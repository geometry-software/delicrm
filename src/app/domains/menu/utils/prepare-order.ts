import { Order } from "../../orders/models/order.model";
import { Extras, MenuItem, Restaurant } from "../../admin/models/restaurant";

export const prepareOrder = (main: MenuItem[], alacarte: MenuItem[], extras: Extras, restaurant: Restaurant, isCreatedByUser: boolean) => {
    const orderPrice = main.map((a) => a.price).reduce((a, b) => a + b, 0)
    const alacartePrice = alacarte.map((a) => a.price).reduce((a, b) => a + b, 0)
    const deliveryPrice = restaurant.delivery
    const total = orderPrice + alacartePrice + deliveryPrice
    const order: Order = {
        main: main.map(plate => ({
            plate,
            name: plate.name,
            starter: null,
            drink: null,
            sideDishes: extras.sideDishes
        })),
        alacarte,
        category: {
            type: 'table'
        },
        price: {
            delivery: deliveryPrice,
            order: orderPrice,
            alacarte: alacartePrice,
            total,
            currency: restaurant.currency
        },
        comment: '',
        progress: '60%',
        status: 'dining',
        isCreatedByUser
    }
    return order
}
