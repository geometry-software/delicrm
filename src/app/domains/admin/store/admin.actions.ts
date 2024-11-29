import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { AdminConstants } from '../utils/admin.constants'

export const AdminActions = createActionGroup({
  source: AdminConstants.storeFeatureKey,
  events: {
    'Print Menu': props<{ print: boolean }>(),
    'Print Menu Success': props<{ print: boolean }>(),
  },
})
