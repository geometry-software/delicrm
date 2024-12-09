import { createReducer, on } from '@ngrx/store'
import { UserActions as ItemActions } from './user.actions'
import { UserStatusTotalResponse, User } from '../utils/user.model'
import { RepositoryRequesEntity, RepositoryResponseList } from '../../../shared/repository/repository.model'
import { formatPaginationData } from '../../../shared/repository/repository.utils'
import { AuthStatus } from '../../../auth/models/auth.model'
import { LoadingStatus } from '../../../shared/models/loading-status'

export interface State {
  items: RepositoryResponseList<User>
  itemsLoadingStatus: LoadingStatus
  item: RepositoryRequesEntity<User>
  itemId: string
  listResponseType: any
  resetRequest: boolean
  requestStatus: AuthStatus
  listLabelAmount: UserStatusTotalResponse
  isStatusUpdated: boolean
}

export const initialState: State = {
  itemId: null,
  items: {
    data: [],
    total: 0,
    current: 0,
    size: 0,
    error: null,
  },
  itemsLoadingStatus: LoadingStatus.NotLoaded,
  item: {
    data: null,
  },
  listResponseType: null,
  resetRequest: null,
  listLabelAmount: {
    requested: 0,
    confirmed: 0,
    blocked: 0,
  },
  isStatusUpdated: null,
  requestStatus: null,
}
