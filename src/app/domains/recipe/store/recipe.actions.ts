import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { Recipe, RecipeStatus } from '../utils/recipe.model'
import {
  FilterRequest,
  RepositoryEntityAction,
  RepositoryRequest,
  RepositoryRequestQuery,
  RepositoryResponseEntity,
} from 'src/app/shared/repository/repository.model'
import { RecipeConstants } from '../utils/recipe.constants'

export const RecipeActions = createActionGroup({
  source: RecipeConstants.storeFeatureKey,
  events: {
    'Create Item Form Init': emptyProps(),
    'Create Item': props<{ item: Recipe }>(),
    'Create Item Success': emptyProps(),
    'Update Item': props<{ item: Recipe; id: string }>(),
    'Update Item Success': emptyProps(),
    'Delete Item': props<{ id: string }>(),
    'Delete Item Success': emptyProps(),
    'Get Item': props<{ id: string }>(),
    'Get Item Success': props<{ item: Recipe }>(),
    'Get Items': props<{ request: RepositoryRequest<Recipe, RecipeStatus> }>(),
    'Get Items By Search Query': props<{ request: FilterRequest }>(),
    'Get Items Success': props<{ items: Recipe[]; query: RepositoryRequestQuery; total?: number; size?: number }>(),
    'Notify Error': props<{ error: Error; errorType: RepositoryEntityAction }>(),
    'Reset Request To The First Page': emptyProps(),
    'Reset State': emptyProps(),
  },
})
