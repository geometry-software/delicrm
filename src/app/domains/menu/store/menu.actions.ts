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
    'Init Daily Menu Success': props<{ menu: DailyMenu, restaurant: Restaurant, open: boolean }>(),
    'Set Items Loading Status': props<{ status: LoadingStatus }>(),
    'Set Order': props<{ main: MenuItem[], alacarte: MenuItem[] }>(),
    'Set Order Success': props<{ order: Order }>(),
    'Checkout Order': props<{ order: Order }>(),
    'Create Client Delivery Order': props<{ delivery: Delivery }>(),
    'Create User Order': props<{ order: Order }>(),
    'Create User Delivery': props<{ delivery: Delivery }>(),
    'Checkout Order Success': props<{ id: string, checkout: Checkout }>(),
    'Set Eighty Six': props<{ id: string }>(),
    'Unset Eighty Six': props<{ id: string }>(),
    'Eighty Six Success': props<{ menu: DailyMenu }>(),
  },
})