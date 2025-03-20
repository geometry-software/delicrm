import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { Order } from '../../orders/models/order.model'
import { MenuConstants } from '../utils/menu.constants'
import { Delivery } from '../../delivery/models/delivery.model'
import { Checkout } from '../models/checkout'
import { DailyMenu, MenuItem, Restaurant } from '../../admin/models/restaurant'
import { Auth } from '../../../auth/models/auth.model'

export const MenuActions = createActionGroup({
  source: MenuConstants.storeFeatureKey,
  events: {
    'Init Daily Menu': emptyProps(),
    'Init Daily Menu Success': props<{
      menu: DailyMenu,
      restaurant: Restaurant,
      alacarte: MenuItem[]
      open: boolean,
      clients: Auth[]
    }>(),
    'Set Items Loading Status': props<{ status: LoadingStatus }>(),
    'Set Order': props<{ main: MenuItem[], alacarte: MenuItem[] }>(),
    'Set Order Success': props<{ order: Order }>(),
    'Checkout Order': props<{ order: Order }>(),
    'Create Client Delivery Order': props<{ delivery: Delivery }>(),
    'Create User Delivery Order': props<{ order: Order }>(),
    'Create User Order': props<{ order: Order }>(),
    'Create Client': props<{ name: string, address: string, phone: string }>(),
    'Get Active Clients': emptyProps(),
    'Get Active Clients Success': props<{ clients: Auth[] }>(),
    'Checkout Order Success': props<{ id: string, checkout: Checkout }>(),
    'Set Daily Menu Eighty Six': props<{ id: string }>(),
    'Set Alacarte Eighty Six': props<{ id: string }>(),
    'Set Daily Menu Eighty Six Success': props<{ menu: DailyMenu }>(),
    'Set Alacarte Eighty Six Success': props<{ alacarte: MenuItem[] }>(),
  },
})