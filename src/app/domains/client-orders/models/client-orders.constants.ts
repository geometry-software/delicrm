import { RepositoryRequest } from '../../../shared/repository/repository.models'
import { Delivery, DeliveryStatus } from '../../delivery/models/delivery.model'

export abstract class ClientOrdersConstants {
  static readonly storeFeatureKey = 'CLIENT_ORDERS'
  static readonly collectionName = 'Deliveries'
  static readonly paginationSize = [5, 10, 20, 50, 100]
  static readonly moduleUrl = '/orders'
  static readonly paginationTitle = 'orders'
  static readonly tableColumns = ['date', 'status']
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