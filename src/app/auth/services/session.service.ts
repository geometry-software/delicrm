import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { GoogleAuthProvider } from 'firebase/auth'
import { BehaviorSubject, concat, from, map, of, shareReplay, switchMap, catchError, tap, EMPTY, Subject, first, merge, combineLatest } from 'rxjs'
import { AdminSignUpLoadingStatus } from '../models/loading-status'
import { AuthConstants } from '../models/auth.constants'
import { RepositoryService } from '../../shared/repository/repository.service'
import { Router } from '@angular/router'
import { AuthStatus, Auth } from '../models/auth.model'
import { mapAuth } from '../models/auth.mapper'
import { SortRequest } from '../../shared/repository/repository.models'
import { UserConstants } from '../../domains/users/models/user.constants'
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
    private notificationService: NotificationService,
  ) {
    this.initAuthSession()
  }

  private readonly appUserSubject = new BehaviorSubject<User>(null)
  private readonly appAuthSubject = new BehaviorSubject<Auth>(null)

  readonly isSessionLoading = concat(
    of(true),
    merge(this.getUser(), this.getAuth()).pipe(map(() => false))
  )

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
        ? this.userService.getById(firebaseUser.uid).pipe(
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