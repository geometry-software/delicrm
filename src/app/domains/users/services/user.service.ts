import { Injectable } from '@angular/core'
import { BehaviorSubject, catchError, combineLatest, concat, EMPTY, filter, first, map, of, switchMap, tap } from 'rxjs'
import { RepositoryService } from '../../../shared/repository/repository.service'
import { Auth } from '../../../auth/models/auth.model'
import { mapAdminUser, mapRequestedUser, UserInfo } from '../utils/app-user.mapper'
import { AuthService } from '../../../auth/services/auth.service'
import { User, UserRole, UserStatus } from '../models/user.model'
import { UserConstants } from '../models/user.constants'
import { SortRequest } from '../../../shared/repository/repository.models'
import { SignalService } from '../../../shared/services/signal.service'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { NotificationService } from '../../../shared/services/notification.service'
import { AuthConstants } from '../../../auth/models/auth.constants'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private repositoryService: RepositoryService<User, UserStatus>,
    private authService: AuthService,
    private signalService: SignalService,
    private notificationService: NotificationService,
  ) {
    this.initAuthSession()
  }

  private readonly collection = UserConstants.collectionName
  private readonly collectionAuth = AuthConstants.collectionName
  private readonly appUserSubject = new BehaviorSubject<User>(null)
  private readonly appAuthSubject = new BehaviorSubject<Auth>(null)

  setUser(user: User) {
    this.appUserSubject.next(user)
  }

  getUser() {
    return this.appUserSubject.asObservable()
  }

  setAuth(auth: Auth) {
    this.appAuthSubject.next(auth)
  }

  getAuth() {
    return this.appAuthSubject.asObservable()
  }

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
    this.getUser().pipe(map(() => false))
  )

  createAdminUser(id: string, name: string) {
    return this.authService.firebaseUser.pipe(
      filter(firebaseUser => firebaseUser?.emailVerified),
      switchMap(firebaseUser => this.authService.getAuth(id).pipe(
        map(auth => mapAdminUser(auth.authId, {
          avatar: AuthConstants.adminAvatarPath,
          email: firebaseUser.email,
          locale: AuthConstants.defaultLocale,
          name
        })),
        switchMap(user => this.repositoryService.setDocument(this.collection, user, user.userId).pipe(
          map(() => user))))))
  }

  createRequestedUser(auth: Auth, role: UserRole, info: UserInfo) {
    return this.repositoryService.setDocument(this.collection, mapRequestedUser(auth.authId, role, info), auth.authId).pipe(
      map(() => ({ id: auth.authId, auth })))
  }

  getAll() {
    return this.repositoryService.getAllDocuments(this.collectionAuth)
  }

  getById(id: string) {
    return this.repositoryService.getDocumentById(this.collection, id)
  }

  getTotalByStatus(status: UserStatus) {
    return this.repositoryService.getCollectionSizeByStatus(this.collection, status)
  }

  getTotalLabels() {
    return combineLatest([
      this.getTotalByStatus('active'),
      this.authService.getTotalByStatus('requested'),
      this.getTotalByStatus('blocked')
    ]).pipe(
      map(([active, requested, blocked]) => ({
        active, requested, blocked
      }))
    )
  }

  getFirstPage(sort: SortRequest, size: number, status: UserStatus) {
    return this.repositoryService.getFirstPage(this.collection, sort, size, status)
  }

  getNextPage(order: SortRequest, size: number, status: UserStatus, value: number) {
    return this.repositoryService.getNextPage(this.collection, order, size, value, status)
  }

  getPreviousPage(order: SortRequest, size: number, status: UserStatus, value: number) {
    return this.repositoryService.getPreviousPage(this.collection, order, size, value, status)
  }

  getAllByQuery(property: string, value: string) {
    return this.repositoryService.getAllDocumentsByIncludesQuery(this.collection, property, value)
  }

  set(item: User, id: string) {
    return this.repositoryService.setDocument(this.collection, item, id)
  }

  updateName(name: string, id: string) {
    return this.repositoryService.updateDocument(this.collection, { name }, id)
  }

  updateStatus(id: string, status: UserStatus, role: UserRole) {
    return this.repositoryService.updateDocument(this.collection, { status, role }, id)
  }

  private handleAuthError(error: Error) {
    this.notificationService.error(error)
    this.signalService.setLoadingStatus(LoadingStatus.NotLoaded)
    console.error(error)
    return EMPTY
  }

}