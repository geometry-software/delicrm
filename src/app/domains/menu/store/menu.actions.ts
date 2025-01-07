import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { Order } from '../../orders/models/order.model'
import { MenuConstants } from '../utils/menu.constants'
import { Delivery } from '../../delivery/models/delivery.model'
import { Checkout } from '../models/checkout'
import { DailyMenu, MenuItem, Restaurant } from '../../admin/models/restaurant'

export const MenuActions = createActionGroup({
  source: MenuConstants.storeFeatureKey,
  events: {
    'Init Daily Menu': emptyProps(),
    'Init Daily Menu Success': props<{ menu: DailyMenu, restaurant: Restaurant }>(),
    'Set Items Loading Status': props<{ status: LoadingStatus }>(),
    'Set Order': props<{ main: MenuItem[], alacarte: MenuItem[] }>(),
    'Set Order Success': props<{ order: Order }>(),
    'Create Delivery Order': props<{ delivery: Delivery }>(),
    'Create Table Order': props<{ order: Order }>(),
    'Checkout Order Success': props<{ id: string, checkout: Checkout }>(),
  },
})