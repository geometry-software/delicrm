import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { Recipe, RecipeStatus } from '../utils/admin.model'
import {
  FilterRequest,
  RepositoryEntityAction,
  RepositoryRequest,
  RepositoryRequestQuery,
  RepositoryResponseEntity,
} from 'src/app/shared/repository/repository.model'
import { AdminConstants } from '../utils/admin.constants'

export const AdminActions = createActionGroup({
  source: AdminConstants.storeFeatureKey,
  events: {
    'Print Menu': props<{ print: boolean }>(),
    'Print Menu Success': props<{ print: boolean }>(),
  },
})
