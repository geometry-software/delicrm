import { Order, OrderProgress } from "../../orders/models/order.model";
import { getCurrentUnixTime } from "../../../shared/utils/format-unix-time";

export const prepareOrder = (main: any[], alacarte) => {
    const createdAt = getCurrentUnixTime()
    const orderPrice = main.map((a) => a.price).reduce((a, b) => a + b, 0)
    const alacartePrice = alacarte.map((a) => a.price).reduce((a, b) => a + b, 0)
    const deliveryPrice = 5
    const total = orderPrice + alacartePrice + deliveryPrice
    const order: Order = {
        main: main.map(plate => ({
            plate,
            name: plate.name,
            starter: { name: null, id: null },
            drink: { name: null, id: null },
            garnish: { name: null, id: null },
            rice: { name: null, id: null },
            salad: { name: null, id: null },
            dessert: { name: null, id: null }
        })),
        alacarte,
        createdAt,
        // TODO
        // USER
        // statusHistory: [
        //     {
        //         createdAt,
        //         user,
        //         status: "delivery"
        //     }
        // ],
        statusHistory: [],
        category: {
            type: 'table',
        },
        price: {
            currency: '$',
            delivery: deliveryPrice,
            order: orderPrice,
            alacarte: alacartePrice,
            total
        },
        comment: '',
        progress: '0%',
        status: 'requested',
    }
    return order
}
