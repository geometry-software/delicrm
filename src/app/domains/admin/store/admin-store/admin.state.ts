import { LoadingStatus } from '../../../../shared/models/loading-status'
import { DailyMenu, Restaurant } from '../../models/restaurant'

export interface State {
  print: boolean,
  loadingStatus: LoadingStatus
  restaurant: Restaurant
  menu: DailyMenu
}

export const initialState: State = {
  print: false,
  loadingStatus: LoadingStatus.NotLoaded,
  restaurant: null,
  menu: null
}