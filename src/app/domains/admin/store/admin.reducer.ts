import { createReducer, on } from '@ngrx/store'
import { Recipe } from '../utils/admin.model'
import { AdminActions as ItemActions } from './admin.actions'
import { RepositoryRequesEntity, RepositoryResponseList } from 'src/app/shared/repository/repository.model'
import { formatPaginationData } from 'src/app/shared/repository/repository.utils'

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
