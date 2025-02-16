import { Injectable } from '@angular/core'
import { combineLatest, map, tap } from 'rxjs'
import { RepositoryService } from '../../../shared/repository/repository.service'
import { SortRequest } from '../../../shared/repository/repository.models'
import { Auth, AuthStatus } from '../../../auth/models/auth.model'
import { ClientConstants } from '../models/client.constants'
import { v4 as uuidv4 } from 'uuid';
import { BootstrapConstants } from '../../../bootstrap/models/bootstrap.constants'
import { getCurrentUnixTime } from '../../../shared/utils/format-unix-time'

@Injectable()
export class ClientService {

  constructor(
    private repositoryService: RepositoryService<Auth, AuthStatus>
  ) { }

  private readonly collection = ClientConstants.collectionName

  getAll() {
    return this.repositoryService.getAllDocuments(this.collection)
  }

  getAllByActiveStatus() {
    return this.repositoryService.getAllDocumentsByStatus(this.collection, 'active')
  }

  getById(id: string) {
    return this.repositoryService.getDocumentById(this.collection, id)
  }

  getTotalByStatus(status: AuthStatus) {
    return this.repositoryService.getCollectionSizeByStatus(this.collection, status)
  }

  getTotalLabels() {
    return combineLatest([
      this.getTotalByStatus('auth'),
      this.getTotalByStatus('active'),
      this.getTotalByStatus('requested'),
      this.getTotalByStatus('blocked'),
    ]).pipe(
      map(([auth, active, requested, blocked]) => ({
        auth, active, requested, blocked
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

  create(name: string, address: string, phone: string, createdByUserName: string) {
    const client: Auth = {
      authId: uuidv4(),
      address,
      phone,
      name,
      createdByUserName,
      deliveries: [],
      locale: BootstrapConstants.locale,
      status: 'active',
      createdAt: getCurrentUnixTime()
    }
    return this.repositoryService.setDocument(this.collection, client, client.authId).pipe(
      map(() => client.authId)
    )
  }

  update(id: string, name: string, address: string, phone: string) {
    return this.repositoryService.updateDocument(this.collection, { name, address, phone }, id)
  }

  updateStatus(id: string, status: AuthStatus) {
    return this.repositoryService.updateDocument(this.collection, { status }, id)
  }

}