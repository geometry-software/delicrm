import { Injectable } from '@angular/core'
import { EMPTY, Observable, combineLatest, concat, delay, filter, from, map, of, shareReplay, switchMap, tap } from 'rxjs'
import { UserConstants } from '../utils/user.constants'
import { User, UserLoadingStatus, UserRole } from '../utils/user.model'
import { OrderRequest } from '../../../shared/repository/repository.model'
import { RepositoryService } from '../../../shared/repository/repository.service'
import { AuthStatus, Auth } from '../../../auth/models/auth.model'
import { mapAppUser } from '../utils/app-user.mapper'
import { AuthService } from '../../../auth/services/auth.service'
import { setRestaurantAuth } from '../../../auth/models/auth-user.mapper'
import { AuthConstants } from '../../../auth/models/auth.constants'
import { getCurrentUnixTime } from '../../../shared/utils/format-unix-time'

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(
    private repositoryService: RepositoryService<User, AuthStatus>,
    private authService: AuthService,
  ) {
    // this.createDumpUsers()
  }

  createDumpUsers() {
    const arr: User[] = []
    const userAmount = 9
    for (let index = 0; index < userAmount; index++) {
      arr.push({
        auth: {
          authId: `${index + 1}`,
          avatar: '',
          createdAt: getCurrentUnixTime,
          email: 'mail@mail.com',
          displayName: 'User',
          providerId: 'google',
          status: 'requested',
          locale: 'pt'
        },
        name: `User ${index + 1}`,
        role: 'waiter',
        createdAt: getCurrentUnixTime,
        locale: 'pt',
        status: 'requested',
      })
    }
    from(arr).subscribe(user => {
      const item = user as any
      console.log(item);
      this.repositoryService.createDocument(this.collection, item)
    })

  }

  private readonly collection = UserConstants.collectionName
  private readonly authCollection = AuthConstants.collectionName
  private readonly authCollectionId = AuthConstants.authCollectionId

  readonly appUser = this.authService.fireAuthUser.pipe(
    switchMap(fireAuthUser => fireAuthUser?.uid
      ? this.repositoryService.getDocumentById(this.collection, fireAuthUser.uid)
      : of(null)),
    shareReplay(1)
  )

  readonly isUserLoading = concat(
    of(true),
    this.appUser.pipe(map(() => false))
  )

  createAdminUser(id: string, role: UserRole) {
    return this.authService.fireAuthUser.pipe(
      filter(user => user?.emailVerified),
      switchMap(() => this.authService.getUser(id).pipe(
        map(user => ({ ...user, status: 'confirmed' as AuthStatus })),
        switchMap(user => this.repositoryService.setDocument(
          this.collection,
          mapAppUser(user, role),
          user.authId
        ).pipe(switchMap(() => this.repositoryService.setDocument(
          this.authCollection,
          setRestaurantAuth(user.email),
          this.authCollectionId
        )))))))
  }

  create(user: Auth, role: UserRole) {
    return this.repositoryService.setDocument(this.collection, mapAppUser(user, role), user.authId).pipe(
      map(() => ({ id: user.authId, auth: user })))
  }

  getAll() {
    return this.repositoryService.getAllDocuments(this.collection)
  }

  getById(id: string) {
    return this.repositoryService.getDocumentById(this.collection, id)
  }

  getTotalByStatus(status: AuthStatus) {
    console.log(status);

    return this.repositoryService.getCollectionSizeByStatus<AuthStatus>(this.collection, status)
  }

  getTotalLabels() {
    return combineLatest([
      this.getTotalByStatus('requested'),
      this.getTotalByStatus('confirmed'),
      this.getTotalByStatus('blocked')
    ]).pipe(
      map(([requested, confirmed, blocked]) => ({
        requested, confirmed, blocked
      })),
      tap(value => {
        // console.warn('user getTotalLabels');
        // console.log(value);
      })
    )
  }

  getFirstPage(order: OrderRequest, size: number, status: AuthStatus) {
    // console.warn('users: getFirstPage Service');
    // console.log(order);
    // console.log(size);
    // console.log(status);
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

  set(item: User, id: string) {
    return this.repositoryService.setDocument(this.collection, item, id)
  }

  update(item: User, id: string) {
    return this.repositoryService.updateDocument(this.collection, item, id)
  }

  updateStatus(status: AuthStatus, id: string) {
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