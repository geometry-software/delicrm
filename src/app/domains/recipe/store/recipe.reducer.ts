import { createReducer, on } from '@ngrx/store'
import { Recipe } from '../models/recipe.model'
import { RecipeActions as ItemActions } from './recipe.actions'
import { RepositoryRequesEntity, RepositoryResponseList } from '../../../shared/repository/repository.models'
import { initialState, State } from './recipe.state'

export const reducer = createReducer<State>(
  initialState,

)