import { RepositoryRequesEntity, RepositoryResponseList } from '../../../shared/repository/repository.models'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { Order, OrderStatus, OrderStatusResponse } from '../../orders/models/order.model'
// import { Order, OrderStatus, OrderStatusResponse } from '../models/order.model'

export interface State {
  items: RepositoryResponseList<Order>
  itemsLoadingStatus: LoadingStatus
  item: RepositoryRequesEntity<Order>
  itemId: string
  listResponseType: any
  resetRequest: boolean
  requestStatus: OrderStatus
  itemAmountByStatus: OrderStatusResponse
  isStatusUpdated: boolean
}

export const initialState: State = {
  itemId: null,
  items: {
    data: [],
    total: 0,
    current: 0,
  },
  itemsLoadingStatus: LoadingStatus.NotLoaded,
  item: {
    data: null,
  },
  listResponseType: null,
  resetRequest: null,
  itemAmountByStatus: {
    cooking: 0,
    delivery: 0,
    paid: 0,
    canceled: 0,
  },
  isStatusUpdated: null,
  requestStatus: null,
}
