import { Injectable } from '@angular/core'
import { Order, OrderStatusValue } from '../../menu/utils/menu.model'
import { RepositoryService } from '../../../shared/repository/repository.service'
import { MenuConstants } from '../../menu/utils/menu.constants'

@Injectable()
export class DeliveryService {

  constructor(private repositoryService: RepositoryService<Order, OrderStatusValue>) { }

  private readonly collection = MenuConstants.collectionName

  getNewDeliveries(status: OrderStatusValue) {
    return this.repositoryService.getAllDocumentsByStatus(this.collection, status)
  }

  confirmDelivery(id: string, orderId: string) {
    return this.repositoryService.updateDocument(this.collection, { status: 'delivery' }, id)
    // return this.afs.collection(this.collectionNameDelivery).doc(id).update({ status: 'delivery', orderId })
  }

  rejectDelivery(id: string, comment: string) {
    return this.repositoryService.updateDocument(this.collection, { status: 'canceled', comment: comment }, id)
    // return this.afs.collection(this.collectionNameDelivery).doc(id).update({ status: 'canceled', comment: comment })
  }

}