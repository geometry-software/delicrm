import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { ClientStatusTotalResponse, Client, ClientStatus } from '../models/client.model'
import { ClientConstants } from '../utils/client.constants'
import { FilterRequest, RepositoryEntityAction, RepositoryRequest, RepositoryRequestQuery } from '../../../shared/repository/repository.model'
import { LoadingStatus } from '../../../shared/models/loading-status'

export const ClientActions = createActionGroup({
  source: ClientConstants.storeFeatureKey,
  events: {
    'Get Items': props<{ request: RepositoryRequest<Client, ClientStatus> }>(),
    'Set Items Loading Status': props<{ status: LoadingStatus }>(),
    'Create Item': props<{ item: Client }>(),
    'Update Client Status': props<{ id: string, status: ClientStatus }>(),
    'Update Client Status Failed': emptyProps(),
    'Update Client Status Success': emptyProps(),
    'Create Item Success': props<{ response: any; total: number }>(),
    'Update Item': props<{ item: Client; id: string }>(),
    'Update Item Success': emptyProps(),
    'Get Item': props<{ id: string }>(),
    'Get Item Success': props<{ item: Client }>(),
    'Get Items By Search Query': props<{ request: FilterRequest }>(),
    'Get Items Success': props<{
      items: Client[]
      query: RepositoryRequestQuery
      total?: number
      size?: number
      listLabelAmount?: ClientStatusTotalResponse
    }>(),
    'Notify Error': props<{ error: Error; errorType: RepositoryEntityAction }>(),
    'Reset Request To The First Page': emptyProps(),
    'Reset State': emptyProps(),
  },
})
