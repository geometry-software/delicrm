import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { FilterRequest, RepositoryRequestQuery, RepositoryRequest, RepositoryRequestListQuery } from '../../../shared/repository/repository.models'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { DeliveryConstants } from '../models/delivery.constants'
import { Order, OrderStatus, OrderStatusResponse } from '../../orders/models/order.model'
// import { Order, OrderStatus, OrderStatusResponse } from '../models/order.model'

export const DeliveryActions = createActionGroup({
  source: DeliveryConstants.storeFeatureKey,
  events: {
    'Get Items': props<{ request: RepositoryRequest<Order, OrderStatus> }>(),
    'Set Items Loading Status': props<{ status: LoadingStatus }>(),
    'Create Item': props<{ item: Order }>(),
    'Update Order Status': props<{ id: string, status: OrderStatus }>(),
    'Update Order Status Failed': emptyProps(),
    'Update Order Status Success': emptyProps(),
    'Create Item Success': props<{ response: any; total: number }>(),
    'Update Item': props<{ item: Order; id: string }>(),
    'Update Item Success': emptyProps(),
    'Get Item': props<{ id: string }>(),
    'Get Item Success': props<{ item: Order }>(),
    'Get Items By Search Query': props<{ request: FilterRequest }>(),
    'Get Items Success': props<{
      items: Order[]
      query: RepositoryRequestListQuery
      total?: number
      size?: number
      itemAmountByStatus?: OrderStatusResponse
    }>(),
    'Notify Error': props<{ error: Error; errorType: RepositoryRequestQuery }>(),
    'Reset Request To The First Page': emptyProps(),
    'Reset State': emptyProps(),
  },
})
