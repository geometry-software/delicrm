import { RepositoryRequest } from '../../../shared/repository/repository.models'
import { Delivery, DeliveryStatus } from './delivery.model'

export abstract class DeliveryConstants {
  static readonly storeFeatureKey = 'DELIVERY'
  static readonly collectionName = 'Deliveries'
  static readonly paginationTitle = 'DELIVERY.PAGE.LIST.FOOTER-TITLE'
  static readonly labelRequested = 'DELIVERY.PAGE.LIST.TAB.REQUESTED'
  static readonly labelConfirmed = 'DELIVERY.PAGE.LIST.TAB.CONFIRMED'
  static readonly labelAccepted = 'DELIVERY.PAGE.LIST.TAB.ACCEPTED'
  static readonly labelOntheway = 'DELIVERY.PAGE.LIST.TAB.ONTHEWAY'
  static readonly labelReceived = 'DELIVERY.PAGE.LIST.TAB.RECEIVED'
  static readonly labelClosed = 'DELIVERY.PAGE.LIST.TAB.CLOSED'
  static readonly paginationSize = [5, 10, 20, 50, 100]
  static readonly moduleUrl = '/orders'
  static readonly tableColumns = ['client', 'plates']
  static readonly statusList: DeliveryStatus[] = ['requested', 'confirmed', 'accepted', 'ontheway', 'received', 'closed']
  static readonly defaultPageRequest: RepositoryRequest<Delivery, DeliveryStatus> = {
    pagination: {
      query: 'first',
      item: null,
    },
    sort: { active: 'createdAt', direction: 'desc' },
    size: 10,
    status: 'requested',
  }
}