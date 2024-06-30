import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { GoogleAuthProvider, FacebookAuthProvider, OAuthProvider } from 'firebase/auth'
import firebase from 'firebase/compat/app'
import { BehaviorSubject, Observable, filter, forkJoin, from, map, of, shareReplay, switchMap, tap } from 'rxjs'
import { AuthConstants } from '../utils/auth.constants'
import { RepositoryService } from 'src/app/shared/repository/repository.service'
import { OrderRequest } from 'src/app/shared/repository/repository.model'
import { AuthStatus, AuthStatusTotalResponse, AuthUser, Restaurant } from '../utils/auth.model'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly restaurantCollectionId = 'restaurant'
  private readonly collection = AuthConstants.collectionName
  private readonly restaurantCollectionName = AuthConstants.restaurantCollectionName
  private readonly appAuth$ = new BehaviorSubject<AuthUser>(null)

  constructor(private repositoryService: RepositoryService, private angularFireAuth: AngularFireAuth) {}

  // getFirebaseAuth(): Observable<firebase.User> {
  //   return this.angularFireAuth.authState
  // }

  getAppAuth(): Observable<AuthUser> {
    return this.angularFireAuth.authState.pipe(
      // filter((value) => !!value),
      switchMap((value) =>
        value ? this.repositoryService.getDocumentValueChanges<AuthUser>(this.collection, value.uid).pipe() : of({ uid: null })
      ),
      shareReplay(1)
      // tap((value) => this.appAuth$.next(value))
    )
  }

  // getAppAuth(): Observable<AuthUser> {
  //   return this.appAuth$.asObservable().pipe(shareReplay(1))
  // }

  loginWithGoogle(): Observable<firebase.auth.UserCredential> {
    return from(this.angularFireAuth.signInWithPopup(new GoogleAuthProvider()))
  }

  loginWithFacebook(): Observable<firebase.auth.UserCredential> {
    return from(this.angularFireAuth.signInWithPopup(new FacebookAuthProvider()))
  }

  loginWithApple(): Observable<firebase.auth.UserCredential> {
    return from(this.angularFireAuth.signInWithPopup(new OAuthProvider('apple.com')))
  }

  loginAnonymously(): Observable<firebase.auth.UserCredential> {
    return from(this.angularFireAuth.signInAnonymously())
  }

  signInWithPhoneNumber(phone, capcha): Promise<firebase.auth.ConfirmationResult> {
    return this.angularFireAuth.signInWithPhoneNumber(phone, capcha)
  }

  signInWithEmailAndPassword(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.angularFireAuth.signInWithEmailAndPassword(email, password)
  }

  recoverPassword(email: string): Promise<void> {
    return this.angularFireAuth.sendPasswordResetEmail(email)
  }

  createUserWithEmailAndPassword(email: string, password: string): Promise<firebase.auth.UserCredential | void> {
    return this.angularFireAuth.createUserWithEmailAndPassword(email, password).then((user) => user.user.sendEmailVerification())
  }

  logout(): Observable<void> {
    return from(this.angularFireAuth.signOut())
  }

  getAll<T>(): Observable<T[]> {
    return this.repositoryService.getAllDocuments<T>(this.collection)
  }

  getById<T>(id: string): Observable<T> {
    return this.repositoryService.getDocumentById(this.collection, id)
  }

  getTotalByStatus(status: AuthStatus): Observable<number> {
    return this.repositoryService.getCollectionSizeByStatus<AuthStatus>(this.collection, status)
  }

  getTotalLabels(): Observable<AuthStatusTotalResponse> {
    return forkJoin([
      this.getTotalByStatus('requested'),
      this.getTotalByStatus('client'),
      this.getTotalByStatus('employee'),
      this.getTotalByStatus('blocked'),
    ]).pipe(
      map(([requested, client, employee, blocked]) => ({
        requested: requested,
        client: client,
        employee: employee,
        blocked: blocked,
      }))
    )
  }

  getFirstPage<T, S>(order: OrderRequest, size: number, status: S): Observable<T[]> {
    return this.repositoryService.getFirstPage<T, S>(this.collection, order, size, 'status', status)
  }

  getNextPage<T, S, V>(order: OrderRequest, size: number, status: S, value: V): Observable<T[]> {
    return this.repositoryService.getNextPage<T, S, V>(this.collection, order, size, 'status', status, value)
  }

  getPreviousPage<T, S, V>(order: OrderRequest, size: number, status: S, value: V): Observable<T[]> {
    return this.repositoryService.getPreviousPage<T, S, V>(this.collection, order, size, 'status', status, value)
  }

  getAllByQuery<T>(property: string, value: string): Observable<T[]> {
    return this.repositoryService.getAllDocumentsByIncludesQuery<T>(this.collection, property, value)
  }

  create<T>(item: T, id: string): Observable<void> {
    return this.repositoryService.createDocumentWithId<T>(this.collection, item, id)
  }

  update<T>(item: T, id: string): Observable<void> {
    return this.repositoryService.updateDocument(this.collection, item, id)
  }

  updateStatus<T>(status: T, id: string): Observable<void> {
    return this.repositoryService.updateDocument(this.collection, { status: status }, id)
  }

  updateRestaurant<T>(item: T): Observable<void> {
    return this.repositoryService.setDocument(this.restaurantCollectionName, item, this.restaurantCollectionId)
  }

  getRestaurant(): Observable<Restaurant> {
    return this.repositoryService.getDocumentById(this.restaurantCollectionName, this.restaurantCollectionId)
  }

  getAllClients(): Observable<AuthUser[]> {
    return this.repositoryService.getAllDocumentsByStatus<AuthUser>(this.collection, 'client')
  }
}
