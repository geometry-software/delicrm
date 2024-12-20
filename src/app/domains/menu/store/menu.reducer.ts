import { createReducer, on } from '@ngrx/store'
import { MenuActions as ItemActions } from './menu.actions'
import { State, initialState } from './menu.state'
import { prepareExtras } from '../utils/prepare-extras'

export const reducer = createReducer<State>(
  initialState,
  on(ItemActions.initDailyMenuSuccess, (state, { menu }) => ({
    ...state,
    menu,
    extra: prepareExtras(menu),
    open: menu?.open
  })),
  on(ItemActions.setOrderSuccess, (state, { order }) => ({
    ...state,
    order
  })),
)