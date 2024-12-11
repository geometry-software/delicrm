import { createReducer, on } from '@ngrx/store'
import { AdminActions as ItemActions } from './admin.actions'
import { LoadingStatus } from '../../../shared/models/loading-status'

export interface State {
  print: boolean,
  loadingStatus: LoadingStatus
}

export const initialState: State = {
  print: false,
  loadingStatus: LoadingStatus.NotLoaded
}