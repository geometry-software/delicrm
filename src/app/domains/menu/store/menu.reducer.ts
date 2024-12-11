import { createReducer, on } from '@ngrx/store'
import { MenuActions as ItemActions } from './menu.actions'
import { State, initialState } from './menu.state'

export const reducer = createReducer<State>(
  initialState,
  on(ItemActions.initDailyMenuSuccess, (state, { menu }) => ({
    ...state,
    menu,
    extra: menu.extra,
    open: menu.open
  })),
  on(ItemActions.setOrder, (state, { order }) => ({
    ...state,
    order
  })),
)