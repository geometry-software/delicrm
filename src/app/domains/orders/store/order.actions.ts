import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { RepositoryRequestQuery, RepositoryRequest, RepositoryResponseList } from '../../../shared/repository/repository.models'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { OrderConstants } from '../models/order.constants'
import { Order, OrderProgress, OrderStatus, OrderStatusBar, OrderStatusResponse } from '../models/order.model'
import { Restaurant } from '../../admin/models/restaurant'

export const OrderActions = createActionGroup({
  source: OrderConstants.storeFeatureKey,
  events: {
    'Get Items': props<{ request: RepositoryRequest<Order, OrderStatus> }>(),
    'Get Items By Status': props<{ status: OrderStatus }>(),
    'Set Items Loading Status': props<{ status: LoadingStatus }>(),
    'Get Restaurant Info': emptyProps(),
    'Set Restaurant Info': props<{ restaurant: Restaurant }>(),
    'Update Order Status': props<{ id: string, status: OrderStatus, progress: OrderProgress }>(),
    'Update Order Status Failed': emptyProps(),
    'Update Order Status Success': props<{ statusBar: OrderStatusBar }>(),
    'Get Item': props<{ id: string }>(),
    'Get Item Success': props<{ item: Order }>(),
    'Get Items Success': props<{ items: RepositoryResponseList<Order>, size?: number, }>(),
    'Set Items Amount By Status': props<{ status: OrderStatus, amount: OrderStatusResponse }>(),
    'Notify Error': props<{ error: Error; errorType: RepositoryRequestQuery }>(),
  },
})
