import { Injectable } from '@angular/core'
import { combineLatest, map } from 'rxjs'
import { OrderConstants } from '../models/order.constants'
import { RepositoryService } from '../../../shared/repository/repository.service'
import { Order, OrderProgress, OrderStatus, OrderStatusHistory } from '../models/order.model'
import { SortRequest } from '../../../shared/repository/repository.models'

@Injectable({
  providedIn: 'root',
})
export class OrderService {

  constructor(
    private repositoryService: RepositoryService<Order, OrderStatus>
  ) { }

  private readonly collection = OrderConstants.collectionName

  create(order: Order) {
    return this.repositoryService.createDocument(this.collection, order)
  }

  getAll() {
    return this.repositoryService.getAllDocuments(this.collection)
  }

  getById(id: string) {
    return this.repositoryService.getDocumentById(this.collection, id)
  }

  getTotalByStatus(status: OrderStatus) {
    return this.repositoryService.getCollectionSizeByStatus(this.collection, status)
  }

  getTotalLabels() {
    return combineLatest([
      this.getTotalByStatus('cooking'),
      this.getTotalByStatus('delivery'),
      this.getTotalByStatus('paid'),
      this.getTotalByStatus('canceled'),
    ]).pipe(
      map(([cooking, delivery, paid, canceled]) => ({
        cooking, delivery, paid, canceled
      }))
    )
  }

  getFirstPage(sort: SortRequest, size: number, status: OrderStatus) {
    return this.repositoryService.getFirstPage(this.collection, sort, size, status)
  }

  getNextPage(sort: SortRequest, size: number, status: OrderStatus, value: number) {
    return this.repositoryService.getNextPage(this.collection, sort, size, value, status)
  }

  getPreviousPage(sort: SortRequest, size: number, status: OrderStatus, value: number) {
    return this.repositoryService.getPreviousPage(this.collection, sort, size, value, status)
  }

  getAllByQuery(property: string, value: string) {
    return this.repositoryService.getAllDocumentsByIncludesQuery(this.collection, property, value)
  }

  set(item: Order, id: string) {
    return this.repositoryService.setDocument(this.collection, item, id)
  }

  update(item: Order, id: string) {
    return this.repositoryService.updateDocument(this.collection, item, id)
  }

  updateStatus(id: string, status: OrderStatus, statusHistory: OrderStatusHistory[], progress: OrderProgress) {
    return this.repositoryService.updateDocument(this.collection, { status, statusHistory, progress }, id)
  }

}