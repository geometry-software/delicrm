import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { AdminConstants } from '../../models/admin.constants'
import { DailyMenu, MenuItem, Restaurant } from '../../models/restaurant'
import { RepositoryRequestQuery } from '../../../../shared/repository/repository.models';
import { LoadingStatus } from '../../../../shared/models/loading-status';
import { Recipe } from '../../../recipe/models/recipe.model';

export const BoardActions = createActionGroup({
  source: AdminConstants.storeFeatureKey,
  events: {
    'Set Items Loading Status': props<{ status: LoadingStatus }>(),
    'Create Daily Menu': props<{ menu: DailyMenu }>(),
    'Create Alacarte Menu': props<{ menu: MenuItem[] }>(),
    'Rebuild Daily Menu': emptyProps(),
    'Rebuild Daily Menu Success': emptyProps(),
    'Copy Daily Menu': emptyProps(),
    // 'Get Daily Menu': emptyProps(),
    // 'Set Daily Menu': props<{ }>(),
    'Get Board Info': emptyProps(),
    'Set Board Info': props<{
      menu: DailyMenu,
      restaurant: Restaurant,
      recipes: Recipe[],
      alacarte: MenuItem[],
      open: boolean
    }>(),
    'Print Menu': emptyProps(),
    'Print Menu Success': emptyProps(),
    'Update Restaurant': props<{ restaurant: Restaurant }>(),
    'Close Shift': emptyProps(),
    'Close Shift Success': emptyProps(),
    'Notify Error': props<{ error: Error; errorType: RepositoryRequestQuery }>(),
  },
})