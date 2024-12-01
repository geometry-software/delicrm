import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { GoogleAuthProvider, FacebookAuthProvider, OAuthProvider } from 'firebase/auth'
import firebase from 'firebase/compat/app'
import { BehaviorSubject, EMPTY, Observable, concat, filter, first, forkJoin, from, map, of, shareReplay, switchMap, tap } from 'rxjs'
import { UserConstants } from '../utils/user.constants'
import { AuthStatusTotalResponse, AppUser, UserRole } from '../utils/user.model'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { adminForm } from '../models/admin-form'
import { AdminUserLoadingStatus } from '../models/auth-user-loading-status'
import { IRepositoryService, OrderRequest, RepositoryResponseEntity } from '../../../shared/repository/repository.model'
import { RepositoryService } from '../../../shared/repository/repository.service'
import { AuthStatus, AuthUser } from '../../../auth/models/auth.model'
import { AuthConstants } from '../../../auth/models/auth.constants'
import { getCurrentUnixTime } from '../../../shared/utils/format-unix-time'
import { mapAppUser } from '../utils/app-user.mapper'

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private readonly restaurantCollectionId = 'restaurant'
  private readonly collection = UserConstants.collectionName
  private readonly authCollection = AuthConstants.collectionName
  private readonly appAuth = new BehaviorSubject<AppUser>(null)
  private readonly adminProviderId = AuthConstants.adminProviderId

  constructor(
    private repositoryService: RepositoryService<AppUser, AuthStatus>
  ) { }

  create(id: string, role: UserRole) {
    return this.repositoryService.getDocumentById<AuthUser>(this.authCollection, id).pipe(
      tap(v => console.log(v)),
      first(),
      map(user => ({ ...user, status: 'confirmed' as AuthStatus })),
      tap(v => console.log(v)),
      switchMap(user => this.repositoryService.setDocument(this.collection, mapAppUser(user, role), user.authId).pipe(
        map(() => ({ id: user.authId, auth: user })))))
  }

  getAll() {
    return this.repositoryService.getAllDocuments(this.collection)
  }

  getById(id: string) {
    return this.repositoryService.getDocumentById(this.collection, id)
  }

  getTotalByStatus(status: AuthStatus) {
    return this.repositoryService.getCollectionSizeByStatus<AuthStatus>(this.collection, status)
  }

  getTotalLabels() {
    // return forkJoin([
    //   this.getTotalByStatus('requested'),
    //   this.getTotalByStatus('client'),
    //   this.getTotalByStatus('employee'),
    //   this.getTotalByStatus('blocked'),
    // ]).pipe(
    //   map(([requested, client, employee, blocked]) => ({
    //     requested: requested,
    //     client: client,
    //     employee: employee,
    //     blocked: blocked,
    //   }))
    // )
    return EMPTY
  }

  getFirstPage(order: OrderRequest, size: number, status: AuthStatus) {
    return this.repositoryService.getFirstPage<AuthStatus>(this.collection, order, size, 'status', status)
  }

  getNextPage<V>(order: OrderRequest, size: number, status: AuthStatus, value: V) {
    return this.repositoryService.getNextPage<AuthStatus, V>(this.collection, order, size, 'status', status, value)
  }

  getPreviousPage<V>(order: OrderRequest, size: number, status: AuthStatus, value: V) {
    return this.repositoryService.getPreviousPage<AuthStatus, V>(this.collection, order, size, 'status', status, value)
  }

  getAllByQuery(property: string, value: string) {
    return this.repositoryService.getAllDocumentsByIncludesQuery(this.collection, property, value)
  }

  set(item: AppUser, id: string) {
    return this.repositoryService.setDocument(this.collection, item, id)
  }

  update(item: AppUser, id: string) {
    return this.repositoryService.updateDocument(this.collection, item, id)
  }

  updateStatus(status: AuthStatus, id: string) {
    // return this.repositoryService.updateDocument(this.collection, { status: status }, id)
    return EMPTY
  }

  updateRestaurant<T>(item: T): Observable<void> {
    // return this.repositoryService.setDocument(this.restaurantCollectionName, item, this.restaurantCollectionId)
    return EMPTY
  }


  getAllClients() {
    return this.repositoryService.getAllDocumentsByStatus(this.collection, 'client')
  }

}