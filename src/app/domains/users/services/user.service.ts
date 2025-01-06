import { Injectable } from '@angular/core'
import { BehaviorSubject, catchError, combineLatest, concat, filter, first, from, map, of, shareReplay, Subject, switchMap, tap } from 'rxjs'
import { RepositoryService } from '../../../shared/repository/repository.service'
import { AuthStatus, Auth } from '../../../auth/models/auth.model'
import { mapAppUser } from '../utils/app-user.mapper'
import { AuthService } from '../../../auth/services/auth.service'
import { AuthConstants } from '../../../auth/models/auth.constants'
import { getCurrentUnixTime } from '../../../shared/utils/format-unix-time'
import { User, UserRole } from '../models/user.model'
import { UserConstants } from '../models/user.constants'
import { SortRequest } from '../../../shared/repository/repository.models'
import { SignalService } from '../../../shared/services/signal.service'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { NotificationService } from '../../../shared/services/notification.service'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private repositoryService: RepositoryService<User, AuthStatus>,
    private authService: AuthService,
    private signalService: SignalService,
    private notificationService: NotificationService,
  ) {
    // this.createDumpUsers()
    this.initAuthSession()
  }

  readonly appUserSubject = new BehaviorSubject<User>(null)
  readonly appAuthSubject = new BehaviorSubject<Auth>(null)

  createDumpUsers() {
    const arr: User[] = []
    const userAmount = 9
    for (let index = 0; index < userAmount; index++) {
      // arr.push({
      //   auth: {
      //     authId: `${index + 1}`,
      //     // avatar: '',
      //     createdAt: getCurrentUnixTime(),
      //     // email: 'mail@mail.com',
      //     // displayName: 'User',
      //     providerId: 'google',
      //     deliveryInfo: {} as any,
      //     status: 'requested',
      //     // locale: 'pt'
      //   },
      //   name: `User ${index + 1}`,
      //   role: 'waiter',
      //   createdAt: getCurrentUnixTime(),
      //   locale: 'pt',
      //   status: 'requested',
      // })
    }
    from(arr).subscribe(user => {
      const item = user as any
      console.log(item);
      this.repositoryService.createDocument(this.collection, item)
    })
  }

  private readonly collection = UserConstants.collectionName

  readonly appUser = this.appUserSubject.asObservable()
  readonly appAuth = this.appAuthSubject.asObservable().pipe(
    tap(v => console.log(v))
  )

  initAuthSession() {
    this.authService.firebaseUser.pipe(
      first(),
      tap(() => this.signalService.setLoadingStatus(LoadingStatus.Loading)),
      switchMap(firebaseUser => firebaseUser?.uid
        ? this.repositoryService.getDocumentById(this.collection, firebaseUser.uid).pipe(
          switchMap(user => user
            ? of(this.appUserSubject.next(user))
            : this.authService.getAuth(firebaseUser.uid).pipe(
              switchMap(auth => auth
                ? of(this.appAuthSubject.next(auth))
                : of(null)),
              catchError(error => this.handleAuthError(error)))),
          catchError(error => this.handleAuthError(error)))
        : this.authService.signUpAnonymously().pipe(
          tap(auth => this.appAuthSubject.next(auth)))),
      tap(() => this.signalService.setLoadingStatus(LoadingStatus.Loaded)),
      catchError(error => this.handleAuthError(error))
    ).subscribe()
  }

  readonly isUserLoading = concat(
    of(true),
    this.appUser.pipe(map(() => false))
  )

  createAdminUser(id: string) {
    return this.authService.firebaseUser.pipe(
      filter(user => user?.emailVerified),
      switchMap(() => this.authService.getAuth(id).pipe(
        tap(v => console.log(v)),
        switchMap(auth => this.repositoryService.setDocument(this.collection, mapAppUser(auth, 'admin'), auth.authId)))))
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
    return this.repositoryService.getCollectionSizeByStatus(this.collection, status)
  }

  getTotalLabels() {
    return combineLatest([
      this.getTotalByStatus('requested'),
      this.getTotalByStatus('confirmed'),
      this.getTotalByStatus('blocked')
    ]).pipe(
      map(([requested, confirmed, blocked]) => ({
        requested, confirmed, blocked
      }))
    )
  }

  getFirstPage(order: SortRequest, size: number, status: AuthStatus) {
    return this.repositoryService.getFirstPage<AuthStatus>(this.collection, order, size, status)
  }

  getNextPage<V>(order: SortRequest, size: number, status: AuthStatus, value: number) {
    return this.repositoryService.getNextPage(this.collection, order, size, value, status)
  }

  getPreviousPage<V>(order: SortRequest, size: number, status: AuthStatus, value: number) {
    return this.repositoryService.getPreviousPage(this.collection, order, size, value, status)
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

  private handleAuthError(error: Error) {
    this.notificationService.error(error)
    this.signalService.setLoadingStatus(LoadingStatus.NotLoaded)
    console.error(error)
    return []
  }

}