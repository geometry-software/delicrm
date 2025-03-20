import { RepositoryRequesEntity, RepositoryRequestListQuery, RepositoryResponseList } from '../../../shared/repository/repository.models'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { Delivery } from '../../delivery/models/delivery.model'

export interface State {
  query: RepositoryRequestListQuery,
  items: RepositoryResponseList<Delivery>
  itemsLoadingStatus: LoadingStatus
  item: RepositoryRequesEntity<Delivery>
  itemId: string
  size: number
}

export const initialState: State = {
  query: 'first',
  itemId: null,
  items: {
    data: null,
    total: 0,
    current: 0
  },
  itemsLoadingStatus: LoadingStatus.NotLoaded,
  item: {
    data: null,
  },
  size: null,
}
