import { LoadingStatus } from '../../../../shared/models/loading-status'
import { Recipe } from '../../../recipe/models/recipe.model'
import { DailyMenu, MenuItem, Restaurant } from '../../models/restaurant'
import { RestaurantConstants } from '../../models/restaurant.constants'

export interface State {
  print: boolean,
  loadingStatus: LoadingStatus
  restaurant: Restaurant
  recipes: Recipe[]
  alacarte: MenuItem[]
  rebuildMenu: boolean
  menu: DailyMenu
  open: boolean
}

export const initialState: State = {
  print: false,
  loadingStatus: LoadingStatus.NotLoaded,
  restaurant: null,
  recipes: [],
  alacarte: [],
  rebuildMenu: null,
  menu: RestaurantConstants.initialMenu,
  open: null
}