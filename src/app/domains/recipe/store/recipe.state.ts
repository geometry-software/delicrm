import { createReducer, on } from '@ngrx/store'
import { Recipe } from '../models/recipe.model'
import { RecipeActions as ItemActions } from './recipe.actions'
import { RepositoryRequesEntity, RepositoryResponseList } from '../../../shared/repository/repository.models'
import { LoadingStatus } from '../../../shared/models/loading-status'

export interface State {
  item: RepositoryRequesEntity<Recipe>
  itemId: string
  items: RepositoryResponseList<Recipe>
  loadingStatus: LoadingStatus
  listResponseType: any
  resetRequest: boolean
}

export const initialState: State = {
  item: {
    data: null,
  },
  itemId: null,
  items: {
    data: [],
    total: 0,
    current: 0,
  },
  loadingStatus: LoadingStatus.NotLoaded,
  listResponseType: null,
  resetRequest: null,
}
