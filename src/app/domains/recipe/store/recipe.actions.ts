import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { Recipe, RecipeStatus } from '../models/recipe.model'
import { RecipeConstants } from '../models/recipe.constants'
import { FilterRequest, RepositoryRequestQuery, RepositoryRequest, RepositoryResponseList } from '../../../shared/repository/repository.models';
import { LoadingStatus } from '../../../shared/models/loading-status';

export const RecipeActions = createActionGroup({
  source: RecipeConstants.storeFeatureKey,
  events: {
    'Create Item Form Init': emptyProps(),
    'Create Item': props<{ item: Recipe }>(),
    'Create Item Success': props<{ item: Recipe }>(),
    'Set Items Loading Status': props<{ status: LoadingStatus }>(),
    'Update Item': props<{ item: Recipe; id: string }>(),
    'Delete Item': props<{ id: string }>(),
    'Get Item': props<{ id: string }>(),
    'Get Item Success': props<{ item: Recipe }>(),
    'Get Items': props<{ request: RepositoryRequest<Recipe, RecipeStatus> }>(),
    'Get Items Success': props<{ items: RepositoryResponseList<Recipe>, size?: number, }>(),
    'Get Items By Search Query': props<{ request: FilterRequest }>(),
    'Notify Error': props<{ error: Error; query: RepositoryRequestQuery }>(),
    'Set Items Amount': props<{ amount: number }>(),
  },
})
