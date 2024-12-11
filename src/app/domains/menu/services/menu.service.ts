import { Injectable } from '@angular/core'
import { Order } from '../utils/menu.model'
import { MenuConstants } from '../utils/menu.constants'
import { RepositoryService } from '../../../shared/repository/repository.service'

@Injectable()
export class MenuService {

  constructor(private repositoryService: RepositoryService) { }

  private readonly collection = MenuConstants.collectionName
  private readonly collectionDelivery = MenuConstants.collectionNameDelivery

  createDelivery(order: Order) {
    return this.repositoryService.createDocument(this.collectionDelivery, order)
  }

  createTableOrder(order: Order) {
    return this.repositoryService.createDocument(this.collection, order)
  }

}