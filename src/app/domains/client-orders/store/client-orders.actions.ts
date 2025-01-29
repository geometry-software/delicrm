import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { RepositoryRequest, RepositoryResponseList } from '../../../shared/repository/repository.models'
import { ClientOrdersConstants } from '../models/client-orders.constants'
import { Delivery, DeliveryStatus } from '../../delivery/models/delivery.model'
import { LoadingStatus } from '../../../shared/models/loading-status'

export const ClientOrdersActions = createActionGroup({
  source: ClientOrdersConstants.storeFeatureKey,
  events: {
    'Get Items': emptyProps(),
    'Get Items Success': props<{ items: RepositoryResponseList<Delivery>, size?: number, }>(),
    'Set Items Loading Status': props<{ status: LoadingStatus }>(),
    'Notify Error': props<{ error: Error }>(),
  }
})
