import { Injectable } from '@angular/core'
import { RepositoryService } from '../../../shared/repository/repository.service'
import { Delivery, DeliveryStatus } from '../models/delivery.model'
import { DeliveryConstants } from '../models/delivery.constants'
import { SortRequest } from '../../../shared/repository/repository.models'
import { combineLatest, map } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  constructor(
    private repositoryService: RepositoryService<Delivery, DeliveryStatus>
  ) { }

  private readonly collection = DeliveryConstants.collectionName

  create(delivery: Delivery) {
    return this.repositoryService.createDocument(this.collection, delivery)
  }

  getAll() {
    return this.repositoryService.getAllDocuments(this.collection)
  }

  getById(id: string) {
    return this.repositoryService.getDocumentById(this.collection, id)
  }

  getTotalByStatus(status: DeliveryStatus) {
    return this.repositoryService.getCollectionSizeByStatus(this.collection, status)
  }

  getTotalLabels() {
    return combineLatest([
      this.getTotalByStatus('requested'),
      this.getTotalByStatus('confirmed'),
      this.getTotalByStatus('canceled'),
    ]).pipe(
      map(([requested, confirmed, canceled]) => ({
        requested, confirmed, canceled
      }))
    )
  }

  getFirstPage(sort: SortRequest, size: number, status: DeliveryStatus) {
    return this.repositoryService.getFirstPage(this.collection, sort, size, status)
  }

  getNextPage(sort: SortRequest, size: number, status: DeliveryStatus, value: number) {
    return this.repositoryService.getNextPage(this.collection, sort, size, value, status)
  }

  getPreviousPage(sort: SortRequest, size: number, status: DeliveryStatus, value: number) {
    return this.repositoryService.getPreviousPage(this.collection, sort, size, value, status)
  }

  getAllByQuery(property: string, value: string) {
    return this.repositoryService.getAllDocumentsByIncludesQuery(this.collection, property, value)
  }

  set(item: Delivery, id: string) {
    return this.repositoryService.setDocument(this.collection, item, id)
  }

  update(item: Delivery, id: string) {
    return this.repositoryService.updateDocument(this.collection, item, id)
  }

  updateStatus(id: string, status: DeliveryStatus) {
    return this.repositoryService.updateDocument(this.collection, { status }, id)
  }

}