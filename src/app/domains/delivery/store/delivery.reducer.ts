import { createReducer, on } from '@ngrx/store'
import { DeliveryActions as ItemActions } from './delivery.actions'
import { State, initialState } from './delivery.state'
import { LoadingStatus } from '../../../shared/models/loading-status'

export const reducer = createReducer<State>(
  initialState,

)
