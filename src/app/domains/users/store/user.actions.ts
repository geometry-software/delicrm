import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { UserStatusTotalResponse, User } from '../utils/user.model'
import { UserConstants } from '../utils/user.constants'
import { FilterRequest, RepositoryEntityAction, RepositoryRequest, RepositoryRequestQuery } from '../../../shared/repository/repository.model'
import { AuthStatus } from '../../../auth/models/auth.model'
import { LoadingStatus } from '../../../shared/models/loading-status'

export const UserActions = createActionGroup({
  source: UserConstants.storeFeatureKey,
  events: {
    'Get Items': props<{ request: RepositoryRequest<User, AuthStatus> }>(),
    'Set Items Loading Status': props<{ status: LoadingStatus }>(),
    'Create Item': props<{ item: User }>(),
    'Update User Status': props<{ id: string, status: AuthStatus }>(),
    'Update User Status Failed': emptyProps(),
    'Update User Status Success': emptyProps(),
    'Create Item Success': props<{ response: any; total: number }>(),
    'Update Item': props<{ item: User; id: string }>(),
    'Update Item Success': emptyProps(),
    'Get Item': props<{ id: string }>(),
    'Get Item Success': props<{ item: User }>(),
    'Get Items By Search Query': props<{ request: FilterRequest }>(),
    'Get Items Success': props<{
      items: User[]
      query: RepositoryRequestQuery
      total?: number
      size?: number
      listLabelAmount?: UserStatusTotalResponse
    }>(),
    'Notify Error': props<{ error: Error; errorType: RepositoryEntityAction }>(),
    'Reset Request To The First Page': emptyProps(),
    'Reset State': emptyProps(),
  },
})
