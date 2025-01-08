import { LoadingStatus } from '../../../shared/models/loading-status'
import { Restaurant } from '../models/restaurant'

export interface State {
  print: boolean,
  loadingStatus: LoadingStatus
  restaurant: Restaurant
}

export const initialState: State = {
  print: false,
  loadingStatus: LoadingStatus.NotLoaded,
  restaurant: null
}