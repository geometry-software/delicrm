import { createReducer, on } from '@ngrx/store'
import { UserActions as ItemActions } from './user.actions'
import { UserStatusResponse, User, UserStatus } from '../models/user.model'
import { RepositoryRequesEntity, RepositoryRequestListQuery, RepositoryResponseList } from '../../../shared/repository/repository.models'
import { AuthStatus } from '../../../auth/models/auth.model'
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
