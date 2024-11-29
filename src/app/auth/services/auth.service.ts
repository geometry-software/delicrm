import { Injectable, OnInit } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { GoogleAuthProvider, User } from 'firebase/auth'
import { combineLatest, concat, EMPTY, filter, from, map, of, shareReplay, switchMap, tap } from 'rxjs'
import { AdminUserLoadingStatus } from '../models/auth-user-loading-status'
import { AuthConstants } from '../models/auth.constants'
import { RepositoryService } from '../../shared/repository/repository.service'
import { Router } from '@angular/router'
import { AuthUser } from '../models/auth.model'
import { mapAuthAdmin, mapAuthUser } from '../models/auth-user.mapper'
import { UserService } from '../../domains/users/services/user.service'
import { AppUser } from '../../domains/users/utils/user.model'

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {

  private readonly collection = AuthConstants.collectionName
  private readonly authAdminCollectionId = AuthConstants.authAdminCollectionId
  private readonly adminProviderId = AuthConstants.adminProviderId

  constructor(
    private repositoryService: RepositoryService,
    private userService: UserService,
    private angularFireAuth: AngularFireAuth,
    private router: Router
  ) { }

  readonly fireAuthUser = this.angularFireAuth.user.pipe(shareReplay(1))

  ngOnInit(): void {
    this.fireAuthUser.pipe(
      tap(user => {
        console.log(user)
        if (!user) {
          this.router.navigate(['/menu'])
        }
      }),
      filter(Boolean),
      map(angularFireAuth => angularFireAuth.providerId === this.adminProviderId && angularFireAuth.emailVerified
        ? this.setAppAdmin(angularFireAuth.uid)
        : EMPTY))
      .subscribe()
  }

  isAdminUser = this.fireAuthUser.pipe(
    map(value => value.providerId === this.adminProviderId)
  )

  adminSignUpStatus = concat(
    of(AdminUserLoadingStatus.NotActivated),
    this.angularFireAuth.user.pipe(
      switchMap(() => this.repositoryService.getCollectionSize(this.collection).pipe(
        map(value => value
          ? AdminUserLoadingStatus.Activated
          : AdminUserLoadingStatus.Void))))
  )

  loginGoogle() {
    return from(this.angularFireAuth.signInWithPopup(new GoogleAuthProvider())
      .then(user => {
        console.log(user)
        this.createAuthRequest(user)
      }))
  }

  loginAnonymously() {
    return from(this.angularFireAuth.signInAnonymously()
      .then(user => console.log(user)))
  }

  loginAdmin(email: string, password: string) {
    return this.angularFireAuth.signInWithEmailAndPassword(email, password)
  }

  signUpAdmin(user) {
    return from(this.angularFireAuth.createUserWithEmailAndPassword(user.email, user.password)
      .then(response => {
        response.user.sendEmailVerification()
        return response.user
      })).pipe(
        switchMap((firebaseUser) => {
          const item = mapAuthAdmin(firebaseUser, user.name)
          return this.repositoryService.setDocument(this.collection, item, this.authAdminCollectionId)
        }))
  }

  recoverAdminPassword(email: string) {
    return from(this.angularFireAuth.sendPasswordResetEmail(email))
  }

  logout() {
    return from(this.angularFireAuth.signOut()
      .then(() => this.router.navigate(['/auth/login'])))
  }

  private createAuthRequest(user) {
    const item = mapAuthUser(user)
    this.repositoryService.setDocument(this.collection, item, item.authId)
    // .pipe(
    //   tap(() => this.setAuthUser(item, item.authId)))
  }

  private setAppAdmin(id: string) {
    console.log('setAppAdmin');
    return this.userService.create('admin').pipe(
      switchMap(() => this.repositoryService.deleteDocument(this.collection, id))
    )
  }

}