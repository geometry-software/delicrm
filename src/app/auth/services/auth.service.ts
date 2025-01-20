import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { GoogleAuthProvider } from 'firebase/auth'
import { BehaviorSubject, concat, EMPTY, delay, from, map, of, shareReplay, switchMap, tap, Observable, catchError } from 'rxjs'
import { AdminSignUpLoadingStatus } from '../models/loading-status'
import { AuthConstants } from '../models/auth.constants'
import { RepositoryService } from '../../shared/repository/repository.service'
import { Router } from '@angular/router'
import { AuthStatus, Auth } from '../models/auth.model'
import { mapAuth, mapUserRequest } from '../models/auth.mapper'
// import { RestaurantConstants } from '../../domains/admin/models/restaurant.constants'

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
  private readonly isAdmin = (firebaseUser) =>
    firebaseUser?.providerId === this.firebaseProviderId && !firebaseUser?.isAnonymous

  readonly checkAdminRegistration = new BehaviorSubject<void>(null)
  readonly firebaseUser = this.angularFireAuth.user.pipe(
    // TODO. check why invoked multiple times
    shareReplay(1),
    // tap(v => console.log(v))
  )

  readonly isAdminEmailVerified = this.firebaseUser.pipe(
    map(value => value?.emailVerified && this.isAdmin(value)))

  readonly isAdminUser = this.firebaseUser.pipe(
    map(this.isAdmin))

  readonly adminSignUpStatus = this.checkAdminRegistration.pipe(
    switchMap(() => concat(
      of(AdminSignUpLoadingStatus.NotActivated),
      this.repositoryService.getCollectionSize(this.collection).pipe(
        map(value => value > 1 ? AdminSignUpLoadingStatus.Activated : AdminSignUpLoadingStatus.Void)))))

  readonly isAdminRegistered = this.repositoryService.getDocumentById(this.collection, this.adminCollectionId)

  linkWithGoogle() {
    return this.firebaseUser.pipe(
      switchMap(user => from(user.linkWithPopup(new GoogleAuthProvider())).pipe(
        switchMap(user => this.repositoryService.updateDocument(
          this.collection,
          {
            userRequest: mapUserRequest(user),
            name: user.user.displayName,
          },
          user.user.uid).pipe(
            catchError(v => {
              console.error(v);
              return of(v)
            })
          )))))
  }

  signUpAnonymously() {
    return from(this.angularFireAuth.signInAnonymously()).pipe(
      switchMap(user => this.repositoryService.setDocument(this.collection, mapAuth(user.user), user.user.uid).pipe(
        map(() => mapAuth(user.user))
      ))
    )
  }

  loginAdmin(email: string, password: string) {
    return from(this.angularFireAuth.signOut()).pipe(
      switchMap(() => from(this.angularFireAuth.signInWithEmailAndPassword(email, password))))
  }

  signUpAdmin(admin) {
    return from(this.angularFireAuth.signOut()).pipe(
      switchMap(() => from(this.angularFireAuth.createUserWithEmailAndPassword(admin.email, admin.password)).pipe(
        switchMap(response => from(response.user.sendEmailVerification()).pipe(
          switchMap(() => this.repositoryService.setDocument(
            this.collection,
            mapAuth(response.user, mapUserRequest(response.user)),
            this.adminCollectionId
          )))))))
  }

  getAuth(id: string) {
    return this.repositoryService.getDocumentById(this.collection, id)
  }

  deleteAdminAuth() {
    return this.repositoryService.deleteDocument(this.collection, this.adminCollectionId)
  }

  updateAuth(id: string, data: Partial<Auth>) {
    return this.repositoryService.updateDocument(this.collection, data, id)
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
    return from(this.angularFireAuth.signOut()
      .then(() => this.router.navigate(['/auth/login'])))
  }

}