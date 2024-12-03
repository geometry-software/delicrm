import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { AuthStatusTotalResponse, AppUser } from '../utils/user.model'
import { UserConstants } from '../utils/user.constants'
import { FilterRequest, RepositoryEntityAction, RepositoryRequest, RepositoryRequestQuery } from '../../../shared/repository/repository.model'
import { AuthStatus } from '../../../auth/models/auth.model'
import { LoadingStatus } from '../../../shared/models/loading-status'

export const AuthActions = createActionGroup({
  source: UserConstants.storeFeatureKey,
  events: {
    'Get Items': props<{ request: RepositoryRequest<AppUser, AuthStatus> }>(),
    'Set Items Loading Status': props<{ status: LoadingStatus }>(),
    'Create Item Form Init': emptyProps(),
    'Create Item': props<{ item: AppUser }>(),
    'Create Item Success': props<{ response: any; total: number }>(),
    'Update Item': props<{ item: AppUser; id: string }>(),
    'Update Item Success': emptyProps(),
    'Get Item': props<{ id: string }>(),
    'Get Item Success': props<{ item: AppUser }>(),
    'Get Items By Search Query': props<{ request: FilterRequest }>(),
    'Get Items Success': props<{
      items: AppUser[]
      query: RepositoryRequestQuery
      total?: number
      size?: number
      listLabelAmount?: AuthStatusTotalResponse
    }>(),
    'Notify Error': props<{ error: Error; errorType: RepositoryEntityAction }>(),
    'Reset Request To The First Page': emptyProps(),
    'Reset State': emptyProps(),
  },
})
