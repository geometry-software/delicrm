import { RepositoryRequestListQuery, RepositoryResponseList } from '../../../shared/repository/repository.models'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { Auth, AuthStatus, AuthStatusResponse } from '../../../auth/models/auth.model'
import { Delivery } from '../../delivery/models/delivery.model'

export interface State {
  query: RepositoryRequestListQuery,
  items: RepositoryResponseList<Auth>
  loadingStatus: LoadingStatus
  deliveries: Delivery[]
  itemId: string
  status: AuthStatus
  itemsAmountByStatus: AuthStatusResponse
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
  loadingStatus: LoadingStatus.NotLoaded,
  deliveries: null,
  status: 'active',
  itemsAmountByStatus: {
    auth: 0,
    requested: 0,
    active: 0,
    blocked: 0
  },
  size: null,
}
