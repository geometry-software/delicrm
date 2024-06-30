import { createActionGroup, emptyProps, props } from '@ngrx/store'
import {
  FilterRequest,
  RepositoryEntityAction,
  RepositoryRequest,
  RepositoryRequestQuery,
  RepositoryResponseEntity,
} from 'src/app/shared/repository/repository.model'
import { AuthStatus, AuthStatusTotalResponse, AuthUser } from '../utils/auth.model'
import firebase from 'firebase/compat/app'
import { AuthConstants } from '../utils/auth.constants'

export const AuthActions = createActionGroup({
  source: AuthConstants.storeFeatureKey,
  events: {
    'Login With Google': emptyProps(),
    'Login With Facebook': emptyProps(),
    'Login With Apple': emptyProps(),
    'Login Anonymously': emptyProps(),
    'Log Out': emptyProps(),
    'Verify Auth User': props<{ additionalUserInfo: firebase.auth.AdditionalUserInfo; uid: string }>(),
    'Update User Status': props<{ item: AuthUser; status: AuthStatus }>(),
    'Update User Status Success': emptyProps(),
    'Create User Success': props<{ item: AuthUser }>(),
    'Update User Success': props<{ item: AuthUser }>(),
    'Get Users Total Amount': emptyProps(),
    'Get Users Total Amount Success': props<{ response: AuthStatusTotalResponse }>(),
    // 'Block User': props<{ item: AuthUser }>(),
    // 'Block User Success': emptyProps(),
    // old
    'Create Item Form Init': emptyProps(),
    'Create Item': props<{ item: AuthUser }>(),
    'Create Item Success': props<{ response: RepositoryResponseEntity; total: number }>(),
    'Update Item': props<{ item: AuthUser; id: string }>(),
    'Update Item Success': emptyProps(),
    'Get Item': props<{ id: string }>(),
    'Get Item Success': props<{ item: AuthUser }>(),
    'Get Items': props<{ request: RepositoryRequest<AuthUser, AuthStatus> }>(),
    'Get Items By Search Query': props<{ request: FilterRequest }>(),
    'Get Items Success': props<{
      items: AuthUser[]
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
