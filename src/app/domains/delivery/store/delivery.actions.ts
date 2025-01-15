import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { RepositoryRequest, RepositoryResponseList } from '../../../shared/repository/repository.models'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { DeliveryConstants } from '../models/delivery.constants'
import { Delivery, DeliveryStatus, DeliveryStatusHistory, DeliveryStatusResponse } from '../models/delivery.model'

export const DeliveryActions = createActionGroup({
  source: DeliveryConstants.storeFeatureKey,
  events: {
    'Get Items': props<{ request: RepositoryRequest<Delivery, DeliveryStatus> }>(),
    'Get Items By Status': props<{ status: DeliveryStatus }>(),
    'Set Items Loading Status': props<{ status: LoadingStatus }>(),
    'Update Delivery Status': props<{ id: string, status: DeliveryStatus }>(),
    'Update Delivery Status Success': props<{ status: DeliveryStatus }>(),
    'Update Delivery Status Failed': emptyProps(),
    'Get Item': props<{ id: string }>(),
    'Get Item Success': props<{ item: Delivery }>(),
    'Get Items Success': props<{ items: RepositoryResponseList<Delivery>, size?: number, }>(),
    'Set Items Amount By Status': props<{ status: DeliveryStatus, amount: DeliveryStatusResponse }>(),
    'Notify Error': props<{ error: Error }>(),
  },
})
