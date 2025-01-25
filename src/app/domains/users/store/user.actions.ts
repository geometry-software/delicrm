
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { FilterRequest, RepositoryRequestQuery, RepositoryRequest, RepositoryRequestListQuery, RepositoryResponseList } from '../../../shared/repository/repository.models'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { UserConstants } from '../models/user.constants'
import { User, UserRole, UserStatus, UserStatusResponse } from '../models/user.model'

export const UserActions = createActionGroup({
  source: UserConstants.storeFeatureKey,
  events: {
    'Get Items': props<{ request: RepositoryRequest<User, UserStatus> }>(),
    'Set Items Loading Status': props<{ status: LoadingStatus }>(),
    'Update User Name': props<{ name: string, id: string }>(),
    'Update User Name Success': emptyProps(),
    'Update User Status': props<{ id: string, status: UserStatus, role: UserRole, user: User | null }>(),
    'Update User Status Failed': emptyProps(),
    'Update User Status Success': emptyProps(),
    'Create Item Success': props<{ response: any; total: number }>(),
    'Update Item': props<{ item: User; id: string }>(),
    'Update Item Success': emptyProps(),
    'Get Item': props<{ id: string }>(),
    'Get Item Success': props<{ item: User }>(),
    'Get Items By Search Query': props<{ request: FilterRequest }>(),
    'Get Items Success': props<{ items: RepositoryResponseList<User>, size?: number }>(),
    'Notify Error': props<{ error: Error; query: RepositoryRequestQuery }>(),
    'Set Items Amount By Status': props<{ status: UserStatus, amount: UserStatusResponse }>(),
    'Reset Request To The First Page': emptyProps(),
    'Reset State': emptyProps(),
  },
})
