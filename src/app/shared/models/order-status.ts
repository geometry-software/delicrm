
export enum ORDER_STATUS_COLOR {
    dining = '#fdb16f',
    delivery = '#fcb1fe',
    closed = '#19b7c6',
    requested = '#fdb16f',
    confirmed = '#fdb16f',
    accepted = '#fdb16f',
    ontheway = '#fdb16f',
    received = '#fdb16f'
}

export enum ORDER_STATUS_ICON {
    dining = 'deck',
    delivery = 'directions_bike',
    closed = 'attach_money',
    requested = 'directions_bike',
    confirmed = 'directions_bike',
    accepted = 'directions_bike',
    ontheway = 'directions_bike',
    received = 'directions_bike',
}

export enum ORDER_STATUS_TRANSLATE {
    dining = 'ORDERS.DETAIL.STATUS.DINING',
    delivery = 'ORDERS.DETAIL.STATUS.DELIVERY',
    closed = 'ORDERS.DETAIL.STATUS.CLOSED',
    requested = 'DELIVERY.STATUS.REQUESTED',
    confirmed = 'DELIVERY.STATUS.CONFIRMED',
    accepted = 'DELIVERY.STATUS.ACCEPTED',
    ontheway = 'DELIVERY.STATUS.ONTHEWAY',
    received = 'DELIVERY.STATUS.RECEIVED',
}

export type OrderStatus =
    'dining' |
    'delivery' |
    'closed' |
    'requested' |
    'confirmed' |
    'accepted' |
    'ontheway' |
    'received'

export const orderStatusRecord: Record<OrderStatus, OrderStatus> = {
    dining: 'dining',
    delivery: 'delivery',
    requested: 'requested',
    confirmed: 'confirmed',
    accepted: 'accepted',
    ontheway: 'ontheway',
    received: 'received',
    closed: 'closed',
}

export type OrderStatusInput = {
    status: OrderStatus, list: string[]
}