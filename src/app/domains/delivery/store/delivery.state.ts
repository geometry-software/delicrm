import { RepositoryRequesEntity, RepositoryRequestListQuery, RepositoryResponseList } from '../../../shared/repository/repository.models'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { Delivery, DeliveryStatus, DeliveryStatusResponse } from '../models/delivery.model'

export interface State {
  query: RepositoryRequestListQuery,
  items: RepositoryResponseList<Delivery>
  itemsLoadingStatus: LoadingStatus
  item: RepositoryRequesEntity<Delivery>
  itemId: string
  status: DeliveryStatus
  itemsAmountByStatus: DeliveryStatusResponse
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
  status: 'requested',
  itemsAmountByStatus: {
    requested: 0,
    confirmed: 0,
    canceled: 0,
  },
  size: null,
}
