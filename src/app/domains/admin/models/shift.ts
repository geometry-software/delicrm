export type ShiftSummary = {
    id?: string
    totalPrice: number
    totalOrders: number
    averageOrder: number
    createdAt: number
    orders: string[]
    closedAt: number
    status: ShiftStatus
}

export type ShiftStatus = 'active'