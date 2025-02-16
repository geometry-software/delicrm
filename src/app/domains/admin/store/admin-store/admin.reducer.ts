import { createReducer, on } from '@ngrx/store'
import { AdminActions as ItemActions } from './admin.actions'
import { initialState, State } from './admin.state'

export const reducer = createReducer<State>(
  initialState,
  on(ItemActions.setItemsLoadingStatus, (state, { status }) => ({
    ...state,
    loadingStatus: status,
  })),
  on(ItemActions.printMenu, (state) => ({
    ...state,
    print: true,
  })),
  on(ItemActions.printMenuSuccess, (state) => ({
    ...state,
    print: false,
  })),
  on(ItemActions.setBoardInfo, (state, { restaurant, recipes, open, alacarte }) => ({
    ...state,
    restaurant,
    recipes,
    alacarte,
    open
  })),
  on(ItemActions.setDailyMenu, (state, { menu }) => ({
    ...state,
    menu,
  })),
  on(ItemActions.closeShiftSuccess, (state) => ({
    ...state,
    menu: null
  })),
  on(ItemActions.rebuildDailyMenu, (state) => ({
    ...state,
    rebuildMenu: false
  })),
  on(ItemActions.rebuildDailyMenuSuccess, (state) => ({
    ...state,
    rebuildMenu: true
  })),
)