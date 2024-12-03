import { createReducer, on } from '@ngrx/store'
import { AuthActions as ItemActions } from './user.actions'
import { AuthStatusTotalResponse, AppUser } from '../utils/user.model'
import { RepositoryRequesEntity, RepositoryResponseList } from '../../../shared/repository/repository.model'
import { formatPaginationData } from '../../../shared/repository/repository.utils'
import { AuthStatus } from '../../../auth/models/auth.model'
import { LoadingStatus } from '../../../shared/models/loading-status'

export interface State {
  items: RepositoryResponseList<AppUser>
  itemsLoadingStatus: LoadingStatus
  item: RepositoryRequesEntity<AppUser>
  itemId: string
  listResponseType: any
  resetRequest: boolean
  requestStatus: AuthStatus
  listLabelAmount: AuthStatusTotalResponse
  isStatusUpdated: boolean
}

export const initialState: State = {
  itemId: null,
  items: {
    data: null,
    total: null,
    current: null,
    size: null,
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
