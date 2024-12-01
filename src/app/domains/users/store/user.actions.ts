import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { AuthStatusTotalResponse, AppUser } from '../utils/user.model'
import firebase from 'firebase/compat/app'
import { UserConstants } from '../utils/user.constants'
import { FilterRequest, RepositoryEntityAction, RepositoryRequest, RepositoryRequestQuery, RepositoryResponseEntity } from '../../../shared/repository/repository.model'
import { AuthStatus } from '../../../auth/models/auth.model'

export const AuthActions = createActionGroup({
  source: UserConstants.storeFeatureKey,
  events: {
    'Login With Google': emptyProps(),
    'Login With Facebook': emptyProps(),
    'Login With Apple': emptyProps(),
    'Login Anonymously': emptyProps(),
    'Log Out': emptyProps(),
    'Verify Auth User': props<{ additionalUserInfo: firebase.auth.AdditionalUserInfo; uid: string }>(),
    'Update User Status': props<{ item: AppUser; status: AuthStatus }>(),
    'Update User Status Success': emptyProps(),
    'Create User Success': props<{ item: AppUser }>(),
    'Update User Success': props<{ item: AppUser }>(),
    'Get Users Total Amount': emptyProps(),
    'Get Users Total Amount Success': props<{ response: AuthStatusTotalResponse }>(),
    // 'Block User': props<{ item: AuthUser }>(),
    // 'Block User Success': emptyProps(),
    // old
    'Create Item Form Init': emptyProps(),
    'Create Item': props<{ item: AppUser }>(),
    'Create Item Success': props<{ response: RepositoryResponseEntity; total: number }>(),
    'Update Item': props<{ item: AppUser; id: string }>(),
    'Update Item Success': emptyProps(),
    'Get Item': props<{ id: string }>(),
    'Get Item Success': props<{ item: AppUser }>(),
    'Get Items': props<{ request: RepositoryRequest<AppUser, AuthStatus> }>(),
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
