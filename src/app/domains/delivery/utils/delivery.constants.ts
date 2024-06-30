import { PaginationRequest } from 'src/app/shared/model/pagination.model'
import { RepositoryRequest, RepositoryRequestOrder, SizeRequest } from 'src/app/shared/repository/repository.model'
import { Sort } from '@angular/material/sort'
import { Order, OrderStatusValue } from '../../menu/utils/waiter.model'

export abstract class DeliveryConstants {
  static readonly storeFeatureKey = 'RECIPES'
  static readonly collectionName = 'Delivery'
  static readonly defaultCreateStatus = 'active'
  static readonly defaultTableSort = 'timestamp'
  static readonly defaultSearchKey = 'name'
  static readonly paginationTitle = 'recipes'
  static readonly paginationSize = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  static readonly moduleUrl = '/recipes'
  static readonly tableColumns = ['name', 'type', 'price']
  static readonly disableSort = false
  static readonly searchPlaceholder = 'RECIPES.PAGE.LIST.TABLE.SEARCH'
  static readonly deleteTitle = 'RECIPES.PAGE.DETAIL.DELETE_TITLE'
  static readonly backToListButton = 'RECIPES.NAVBAR'
  static readonly defaultPaginationControlValue: PaginationRequest<Order> = {
    query: 'first',
    item: null,
  }
  static readonly defaultSizeControlValue: SizeRequest = {
    size: 10,
  }
  static readonly defaultOrderControlValue: Sort = {
    active: 'timestamp',
    direction: 'desc',
  }
  static readonly defaultRequestStatus = 'requested'
  static readonly defaultFirstPageRequest: RepositoryRequest<Order, OrderStatusValue> = {
    pagination: this.defaultPaginationControlValue,
    order: {
      key: this.defaultOrderControlValue.active,
      value: this.defaultOrderControlValue.direction as RepositoryRequestOrder,
    },
    size: this.defaultSizeControlValue,
    status: this.defaultRequestStatus,
  }
}
