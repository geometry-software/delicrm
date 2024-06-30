import { createActionGroup, emptyProps, props } from '@ngrx/store'
import {
  FilterRequest,
  RepositoryEntityAction,
  RepositoryRequest,
  RepositoryRequestQuery,
  RepositoryResponseEntity,
} from 'src/app/shared/repository/repository.model'
import { DeliveryConstants } from '../utils/delivery.constants'
import { Order, OrderStatusValue } from '../../menu/utils/waiter.model'

export const DeliveryActions = createActionGroup({
  source: DeliveryConstants.storeFeatureKey,
  events: {
    'Create Item Form Init': emptyProps(),
    'Create Item': props<{ item: Order }>(),
    'Create Item Success': emptyProps(),
    'Update Item': props<{ item: Order; id: string }>(),
    'Update Item Success': emptyProps(),
    'Delete Item': props<{ id: string }>(),
    'Delete Item Success': emptyProps(),
    'Get Item': props<{ id: string }>(),
    'Get Item Success': props<{ item: Order }>(),
    'Get Items': props<{ request: RepositoryRequest<Order, OrderStatusValue> }>(),
    'Get Items By Search Query': props<{ request: FilterRequest }>(),
    'Get Items Success': props<{ items: Order[]; query: RepositoryRequestQuery; total?: number; size?: number }>(),
    'Notify Error': props<{ error: Error; errorType: RepositoryEntityAction }>(),
    'Reset Request To The First Page': emptyProps(),
    'Reset State': emptyProps(),
  },
})
