import { createReducer, on } from '@ngrx/store'
import { UserActions as ItemActions } from './user.actions'
import { UserStatusResponse, User } from '../models/user.model'
import { RepositoryRequesEntity, RepositoryResponseList } from '../../../shared/repository/repository.models'
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
  listLabelAmount: UserStatusResponse
  isStatusUpdated: boolean
}

export const initialState: State = {
  itemId: null,
  items: {
    data: [],
    total: 0,
    current: 0,
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
