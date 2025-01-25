import { Auth, AuthStatus } from '../../../auth/models/auth.model'
import { RepositoryRequest } from '../../../shared/repository/repository.models'
import { ClientStatus } from './client.model'

export abstract class ClientConstants {
  static readonly storeFeatureKey = 'CLIENTS'
  static readonly collectionName = 'Auth'
  static readonly defaultCreateStatus = 'active'
  static readonly defaultTableSort = 'createdAt'
  static readonly defaultSearchKey = 'name'
  static readonly paginationTitle = 'clients'

  static readonly labelAuth = 'Auth'
  static readonly labelActive = 'Active'
  static readonly labelRequested = 'Requested'
  static readonly labelBlocked = 'Blocked'

  static readonly paginationSize = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20]
  static readonly moduleUrl = '/clients'
  static readonly tableColumns = ['name', 'status']
  static readonly statusList: ClientStatus[] = ['active', 'auth', 'blocked']
  static readonly disableSort = true
  static readonly searchPlaceholder = 'RECIPES.PAGE.LIST.TABLE.SEARCH'
  static readonly deleteTitle = 'RECIPES.PAGE.DETAIL.DELETE_TITLE'
  static readonly backToListButton = 'RECIPES.NAVBAR'
  static readonly defaultRequestStatus: ClientStatus = 'active'
  static readonly defaultPageRequest: RepositoryRequest<Auth, ClientStatus> = {
    pagination: {
      query: 'first',
      item: null,
    },
    sort: { active: 'createdAt', direction: 'desc' },
    size: 10,
    status: this.defaultRequestStatus,
  }
}