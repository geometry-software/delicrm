import { RepositoryRequesEntity, RepositoryRequestListQuery, RepositoryResponseList } from '../../../shared/repository/repository.models'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { Order, OrderStatus, OrderStatusResponse } from '../models/order.model'

export interface State {
  query: RepositoryRequestListQuery,
  items: RepositoryResponseList<Order>
  itemsLoadingStatus: LoadingStatus
  item: RepositoryRequesEntity<Order>
  itemId: string
  status: OrderStatus
  itemsAmountByStatus: OrderStatusResponse
  size: number
}

export const initialState: State = {
  query: 'first',
  itemId: null,
  items: {
    data: [],
    total: 0,
    current: 0
  },
  itemsLoadingStatus: LoadingStatus.NotLoaded,
  item: {
    data: null,
  },
  status: 'cooking',
  itemsAmountByStatus: {
    cooking: 0,
    delivery: 0,
    paid: 0,
    canceled: 0,
  },
  size: null,
}
