import { Auth } from '../../../auth/models/auth.model'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { DailyMenu, Extras, MenuItem, Restaurant } from '../../admin/models/restaurant'
import { Order } from '../../orders/models/order.model'
import { CheckoutOrder } from '../models/checkout'

export interface State {
  open: boolean
  menu: DailyMenu
  extras: Extras
  restaurant: Restaurant
  order: Order
  orders: CheckoutOrder[]
  alacarte: MenuItem[]
  clients: Auth[]
  loadingStatus: LoadingStatus
}

export const initialState: State = {
  open: false,
  menu: null,
  extras: null,
  restaurant: null,
  order: null,
  orders: null,
  alacarte: [],
  clients: [],
  loadingStatus: LoadingStatus.NotLoaded
}