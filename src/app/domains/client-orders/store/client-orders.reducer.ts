import { createReducer, on } from '@ngrx/store'
import { ClientOrdersActions as ItemActions } from './client-orders.actions'
import { State, initialState } from './client-orders.state'

export const reducer = createReducer<State>(
  initialState,
  on(ItemActions.getItemsSuccess, (state, { items, size }) => ({
    ...state,
    items,
    size
  })),
  on(ItemActions.setItemsLoadingStatus, (state, { status }) => ({
    ...state,
    itemsLoadingStatus: status
  }))
)
