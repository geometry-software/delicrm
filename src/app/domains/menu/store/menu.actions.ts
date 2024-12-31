import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { Order } from '../../orders/models/order.model'
import { MenuConstants } from '../utils/menu.constants'
import { Delivery } from '../../delivery/models/delivery.model'
import { Checkout } from '../models/checkout'

export const MenuActions = createActionGroup({
  source: MenuConstants.storeFeatureKey,
  events: {
    'Init Daily Menu': emptyProps(),
    'Init Daily Menu Success': props<{ menu: any }>(),
    'Set Items Loading Status': props<{ status: LoadingStatus }>(),
    'Set Order': props<{ main: any, alacarte: any }>(),
    'Set Order Success': props<{ order: Order }>(),
    'Create Delivery Order': props<{ delivery: Delivery }>(),
    'Create Table Order': props<{ order: Order }>(),
    'Checkout Order Success': props<{ id: string, checkout: Checkout }>(),
  },
})