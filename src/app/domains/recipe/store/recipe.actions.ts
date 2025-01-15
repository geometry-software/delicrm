import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { Recipe, RecipeStatus } from '../models/recipe.model'
import { RecipeConstants } from '../models/recipe.constants'
import { FilterRequest, RepositoryRequestQuery, RepositoryRequest, RepositoryRequestListQuery, RepositoryResponseList } from '../../../shared/repository/repository.models';
import { LoadingStatus } from '../../../shared/models/loading-status';

export const RecipeActions = createActionGroup({
  source: RecipeConstants.storeFeatureKey,
  events: {
    //  'Get Items': props<{ request: RepositoryRequest<Order, OrderStatus> }>(),
    'Create Item Form Init': emptyProps(),
    'Create Item': props<{ item: Recipe }>(),
    'Set Items Loading Status': props<{ status: LoadingStatus }>(),
    // 'Create Item Success': emptyProps(),
    'Update Item': props<{ item: Recipe; id: string }>(),
    'Update Item Success': emptyProps(),
    'Delete Item': props<{ id: string }>(),
    // 'Delete Item Success': emptyProps(),
    'Get Item': props<{ id: string }>(),
    'Get Item Success': props<{ item: Recipe }>(),
    'Get Items': props<{ request: RepositoryRequest<Recipe, RecipeStatus> }>(),
    'Get Items Success': props<{ items: RepositoryResponseList<Recipe>, size?: number, }>(),
    'Get Items By Search Query': props<{ request: FilterRequest }>(),
    // 'Get Items Success': props<{ items: Recipe[]; query: RepositoryRequestListQuery; total?: number; size?: number }>(),
    'Notify Error': props<{ error: Error; query: RepositoryRequestQuery }>(),
    'Reset Request To The First Page': emptyProps(),
    'Reset State': emptyProps(),
  },
})
