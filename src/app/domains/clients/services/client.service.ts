import { Injectable } from '@angular/core'
import { combineLatest, map } from 'rxjs'
import { RepositoryService } from '../../../shared/repository/repository.service'
import { SortRequest } from '../../../shared/repository/repository.models'
import { Auth, AuthStatus } from '../../../auth/models/auth.model'
import { ClientConstants } from '../models/client.constants'

@Injectable()
export class ClientService {

  constructor(
    private repositoryService: RepositoryService<Auth, AuthStatus>
  ) { }

  private readonly collection = ClientConstants.collectionName

  getAll() {
    return this.repositoryService.getAllDocuments(this.collection)
  }

  getById(id: string) {
    return this.repositoryService.getDocumentById(this.collection, id)
  }

  getTotalByStatus(status: AuthStatus) {
    return this.repositoryService.getCollectionSizeByStatus(this.collection, status)
  }

  getTotalLabels() {
    return combineLatest([
      this.getTotalByStatus('active'),
      this.getTotalByStatus('requested'),
      this.getTotalByStatus('blocked'),
    ]).pipe(
      map(([active, requested, blocked]) => ({
        active, requested, blocked
      }))
    )
  }

  getFirstPage(sort: SortRequest, size: number, status: AuthStatus) {
    return this.repositoryService.getFirstPage(this.collection, sort, size, status)
  }

  getNextPage(sort: SortRequest, size: number, status: AuthStatus, value: number) {
    return this.repositoryService.getNextPage(this.collection, sort, size, value, status)
  }

  getPreviousPage(sort: SortRequest, size: number, status: AuthStatus, value: number) {
    return this.repositoryService.getPreviousPage(this.collection, sort, size, value, status)
  }

  getAllByQuery(property: string, value: string) {
    return this.repositoryService.getAllDocumentsByIncludesQuery(this.collection, property, value)
  }

  set(item: Auth, id: string) {
    return this.repositoryService.setDocument(this.collection, item, id)
  }

  update(item: Auth, id: string) {
    return this.repositoryService.updateDocument(this.collection, item, id)
  }

  updateStatus(id: string, status: AuthStatus) {
    return this.repositoryService.updateDocument(this.collection, { status }, id)
  }

}