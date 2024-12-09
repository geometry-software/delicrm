export interface Client {
  authId: string
  name: string
  createdAt: number
  status: ClientStatus
  orders: Array<string>
}

export interface ClientStatusTotalResponse {
  active: number
  blocked: number
}

export type ClientStatus = 'active' | 'blocked' 