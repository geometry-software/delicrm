import { RepositoryRequesEntity, RepositoryRequestListQuery, RepositoryResponseList } from '../../../../shared/repository/repository.models'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { ShiftStatus, Shift } from '../../models/shift'

export interface State {
  query: RepositoryRequestListQuery,
  items: RepositoryResponseList<Shift>
  itemsLoadingStatus: LoadingStatus
  item: RepositoryRequesEntity<Shift>
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