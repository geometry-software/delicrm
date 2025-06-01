import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { GoogleAuthProvider } from 'firebase/auth'
import { BehaviorSubject, concat, from, map, of, shareReplay, switchMap } from 'rxjs'
import { AdminSignUpLoadingStatus } from '../models/loading-status'
import { AuthConstants } from '../models/auth.constants'
import { RepositoryService } from '../../shared/repository/repository.service'
import { Router } from '@angular/router'
import { AuthStatus, Auth } from '../models/auth.model'
import { mapAuth, mapUser } from '../models/auth.mapper'
import { SortRequest } from '../../shared/repository/repository.models'
import { BootstrapConstants } from '../../bootstrap/models/bootstrap.constants'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private repositoryService: RepositoryService<Auth, AuthStatus>,
    private angularFireAuth: AngularFireAuth,
    private router: Router
  ) { }

  private readonly collection = AuthConstants.collectionName
  private readonly adminCollectionId = AuthConstants.adminCollectionId
  private readonly firebaseProviderId = AuthConstants.firebaseProviderId
  private readonly isFirebaseConfirmedUser = (firebaseUser) =>
    firebaseUser?.providerId === this.firebaseProviderId && !firebaseUser?.isAnonymous

  readonly checkAdminRegistration = new BehaviorSubject<void>(null)
  readonly firebaseUser = this.angularFireAuth.user.pipe(
    // TODO. check why invoked multiple times
    shareReplay(1)
  )

  readonly isAdminEmailVerified = this.firebaseUser.pipe(
    map(value => value?.emailVerified && this.isFirebaseConfirmedUser(value)))

  readonly isAdminUser = this.firebaseUser.pipe(
    map(this.isFirebaseConfirmedUser)
  )

  readonly isRequestedAuth = this.firebaseUser.pipe(
    map(value => (value?.displayName && this.isFirebaseConfirmedUser(value))
      ? value.displayName
      : null
    ),
  )

  readonly adminSignUpStatus = this.checkAdminRegistration.pipe(
    switchMap(() => concat(
      of(AdminSignUpLoadingStatus.NotActivated),
      this.repositoryService.getCollectionSize(this.collection).pipe(
        map(value => value === 1 ? AdminSignUpLoadingStatus.Void : AdminSignUpLoadingStatus.Activated))))
  )

  readonly isAdminRegistered = this.repositoryService.getDocumentById(this.collection, this.adminCollectionId)

  linkWithGoogle() {
    return from(this.angularFireAuth.signOut()).pipe(
      switchMap(() => from(this.angularFireAuth.signInWithPopup(new GoogleAuthProvider())).pipe(
        map(auth => mapUser(
          auth.user.uid,
          auth.user.email,
          auth.user.displayName,
          auth.user.photoURL,
          BootstrapConstants.locale)),
        switchMap(auth => this.repositoryService.setDocument(this.collection, auth, auth.authId)))))
  }

  signUpAnonymously() {
    return from(this.angularFireAuth.signInAnonymously()).pipe(
      map(auth => mapAuth(auth.user.uid, BootstrapConstants.locale)),
      switchMap(auth => this.repositoryService.setDocument(this.collection, auth, auth.authId).pipe(
        map(() => auth))))
  }

  getAuth(id: string) {
    return this.repositoryService.getDocumentById(this.collection, id)
  }

  loginAdmin(email: string, password: string) {
    return from(this.angularFireAuth.signOut()).pipe(
      switchMap(() => from(this.angularFireAuth.signInWithEmailAndPassword(email, password))))
  }

  hasAdminUser() {
    return this.repositoryService.getAllDocumentsByStrictQuery(this.collection, { active: 'createdAt', direction: 'asc' }, 'role', 'admin')
  }

  signUpAdmin(email, password) {
    return from(this.angularFireAuth.signOut()).pipe(
      switchMap(() => from(this.angularFireAuth.createUserWithEmailAndPassword(email, password)).pipe(
        switchMap(response => from(response.user.sendEmailVerification()).pipe(
          switchMap(() => this.repositoryService.setDocument(this.collection, mapAuth(response.user.uid, BootstrapConstants.locale), this.adminCollectionId)))))))
  }

  getRequested(sort: SortRequest, size: number, status: AuthStatus) {
    return this.repositoryService.getFirstPage(this.collection, sort, size, status)
  }

  getTotalByStatus(status: AuthStatus) {
    return this.repositoryService.getCollectionSizeByStatus(this.collection, status)
  }

  deleteAdminAuth() {
    return this.repositoryService.deleteDocument(this.collection, this.adminCollectionId)
  }

  deleteRequested(id: string) {
    return this.repositoryService.deleteDocument(this.collection, id)
  }

  updateAuth(id: string, data: Partial<Auth>) {
    return this.repositoryService.updateDocument(this.collection, data, id)
  }

  updateLanguage(id: string, locale: string) {
    return this.repositoryService.updateDocument(this.collection, { locale }, id)
  }

  sendEmailVerification() {
    return this.firebaseUser.pipe(
      switchMap(user => user.sendEmailVerification())
    )
  }

  recoverAdminPassword(email: string) {
    return from(this.angularFireAuth.sendPasswordResetEmail(email))
  }

  logout() {
    return from(this.angularFireAuth.signOut().then(() =>
      this.router.navigate(['/auth/login'])))
  }

}