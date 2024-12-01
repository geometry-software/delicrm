import { AuthStatus } from '../../../auth/models/auth.model'
import { PaginationRequest } from '../../../shared/model/pagination.model'
import { RepositoryRequest, RepositoryRequestOrder, SizeRequest } from '../../../shared/repository/repository.model'
import { AppUser } from './user.model'
import { Sort } from '@angular/material/sort'

export abstract class UserConstants {
  static readonly storeFeatureKey = 'AUTH'
  static readonly collectionName = 'User'
  static readonly defaultCreateStatus = 'active'
  static readonly defaultTableSort = 'timestamp'
  static readonly defaultSearchKey = 'name'
  static readonly paginationTitle = 'recipes'
  static readonly paginationSize = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  static readonly moduleUrl = '/recipes'
  static readonly labelClient = 'Client'
  static readonly statusList = ['requested', 'client', 'employee', 'blocked']
  static readonly roleList = ['waiter', 'delivery', 'admin']
  static readonly labelActive = 'Active'
  static readonly statusListCustomer = ['employee', 'blocked']
  static readonly labelEmployee = 'Employee'
  static readonly statusListEmployee = ['customer', 'blocked']
  static readonly labelRequested = 'Requested'
  static readonly statusListRequested = ['customer', 'employee', 'blocked']
  static readonly labelBlocked = 'Blocked'
  static readonly statusListBlocked = ['customer', 'employee']
  static readonly tableColumns = ['name', 'email', 'status']
  static readonly searchPlaceholder = 'RECIPES.PAGE.LIST.TABLE.SEARCH'
  static readonly confirmationTitleStart = 'Move a user to '
  static readonly confirmationTitleEnd = '?'
  static readonly backToListButton = 'RECIPES.NAVBAR'
  static readonly defaultPaginationControlValue: PaginationRequest<AppUser> = {
    query: 'first',
    item: null,
  }
  static readonly defaultSizeControlValue: SizeRequest = {
    size: 4,
  }
  static readonly defaultOrderControlValue: Sort = { active: 'timestamp', direction: 'desc' }
  static readonly defaultRequestStatus: AuthStatus = 'requested'
  static readonly defaultFirstPageRequest: RepositoryRequest<AppUser, AuthStatus> = {
    pagination: this.defaultPaginationControlValue,
    order: {
      key: this.defaultOrderControlValue.active,
      value: this.defaultOrderControlValue.direction as RepositoryRequestOrder,
    },
    size: this.defaultSizeControlValue,
    status: 'requested',
  }

}