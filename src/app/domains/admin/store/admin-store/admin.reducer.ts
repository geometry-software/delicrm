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
  on(ItemActions.setRestaurantInfo, (state, { restaurant }) => ({
    ...state,
    restaurant,
  })),
  on(ItemActions.setDailyMenu, (state, { menu }) => ({
    ...state,
    menu,
  })),
  on(ItemActions.closeShiftSuccess, (state) => ({
    ...state,
    menu: null
  }))
)