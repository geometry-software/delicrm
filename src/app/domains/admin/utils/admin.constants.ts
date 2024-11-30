import { Sort } from '@angular/material/sort'
import { PaginationRequest } from '../../../shared/model/pagination.model'
import { RepositoryRequest, RepositoryRequestOrder, SizeRequest } from '../../../shared/repository/repository.model'

export abstract class AdminConstants {
  static readonly storeFeatureKey = 'ADMIN'
  static readonly collectionName = 'Recipes'
  static readonly restaurantCollectionName = 'Restaurant'
  static readonly defaultCreateStatus = 'active'
  static readonly defaultTableSort = 'timestamp'
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
  static readonly defaultSizeControlValue: SizeRequest = {
    size: 4,
  }
  static readonly defaultOrderControlValue: Sort = { active: 'timestamp', direction: 'desc' }
  static readonly defaultRequestStatus = 'active'
  static readonly defaultFirstPageRequest: RepositoryRequest<any, any> = {
    pagination: this.defaultPaginationControlValue,
    order: {
      key: this.defaultOrderControlValue.active,
      value: this.defaultOrderControlValue.direction as RepositoryRequestOrder,
    },
    size: this.defaultSizeControlValue,
    status: this.defaultRequestStatus,
  }
}
