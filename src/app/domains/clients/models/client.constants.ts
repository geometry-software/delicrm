import { Auth, AuthStatus } from '../../../auth/models/auth.model'
import { RepositoryRequest } from '../../../shared/repository/repository.models'

export abstract class ClientConstants {
  static readonly storeFeatureKey = 'CLIENTS'
  static readonly collectionName = 'Auth'
  static readonly defaultCreateStatus = 'active'
  static readonly defaultTableSort = 'createdAt'
  static readonly defaultSearchKey = 'name'
  static readonly paginationTitle = 'orders'

  static readonly labelActive = 'Active'
  static readonly labelRequested = 'Requested'
  static readonly labelBlocked = 'Blocked'

  static readonly paginationSize = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20]
  static readonly moduleUrl = '/clients'
  static readonly tableColumns = ['name', 'status']
  static readonly statusList: AuthStatus[] = ['active', 'requested', 'blocked']
  static readonly disableSort = true
  static readonly searchPlaceholder = 'RECIPES.PAGE.LIST.TABLE.SEARCH'
  static readonly deleteTitle = 'RECIPES.PAGE.DETAIL.DELETE_TITLE'
  static readonly backToListButton = 'RECIPES.NAVBAR'
  static readonly defaultRequestStatus = 'active'
  static readonly defaultPageRequest: RepositoryRequest<Auth, AuthStatus> = {
    pagination: {
      query: 'first',
      item: null,
    },
    sort: { active: 'createdAt', direction: 'desc' },
    size: 10,
    status: this.defaultRequestStatus,
  }
}