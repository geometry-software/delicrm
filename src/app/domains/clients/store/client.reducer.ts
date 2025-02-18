import { createReducer, on } from '@ngrx/store'
import { ClientActions as ItemActions } from './client.actions'
import { State, initialState } from './client.state'
import { LoadingStatus } from '../../../shared/models/loading-status'

export const reducer = createReducer<State>(
  initialState,
  on(ItemActions.getItemsSuccess, (state, { items, size }) => ({
    ...state,
    items,
    size
  })),
  on(ItemActions.setItemsAmountByStatus, (state, { amount, status }) => ({
    ...state,
    itemsAmountByStatus: amount,
    status
  })),
  on(ItemActions.setItemsLoadingStatus, (state, { status }) => ({
    ...state,
    loadingStatus: status
  })),
  on(ItemActions.setItemsAmountByStatus, (state, { amount, status }) => ({
    ...state,
    itemsAmountByStatus: amount,
    status
  })),
  on(ItemActions.getDeliveriesSuccess, (state, { deliveries }) => ({
    ...state,
    deliveries
  })),
  on(ItemActions.resetClientForm, (state) => ({
    ...state,
    deliveries: null
  })),
)