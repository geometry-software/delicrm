import { Injectable } from '@angular/core'
import { BehaviorSubject, concat, map, of, switchMap, catchError, tap, EMPTY, first, merge, combineLatest } from 'rxjs'
import { Auth } from '../models/auth.model'
import { AuthService } from './auth.service'
import { UserService } from '../../domains/users/services/user.service'
import { SignalService } from '../../shared/services/signal.service'
import { LoadingStatus } from '../../shared/models/loading-status'
import { NotificationService } from '../../shared/services/notification.service'
import { User } from '../../domains/users/models/user.model'

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private signalService: SignalService,
    private notificationService: NotificationService
  ) {
    this.initAuthSession()
  }

  private readonly appUserSubject = new BehaviorSubject<User>(null)
  private readonly appAuthSubject = new BehaviorSubject<Auth>(null)

  readonly isSessionLoading = merge(
    this.getUser(),
    this.getAuth()
  ).pipe(map(value => value ? false : true))

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

  changeLanguage(locale: string) {
    return combineLatest([this.getAuth(), this.getUser()]).pipe(
      switchMap(value => {
        if (value[0]) {
          return this.authService.updateLanguage(value[0].authId, locale)
        }
        if (value[1]) {
          return this.userService.updateLanguage(value[1].userId, locale)
        }
        return EMPTY
      })
    )
  }

  private initAuthSession() {
    this.authService.firebaseUser.pipe(
      first(),
      tap(() => this.signalService.setLoadingStatus(LoadingStatus.Loading)),
      switchMap(firebaseUser => firebaseUser?.uid
        ? this.userService.getUser(firebaseUser.uid).pipe(
          switchMap(user => user
            ? of(this.setUser(user))
            : this.authService.getAuth(firebaseUser.uid).pipe(
              switchMap(auth => auth
                ? of(this.setAuth(auth))
                : of(null)),
              catchError(error => this.handleAuthError(error)))),
          catchError(error => this.handleAuthError(error)))
        : this.authService.signUpAnonymously().pipe(
          tap(auth => this.setAuth(auth)))),
      tap(() => this.signalService.setLoadingStatus(LoadingStatus.Loaded)),
      catchError(error => this.handleAuthError(error))
    ).subscribe()
  }

  private handleAuthError(error: Error) {
    this.notificationService.error(error)
    this.signalService.setLoadingStatus(LoadingStatus.Failed)
    console.error(error)
    return EMPTY
  }

}