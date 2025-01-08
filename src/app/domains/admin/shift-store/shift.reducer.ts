import { createReducer, on } from '@ngrx/store'
import { ShiftActions as ItemActions } from './shift.actions'
import { State, initialState } from './shift.state'

export const shiftReducer = createReducer<State>(
  initialState,
  on(ItemActions.getItemsSuccess, (state, { items, size }) => ({
    ...state,
    items,
    size
  })),
  on(ItemActions.setItemsLoadingStatus, (state, { status }) => ({
    ...state,
    itemsLoadingStatus: status
  })),
  on(ItemActions.getItemSuccess, (state, { item }) => ({
    ...state,
    item: {
      data: item,
    },
  })),
)
