import { UserStatusResponse, User, UserStatus } from '../models/user.model'
import { RepositoryRequesEntity, RepositoryRequestListQuery, RepositoryResponseList } from '../../../shared/repository/repository.models'
import { LoadingStatus } from '../../../shared/models/loading-status'

export interface State {
  query: RepositoryRequestListQuery,
  items: RepositoryResponseList<User>
  itemsLoadingStatus: LoadingStatus
  item: RepositoryRequesEntity<User>
  itemId: string
  status: UserStatus
  itemsAmountByStatus: UserStatusResponse
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
  itemsAmountByStatus: {
    requested: 0,
    active: 0,
    blocked: 0
  },
  size: null,
}
