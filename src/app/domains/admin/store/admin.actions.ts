import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { AdminConstants } from '../models/admin.constants'
import { DailyMenu } from '../models/restaurant'
import { RepositoryRequestQuery } from '../../../shared/repository/repository.models';
import { LoadingStatus } from '../../../shared/models/loading-status';

export const AdminActions = createActionGroup({
  source: AdminConstants.storeFeatureKey,
  events: {
    'Set Items Loading Status': props<{ status: LoadingStatus }>(),
    'Create Daily Menu': props<{ menu: DailyMenu }>(),
    'Print Menu': emptyProps(),
    'Print Menu Success': emptyProps(),
    'Notify Error': props<{ error: Error; errorType: RepositoryRequestQuery }>(),
  },
})