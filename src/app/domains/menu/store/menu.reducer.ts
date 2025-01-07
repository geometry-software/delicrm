import { createReducer, on } from '@ngrx/store'
import { MenuActions as ItemActions } from './menu.actions'
import { State, initialState } from './menu.state'
import { prepareExtras } from '../utils/prepare-extras'

export const reducer = createReducer<State>(
  initialState,
  on(ItemActions.initDailyMenuSuccess, (state, { menu, restaurant }) => ({
    ...state,
    menu,
    restaurant,
    extras: prepareExtras(menu),
    open: menu?.open
  })),
  on(ItemActions.setOrderSuccess, (state, { order }) => ({
    ...state,
    order
  })),
  on(ItemActions.setItemsLoadingStatus, (state, { status }) => ({
    ...state,
    loadingStatus: status
  })),
)