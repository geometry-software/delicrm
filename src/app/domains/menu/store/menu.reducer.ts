import { createReducer, on } from '@ngrx/store'
import { MenuActions as ItemActions } from './menu.actions'
import { State, initialState } from './menu.state'
import { prepareExtras } from '../utils/prepare-extras'

export const reducer = createReducer<State>(
  initialState,
  on(ItemActions.initDailyMenuSuccess, (state, { menu, restaurant, open, alacarte, clients }) => ({
    ...state,
    menu,
    restaurant,
    open,
    alacarte,
    clients,
    extras: prepareExtras(menu),
  })),
  on(ItemActions.setOrderSuccess, (state, { order }) => ({
    ...state,
    order
  })),
  on(ItemActions.setItemsLoadingStatus, (state, { status }) => ({
    ...state,
    loadingStatus: status
  })),
  on(ItemActions.setDailyMenuEightySixSuccess, (state, { menu }) => ({
    ...state,
    menu
  })),
  on(ItemActions.setAlacarteEightySixSuccess, (state, { alacarte }) => ({
    ...state,
    alacarte
  })),
  on(ItemActions.getActiveClientsSuccess, (state, { clients }) => ({
    ...state,
    clients
  })),
)