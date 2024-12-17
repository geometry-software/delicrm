import { createReducer, on } from '@ngrx/store'
import { OrderActions as ItemActions } from './order.actions'
import { State, initialState } from './order.state'

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
  })),
  on(ItemActions.setItemsAmountByStatus, (state, { amount, status }) => ({
    ...state,
    itemsAmountByStatus: amount,
    status
  })),
  on(ItemActions.getItemSuccess, (state, { item }) => ({
    ...state,
    item: {
      data: item,
    },
  })),
  on(ItemActions.updateOrderStatusSuccess, (state, { statusBar }) => ({
    ...state,
    statusBar,
  }))
)
