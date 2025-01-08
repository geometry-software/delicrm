import { createActionGroup, props } from '@ngrx/store'
import { RepositoryRequest, RepositoryResponseList } from '../../../shared/repository/repository.models'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { ShiftStatus, ShiftSummary } from '../models/shift'
import { ShiftConstants } from '../models/shift.constants'

export const ShiftActions = createActionGroup({
  source: ShiftConstants.storeFeatureKey,
  events: {
    'Get Items': props<{ request: RepositoryRequest<ShiftSummary, ShiftStatus> }>(),
    'Set Items Loading Status': props<{ status: LoadingStatus }>(),
    'Get Item': props<{ id: string }>(),
    'Get Item Success': props<{ item: ShiftSummary }>(),
    'Get Items Success': props<{ items: RepositoryResponseList<ShiftSummary>, size?: number, }>(),
    'Notify Error': props<{ error: Error }>(),
  },
})