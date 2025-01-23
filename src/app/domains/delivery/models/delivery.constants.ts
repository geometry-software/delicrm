import { RepositoryRequest } from '../../../shared/repository/repository.models'
import { Delivery, DeliveryStatus } from './delivery.model'

export abstract class DeliveryConstants {
  static readonly storeFeatureKey = 'DELIVERY'
  static readonly collectionName = 'Deliveries'
  static readonly paginationTitle = 'DELIVERY.LIST.FOOTER-TITLE'
  static readonly labelRequested = 'DELIVERY.LIST.TAB.REQUESTED'
  static readonly labelConfirmed = 'DELIVERY.LIST.TAB.CONFIRMED'
  static readonly labelAccepted = 'DELIVERY.LIST.TAB.ACCEPTED'
  static readonly labelOntheway = 'DELIVERY.LIST.TAB.ONTHEWAY'
  static readonly labelReceived = 'DELIVERY.LIST.TAB.RECEIVED'
  static readonly labelClosed = 'DELIVERY.LIST.TAB.CLOSED'
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