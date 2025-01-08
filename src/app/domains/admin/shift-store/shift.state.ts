import { RepositoryRequesEntity, RepositoryRequestListQuery, RepositoryResponseList } from '../../../shared/repository/repository.models'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { ShiftStatus, ShiftSummary } from '../models/shift'

export interface State {
  query: RepositoryRequestListQuery,
  items: RepositoryResponseList<ShiftSummary>
  itemsLoadingStatus: LoadingStatus
  item: RepositoryRequesEntity<ShiftSummary>
  itemId: string
  status: ShiftStatus
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
  status: 'active',
  size: null,
}