import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { GoogleAuthProvider, FacebookAuthProvider, OAuthProvider } from 'firebase/auth'
import firebase from 'firebase/compat/app'
import { BehaviorSubject, EMPTY, Observable, concat, filter, forkJoin, from, map, of, shareReplay, switchMap, tap } from 'rxjs'
import { UserConstants } from '../utils/user.constants'
import { AuthStatus, AuthStatusTotalResponse, AppUser, Restaurant, UserRole } from '../utils/user.model'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { adminForm } from '../models/admin-form'
import { AdminUserLoadingStatus } from '../models/auth-user-loading-status'
import { IRepositoryService, OrderRequest, RepositoryResponseEntity } from '../../../shared/repository/repository.model'
import { RepositoryService } from '../../../shared/repository/repository.service'
import { AuthUser } from '../../../auth/models/auth.model'
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
  private readonly restaurantCollectionName = UserConstants.restaurantCollectionName
  private readonly appAuth = new BehaviorSubject<AppUser>(null)
  private readonly adminProviderId = AuthConstants.adminProviderId

  constructor(
    private repositoryService: RepositoryService<AppUser, AuthStatus>
  ) { }

  create(role: UserRole) {
    return this.repositoryService.getDocumentById<AuthUser>(this.authCollection, this.adminProviderId).pipe(
      switchMap(user => {
        const item: AppUser = mapAppUser(user, role)
        return this.repositoryService.setDocument(this.collection, item, user.authId).pipe(
          map(() => item.auth.authId)
        )
      })
    )
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
    return forkJoin([
      this.getTotalByStatus('requested'),
      this.getTotalByStatus('client'),
      this.getTotalByStatus('employee'),
      this.getTotalByStatus('blocked'),
    ]).pipe(
      map(([requested, client, employee, blocked]) => ({
        requested: requested,
        client: client,
        employee: employee,
        blocked: blocked,
      }))
    )
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

  getRestaurant(): Observable<Restaurant> {
    // return this.repositoryService.getDocumentById(this.restaurantCollectionName, this.restaurantCollectionId)
    return EMPTY
  }

  getAllClients() {
    return this.repositoryService.getAllDocumentsByStatus(this.collection, 'client')
  }

}