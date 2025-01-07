import { LoadingStatus } from '../../../shared/models/loading-status'
import { DailyMenu, Extras, MenuItem, Restaurant } from '../../admin/models/restaurant'
import { Order } from '../../orders/models/order.model'
import { Recipe } from '../../recipe/models/recipe.model'

export interface State {
  open: boolean
  menu: DailyMenu
  extras: Extras
  restaurant: Restaurant
  order: Order
  loadingStatus: LoadingStatus
}

export const initialState: State = {
  open: false,
  menu: null,
  extras: null,
  restaurant: null,
  order: null,
  loadingStatus: LoadingStatus.NotLoaded
}