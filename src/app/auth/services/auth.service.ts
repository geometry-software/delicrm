import { Injectable, OnInit } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { GoogleAuthProvider, User } from 'firebase/auth'
import { combineLatest, concat, EMPTY, filter, first, from, map, of, shareReplay, switchMap, tap } from 'rxjs'
import { AdminUserLoadingStatus } from '../models/loading-status'
import { AuthConstants } from '../models/auth.constants'
import { RepositoryService } from '../../shared/repository/repository.service'
import { Router } from '@angular/router'
import { AuthUser } from '../models/auth.model'
import { mapAuthAdmin, mapAuthUser, setRestaurantAuth } from '../models/auth-user.mapper'
import { UserService } from '../../domains/users/services/user.service'
import { AppUser, UserRole } from '../../domains/users/utils/user.model'

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(
    private repositoryService: RepositoryService,
    private userService: UserService,
    private angularFireAuth: AngularFireAuth,
    private router: Router
  ) { }

  private readonly collection = AuthConstants.collectionName
  private readonly authCollectionId = AuthConstants.authCollectionId
  private readonly adminProviderId = AuthConstants.adminProviderId
  private isAdmin = (fireAuthUser) => fireAuthUser.providerId === this.adminProviderId
  private isEmailVerified = (fireAuthUser) => fireAuthUser.emailVerified

  readonly fireAuthUser = this.angularFireAuth.user.pipe(shareReplay(1))
  readonly isAdminEmailVerified = this.fireAuthUser.pipe(
    map(value => this.isEmailVerified(value) && this.isAdmin(value))
  )
  readonly isAdminUser = this.fireAuthUser.pipe(
    map(this.isAdmin)
  )
  readonly adminSignUpStatus = concat(
    of(AdminUserLoadingStatus.NotActivated),
    this.repositoryService.getCollectionSize(this.collection).pipe(
      map(value => value ? AdminUserLoadingStatus.Activated : AdminUserLoadingStatus.Void))
  )

  loginGoogle() {
    return from(this.angularFireAuth.signInWithPopup(new GoogleAuthProvider())
      .then(user => {
        console.log(user)
        return this.repositoryService.setDocument(this.collection, mapAuthUser(user), user.user.uid)
      }))
  }

  loginAnonymously() {
    return from(this.angularFireAuth.signInAnonymously()
      .then(user => console.log(user)))
  }

  loginAdmin(email: string, password: string) {
    return this.angularFireAuth.signInWithEmailAndPassword(email, password)
  }

  signUpAdmin(admin) {
    return from(this.angularFireAuth.createUserWithEmailAndPassword(admin.email, admin.password)
      .then(response => response.user.sendEmailVerification().then(() => response.user))).pipe(
        switchMap(user => this.repositoryService.setDocument(
          this.collection,
          mapAuthAdmin(user, admin.name),
          this.authCollectionId)
        ))
  }

  recoverAdminPassword(email: string) {
    return from(this.angularFireAuth.sendPasswordResetEmail(email))
  }

  logout() {
    return from(this.angularFireAuth.signOut()
      .then(() => this.router.navigate(['/auth/login'])))
  }

  addAppUser(id: string, role: UserRole) {
    return this.fireAuthUser.pipe(
      filter(this.isEmailVerified),
      switchMap(() => this.userService.create(id, role).pipe(
        switchMap(({ auth }) => this.repositoryService.setDocument(
          this.collection,
          setRestaurantAuth(auth.email),
          this.authCollectionId)
        ))
      ))
  }

}