import { RepositoryRequest } from '../../../shared/repository/repository.models'
import { User, UserRole, UserStatus } from './user.model'

export abstract class UserConstants {
  static readonly storeFeatureKey = 'USERS'
  static readonly collectionName = 'Users'
  static readonly defaultTableSort = 'createdAt'

  static readonly labelActive = 'USERS.LIST.TAB.ACTIVE'
  static readonly labelRequested = 'USERS.LIST.TAB.REQUESTED'
  static readonly labelBlocked = 'USERS.LIST.TAB.BLOCKED'

  static readonly paginationSize = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20]
  static readonly moduleUrl = '/users'
  static readonly tableColumns = ['name', 'role', 'status']
  static readonly statusList: UserStatus[] = ['active', 'requested', 'blocked']
  static readonly roleList: UserRole[] = ['admin', 'waiter', 'delivery']
  static readonly defaultRequestStatus = 'active'
  static readonly defaultPageRequest: RepositoryRequest<User, UserStatus> = {
    pagination: {
      query: 'first',
      item: null,
    },
    sort: { active: 'createdAt', direction: 'desc' },
    size: 10,
    status: this.defaultRequestStatus,
  }

}