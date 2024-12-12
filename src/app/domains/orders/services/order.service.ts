import { Injectable } from '@angular/core'
import { EMPTY, Observable, combineLatest, map } from 'rxjs'
import { OrderConstants } from '../models/order.constants'
import { OrderRequest } from '../../../shared/repository/repository.model'
import { RepositoryService } from '../../../shared/repository/repository.service'
import { getCurrentUnixTime } from '../../../shared/utils/format-unix-time'
import { Order, OrderStatus } from '../models/order.model'

@Injectable({
  providedIn: 'root',
})
export class OrderService {

  constructor(
    private repositoryService: RepositoryService<Order, OrderStatus>,
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
    return this.repositoryService.getCollectionSizeByStatus<OrderStatus>(this.collection, status)
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

  getFirstPage(order: OrderRequest, size: number, status: OrderStatus) {
    // console.warn('users: getFirstPage Service');
    // console.log(order);
    // console.log(size);
    // console.log(status);
    return this.repositoryService.getFirstPage<OrderStatus>(this.collection, order, size, 'status', status)
  }

  getNextPage<V>(order: OrderRequest, size: number, status: OrderStatus, value: V) {
    return this.repositoryService.getNextPage<OrderStatus, V>(this.collection, order, size, 'status', status, value)
  }

  getPreviousPage<V>(order: OrderRequest, size: number, status: OrderStatus, value: V) {
    return this.repositoryService.getPreviousPage<OrderStatus, V>(this.collection, order, size, 'status', status, value)
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

  updateStatus(status: OrderStatus, id: string) {
    return this.repositoryService.updateDocument(this.collection, { status }, id)
  }

  updateRestaurant<T>(item: T): Observable<void> {
    // return this.repositoryService.setDocument(this.restaurantCollectionName, item, this.restaurantCollectionId)
    return EMPTY
  }


  getAllClients() {
    return this.repositoryService.getAllDocumentsByStatus(this.collection, 'client')
  }

}