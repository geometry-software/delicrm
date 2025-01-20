import { createReducer, on } from '@ngrx/store'
import { OrderActions as ItemActions } from './order.actions'
import { State, initialState } from './order.state'
import { LoadingStatus } from '../../../shared/models/loading-status'

export const reducer = createReducer<State>(
  initialState,
  on(ItemActions.setRestaurantInfo, (state, { restaurant }) => ({
    ...state,
    restaurant,
  })),
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
  on(ItemActions.getItem, (state) => ({
    ...state,
    itemLoadingStatus: LoadingStatus.Loading
  })),
  on(ItemActions.getItemSuccess, (state, { item }) => ({
    ...state,
    item: {
      data: item,
    },
    itemLoadingStatus: LoadingStatus.Loaded
  })),
  on(ItemActions.getItemSuccess, (state, { item }) => ({
    ...state,
    item: {
      data: item,
    },
    itemLoadingStatus: LoadingStatus.Loaded
  })),
  on(ItemActions.updateOrderStatusSuccess, (state, { statusBar }) => ({
    ...state,
    statusBar,
  }))
)
