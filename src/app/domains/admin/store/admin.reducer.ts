import { createReducer, on } from '@ngrx/store'
import { AdminActions as ItemActions } from './admin.actions'

export interface State {
  print: boolean
}

const initialState: State = {
  print: false,
}

export const reducer = createReducer<State>(
  initialState,
  on(ItemActions.printMenu, (state, { print }) => ({
    ...state,
    print,
  }))
)
