import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { GoogleAuthProvider } from 'firebase/auth'
import { concat, from, map, of, shareReplay, switchMap } from 'rxjs'
import { AdminSignUpLoadingStatus } from '../models/loading-status'
import { AuthConstants } from '../models/auth.constants'
import { RepositoryService } from '../../shared/repository/repository.service'
import { Router } from '@angular/router'
import { AuthStatus, AuthUser } from '../models/auth.model'
import { mapAuthAdmin, mapAuthUser } from '../models/auth-user.mapper'

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(
    private repositoryService: RepositoryService<AuthUser, AuthStatus>,
    private angularFireAuth: AngularFireAuth,
    private router: Router
  ) { }

  private readonly isAdmin = (fireAuthUser) => fireAuthUser?.providerId === this.adminProviderId
  private readonly collection = AuthConstants.collectionName
  private readonly authCollectionId = AuthConstants.authCollectionId
  private readonly adminProviderId = AuthConstants.adminProviderId
  readonly fireAuthUser = this.angularFireAuth.user.pipe(shareReplay(1))
  readonly isAdminEmailVerified = this.fireAuthUser.pipe(
    map(value => value?.emailVerified && this.isAdmin(value))
  )
  readonly isAdminUser = this.fireAuthUser.pipe(
    map(this.isAdmin)
  )
  readonly adminSignUpStatus = concat(
    of(AdminSignUpLoadingStatus.NotActivated),
    this.repositoryService.getCollectionSize(this.collection).pipe(
      map(value => value ? AdminSignUpLoadingStatus.Activated : AdminSignUpLoadingStatus.Void))
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
          this.authCollectionId
        )))
  }

  getUser(id: string) {
    return this.repositoryService.getDocumentById(this.collection, id)
  }

  sendEmailVerification() {
    return this.fireAuthUser.pipe(
      switchMap(user => user.sendEmailVerification())
    )
  }

  recoverAdminPassword(email: string) {
    return from(this.angularFireAuth.sendPasswordResetEmail(email))
  }

  logout() {
    return from(this.angularFireAuth.signOut()
      .then(() => this.router.navigate(['/auth/login'])))
  }

}