import { Injectable } from '@angular/core'
import { EMPTY, Observable, combineLatest, concat, delay, filter, from, map, of, shareReplay, switchMap, tap } from 'rxjs'
import { ClientConstants } from '../utils/client.constants'
import { ClientStatusTotalResponse, Client, ClientStatus } from '../models/client.model'
import { OrderRequest } from '../../../shared/repository/repository.model'
import { RepositoryService } from '../../../shared/repository/repository.service'
import { AuthService } from '../../../auth/services/auth.service'
import { setRestaurantAuth } from '../../../auth/models/auth-user.mapper'
import { AuthConstants } from '../../../auth/models/auth.constants'
import { getCurrentUnixTime } from '../../../shared/utils/format-unix-time'

@Injectable({
  providedIn: 'root',
})
export class ClientService {

  constructor(private repositoryService: RepositoryService<Client, ClientStatus>
  ) {
    // this.createDumpClients()
  }

  createDumpClients() {
    const arr: Client[] = []
    const userAmount = 9
    for (let index = 0; index < userAmount; index++) {
      arr.push({
        authId: `${index + 1}`,
        name: `User ${index + 1}`,
        createdAt: getCurrentUnixTime,
        status: 'active',
        orders: []
      })
    }
    from(arr).subscribe(user => {
      const item = user as any
      console.log(item);
      this.repositoryService.createDocument(this.collection, item)
    })

  }

  private readonly collection = ClientConstants.collectionName
  private readonly authCollection = AuthConstants.collectionName
  private readonly authCollectionId = AuthConstants.authCollectionId


  // createAdminUser(id: string, role: UserRole) {
  //   return this.authService.fireAuthUser.pipe(
  //     filter(user => user?.emailVerified),
  //     switchMap(() => this.authService.getUser(id).pipe(
  //       map(user => ({ ...user, status: 'confirmed' as ClientStatus })),
  //       switchMap(user => this.repositoryService.setDocument(
  //         this.collection,
  //         mapAppUser(user, role),
  //         user.authId
  //       ).pipe(switchMap(() => this.repositoryService.setDocument(
  //         this.authCollection,
  //         setRestaurantAuth(user.email),
  //         this.authCollectionId
  //       )))))))
  // }

  create(item: Client) {
    // return this.repositoryService.setDocument(this.collection, mapAppUser(user, role), user.authId).pipe(
    //   map(() => ({ id: user.authId, auth: user })))
    return EMPTY
  }

  getAll() {
    return this.repositoryService.getAllDocuments(this.collection)
  }

  getById(id: string) {
    return this.repositoryService.getDocumentById(this.collection, id)
  }

  getTotalByStatus(status: ClientStatus) {
    console.log(status);

    return this.repositoryService.getCollectionSizeByStatus<ClientStatus>(this.collection, status)
  }

  getTotalLabels() {
    return combineLatest([
      this.getTotalByStatus('active'),
      this.getTotalByStatus('blocked')
    ]).pipe(
      map(([active, blocked]) => ({
        active, blocked
      })),
      tap(value => {
        // console.warn('user getTotalLabels');
        // console.log(value);
      })
    )
  }

  getFirstPage(order: OrderRequest, size: number, status: ClientStatus) {
    // console.warn('users: getFirstPage Service');
    // console.log(order);
    // console.log(size);
    // console.log(status);
    return this.repositoryService.getFirstPage<ClientStatus>(this.collection, order, size, 'status', status)
  }

  getNextPage<V>(order: OrderRequest, size: number, status: ClientStatus, value: V) {
    return this.repositoryService.getNextPage<ClientStatus, V>(this.collection, order, size, 'status', status, value)
  }

  getPreviousPage<V>(order: OrderRequest, size: number, status: ClientStatus, value: V) {
    return this.repositoryService.getPreviousPage<ClientStatus, V>(this.collection, order, size, 'status', status, value)
  }

  getAllByQuery(property: string, value: string) {
    return this.repositoryService.getAllDocumentsByIncludesQuery(this.collection, property, value)
  }

  set(item: Client, id: string) {
    return this.repositoryService.setDocument(this.collection, item, id)
  }

  update(item: Client, id: string) {
    return this.repositoryService.updateDocument(this.collection, item, id)
  }

  updateStatus(status: ClientStatus, id: string) {
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