import { LoadingStatus } from '../../../shared/models/loading-status'
import { Order } from '../utils/menu.model'

export interface State {
  open: boolean
  menu: any
  extra: any
  order: Order
  loadingStatus: LoadingStatus
}

export const initialState: State = {
  open: false,
  menu: null,
  extra: null,
  order: null,
  loadingStatus: LoadingStatus.NotLoaded
}