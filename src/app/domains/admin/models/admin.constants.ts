
import { PaginationRequest } from '../../../shared/models/pagination.model'
import { RepositoryRequest, SortRequest } from '../../../shared/repository/repository.models'

export abstract class AdminConstants {
  static readonly storeFeatureKey = 'ADMIN'
  static readonly collectionName = 'Recipes'
  static readonly defaultCreateStatus = 'active'
  static readonly defaultTableSort = 'createdAt'
  static readonly defaultSearchKey = 'name'
  static readonly paginationTitle = 'recipes'
  static readonly paginationSize = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  static readonly moduleUrl = '/recipes'
  static readonly tableColumns = ['name', 'type', 'price']
  static readonly disableSort = true
  static readonly searchPlaceholder = 'RECIPES.PAGE.LIST.TABLE.SEARCH'
  static readonly deleteTitle = 'RECIPES.PAGE.DETAIL.DELETE_TITLE'
  static readonly backToListButton = 'RECIPES.NAVBAR'
  static readonly defaultPaginationControlValue: PaginationRequest<any> = {
    query: 'first',
    item: null,
  }
  // static readonly defaultSizeControlValue: SizeRequest = {
  //   size: 4,
  // }
  static readonly defaultOrderControlValue: SortRequest = { active: 'createdAt', direction: 'desc' }
  static readonly defaultRequestStatus = 'active'
  static readonly defaultFirstPageRequest: RepositoryRequest<any, any> = {
    pagination: this.defaultPaginationControlValue,
    sort: AdminConstants.defaultOrderControlValue,
    size: 4,
    status: this.defaultRequestStatus,
  }
}
