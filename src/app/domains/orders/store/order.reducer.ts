import { createReducer, on } from '@ngrx/store'
import { OrderActions as ItemActions } from './order.actions'
import { State, initialState } from './order.state'
import { LoadingStatus } from '../../../shared/models/loading-status'

export const reducer = createReducer<State>(
  initialState,
  // on(ItemActions.getItems, (state, { request }) => ({
  //   ...state
  // })),
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
  on(ItemActions.createItem, (state) => ({
    ...state,
    item: {
      data: state.item?.data,
      loading: true,
    },
  })),
  on(ItemActions.updateItem, (state) => ({
    ...state,
    item: {
      data: state.item?.data,
      loading: true,
    },
  })),
  on(ItemActions.updateOrderStatusSuccess, (state, { statusBar }) => ({
    ...state,
    statusBar,
  }))
)
