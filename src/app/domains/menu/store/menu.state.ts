import { LoadingStatus } from '../../../shared/models/loading-status'
import { DailyMenu, Extras, Restaurant } from '../../admin/models/restaurant'
import { Order } from '../../orders/models/order.model'
import { CheckoutOrder } from '../models/checkout'

export interface State {
  open: boolean
  menu: DailyMenu
  extras: Extras
  restaurant: Restaurant
  order: Order
  orders: CheckoutOrder[]
  loadingStatus: LoadingStatus
}

export const initialState: State = {
  open: false,
  menu: null,
  extras: null,
  restaurant: null,
  order: null,
  orders: null,
  loadingStatus: LoadingStatus.NotLoaded
}