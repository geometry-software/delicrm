import { Injectable } from '@angular/core'
import { RepositoryService } from '../../../shared/repository/repository.service'
import { SortRequest } from '../../../shared/repository/repository.models'
import { combineLatest, map } from 'rxjs'
import { ShiftConstants } from '../models/shift.constants'
import { ShiftStatus, Shift } from '../models/shift'

@Injectable()
export class ShiftService {

  constructor(
    private repositoryService: RepositoryService<Shift, ShiftStatus>
  ) { }

  private readonly collection = ShiftConstants.collectionName

  create(shift: Shift) {
    return this.repositoryService.createDocument(this.collection, shift)
  }

  getAll() {
    return this.repositoryService.getAllDocuments(this.collection)
  }

  getById(id: string) {
    return this.repositoryService.getDocumentById(this.collection, id)
  }

  getTotalByStatus(status: ShiftStatus) {
    return this.repositoryService.getCollectionSizeByStatus(this.collection, status)
  }

  getTotalLabels() {
    return combineLatest([
      this.getTotalByStatus('active'),
    ]).pipe(map(([active]) => ({ active })))
  }

  getFirstPage(sort: SortRequest, size: number, status: ShiftStatus) {
    return this.repositoryService.getFirstPage(this.collection, sort, size, status)
  }

  getNextPage(sort: SortRequest, size: number, status: ShiftStatus, value: number) {
    return this.repositoryService.getNextPage(this.collection, sort, size, value, status)
  }

  getPreviousPage(sort: SortRequest, size: number, status: ShiftStatus, value: number) {
    return this.repositoryService.getPreviousPage(this.collection, sort, size, value, status)
  }

  getAllByQuery(property: string, value: string) {
    return this.repositoryService.getAllDocumentsByIncludesQuery(this.collection, property, value)
  }

  set(item: Shift, id: string) {
    return this.repositoryService.setDocument(this.collection, item, id)
  }

  update(item: Shift, id: string) {
    return this.repositoryService.updateDocument(this.collection, item, id)
  }

}