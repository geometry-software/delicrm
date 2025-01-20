import { RepositoryRequesEntity, RepositoryRequestListQuery, RepositoryResponseList } from '../../../shared/repository/repository.models'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { Order, OrderStatus, OrderStatusBar, OrderStatusResponse } from '../models/order.model'
import { Restaurant } from '../../admin/models/restaurant'

export interface State {
  restaurant: Restaurant
  query: RepositoryRequestListQuery,
  items: RepositoryResponseList<Order>
  itemsLoadingStatus: LoadingStatus
  item: RepositoryRequesEntity<Order>
  itemLoadingStatus: LoadingStatus
  itemId: string
  status: OrderStatus
  itemsAmountByStatus: OrderStatusResponse
  size: number
  statusBar: OrderStatusBar
}

export const initialState: State = {
  restaurant: null,
  query: 'first',
  itemId: null,
  items: {
    data: [],
    total: 0,
    current: 0
  },
  itemsLoadingStatus: LoadingStatus.NotLoaded,
  itemLoadingStatus: LoadingStatus.NotLoaded,
  item: {
    data: null,
  },
  status: 'dining',
  itemsAmountByStatus: {
    dining: 0,
    delivery: 0,
    closed: 0,
  },
  size: null,
  statusBar: null
}
