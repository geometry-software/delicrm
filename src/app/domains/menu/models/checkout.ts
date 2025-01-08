export type Checkout = 'order' | 'delivery'

export enum PaymentType {
    Cash = 'cash',
    Card = 'card',
}

export type CheckoutOrder = {
    id: string,
    total: number,
}