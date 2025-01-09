import { createActionGroup, props } from '@ngrx/store'
import { RepositoryRequest, RepositoryResponseList } from '../../../../shared/repository/repository.models'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { ShiftStatus, Shift } from '../../models/shift'
import { ShiftConstants } from '../../models/shift.constants'

export const ShiftActions = createActionGroup({
  source: ShiftConstants.storeFeatureKey,
  events: {
    'Get Items': props<{ request: RepositoryRequest<Shift, ShiftStatus> }>(),
    'Set Items Loading Status': props<{ status: LoadingStatus }>(),
    'Get Item': props<{ id: string }>(),
    'Get Item Success': props<{ item: Shift }>(),
    'Get Items Success': props<{ items: RepositoryResponseList<Shift>, size?: number, }>(),
    'Notify Error': props<{ error: Error }>(),
  },
})