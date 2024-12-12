import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { FilterRequest, RepositoryEntityAction, RepositoryRequest, RepositoryRequestQuery } from '../../../shared/repository/repository.model'
import { AuthStatus } from '../../../auth/models/auth.model'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { Order } from '../../orders/models/order.model'
import { MenuConstants } from '../utils/menu.constants'

export const MenuActions = createActionGroup({
  source: MenuConstants.storeFeatureKey,
  events: {
    'Init Daily Menu': emptyProps(),
    'Init Daily Menu Success': props<{ menu: any }>(),
    'Set Items Loading Status': props<{ status: LoadingStatus }>(),
    'Set Order': props<{ order: Order }>(),
    'Create Delivery Order': props<{ order: Order }>(),
    'Create Table Order': props<{ order: Order }>(),
    'Create Order Success': props<{ id: string }>(),
  },
})