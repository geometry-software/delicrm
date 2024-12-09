import { createReducer, on } from '@ngrx/store'
import { ClientActions as ItemActions } from './client.actions'
import { RepositoryRequesEntity, RepositoryResponseList } from '../../../shared/repository/repository.model'
import { formatPaginationData } from '../../../shared/repository/repository.utils'
import { AuthStatus } from '../../../auth/models/auth.model'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { Client, ClientStatusTotalResponse } from '../models/client.model'

export interface State {
  items: RepositoryResponseList<Client>
  itemsLoadingStatus: LoadingStatus
  item: RepositoryRequesEntity<Client>
  itemId: string
  listResponseType: any
  resetRequest: boolean
  requestStatus: AuthStatus
  listLabelAmount: ClientStatusTotalResponse
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
    active: 0,
    blocked: 0,
  },
  isStatusUpdated: null,
  requestStatus: null,
}
