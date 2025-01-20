import { RepositoryRequest } from '../../../shared/repository/repository.models'
import { Order, OrderStatus } from './order.model'

export abstract class OrderConstants {
  static readonly storeFeatureKey = 'ORDERS'
  static readonly collectionName = 'Orders'
  static readonly paginationTitle = 'ORDERS.PAGE.LIST.FOOTER-TITLE'
  static readonly labelDining = 'ORDERS.PAGE.LIST.TAB.DINING'
  static readonly labelDelivery = 'ORDERS.PAGE.LIST.TAB.DELIVERY'
  static readonly labelClosed = 'ORDERS.PAGE.LIST.TAB.CLOSED'
  static readonly paginationSize = [5, 10, 20, 50, 100]
  static readonly moduleUrl = '/orders'
  static readonly tableColumns = ['client', 'waiter', 'price']
  static readonly statusList: OrderStatus[] = ['dining', 'delivery', 'closed']
  static readonly backToListButton = 'RECIPES.NAVBAR'
  static readonly defaultRequestStatus = 'dining'
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