import { createReducer, on } from '@ngrx/store'
import { BoardActions as ItemActions } from './board.actions'
import { initialState, State } from './board.state'

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
  on(ItemActions.setBoardInfo, (state, { menu, restaurant, recipes, open, alacarte }) => ({
    ...state,
    menu,
    restaurant,
    recipes,
    alacarte,
    open
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