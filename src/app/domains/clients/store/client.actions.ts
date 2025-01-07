import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { ClientStatusResponse } from '../models/client.model'
import { ClientConstants } from '../models/client.constants'
import { FilterRequest, RepositoryRequestQuery, RepositoryRequest, RepositoryRequestListQuery, RepositoryResponseList } from '../../../shared/repository/repository.models'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { Auth, AuthStatus } from '../../../auth/models/auth.model'

export const ClientActions = createActionGroup({
  source: ClientConstants.storeFeatureKey,
  events: {
    'Get Items': props<{ request: RepositoryRequest<Auth, AuthStatus> }>(),
    'Get Items By Status': props<{ status: AuthStatus }>(),
    'Set Items Loading Status': props<{ status: LoadingStatus }>(),
    'Update Client Status': props<{ id: string, status: AuthStatus }>(),
    'Update Client Status Failed': emptyProps(),
    'Update Client Status Success': emptyProps(),
    'Get Item': props<{ id: string }>(),
    'Get Item Success': props<{ item: Auth }>(),
    'Get Items Success': props<{ items: RepositoryResponseList<Auth>, size?: number }>(),
    'Set Items Amount By Status': props<{ status: AuthStatus, amount: ClientStatusResponse }>(),
    'Notify Error': props<{ error: Error; query: RepositoryRequestQuery }>(),
  },
})
