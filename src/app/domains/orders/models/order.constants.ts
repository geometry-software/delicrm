import { RepositoryRequest } from '../../../shared/repository/repository.models'
import { Order, OrderStatus } from './order.model'

export abstract class OrderConstants {
  static readonly storeFeatureKey = 'ORDERS'
  static readonly collectionName = 'Orders'
  static readonly defaultCreateStatus = 'active'
  static readonly defaultTableSort = 'createdAt'
  static readonly defaultSearchKey = 'name'
  static readonly paginationTitle = 'orders'
  static readonly labelCooking = 'Cooking'
  static readonly labelDelivery = 'In delivery'
  static readonly labelPaid = 'Paid'
  static readonly labelCanceled = 'Canceled'
  static readonly paginationSize = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20]
  static readonly moduleUrl = '/orders'
  static readonly tableColumns = ['client', 'waiter', 'price']
  static readonly statusList: OrderStatus[] = ['cooking', 'delivery', 'paid', 'canceled']
  static readonly disableSort = true
  static readonly searchPlaceholder = 'RECIPES.PAGE.LIST.TABLE.SEARCH'
  static readonly deleteTitle = 'RECIPES.PAGE.DETAIL.DELETE_TITLE'
  static readonly backToListButton = 'RECIPES.NAVBAR'
  static readonly defaultRequestStatus = 'cooking'
  static readonly defaultPageRequest: RepositoryRequest<Order, OrderStatus> = {
    pagination: {
      query: 'first',
      item: null,
    },
    sort: { active: 'createdAt', direction: 'desc' },
    size: 10,
    status: this.defaultRequestStatus,
  }
}

export enum ORDER_STATUS_COLOR {
  cooking = '#fdb16f',
  delivery = '#fcb1fe',
  paid = '#19b7c6',
  canceled = '#ff5c47',
}

export enum ORDER_STATUS_ICON {
  cooking = 'skillet',
  delivery = 'directions_bike',
  paid = 'attach_money',
  canceled = 'delete_forever',
}

export enum ORDER_STATUS_PROGRESS {
  cooking = 'Cook',
  delivery = 'in Delivery',
  paid = 'Paid',
  canceled = 'Cancel',
}

export enum ORDER_STATUS_TRANSLATE {
  cooking = 'Cook',
  delivery = 'In Delivery',
  paid = 'Paid',
  canceled = 'Cancel',
}