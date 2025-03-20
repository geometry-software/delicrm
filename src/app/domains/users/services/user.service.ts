import { Injectable } from '@angular/core'
import { combineLatest, filter, map, switchMap } from 'rxjs'
import { RepositoryService } from '../../../shared/repository/repository.service'
import { Auth } from '../../../auth/models/auth.model'
import { mapAdminUser, mapRequestedUser, UserInfo } from '../utils/app-user.mapper'
import { AuthService } from '../../../auth/services/auth.service'
import { User, UserRole, UserStatus } from '../models/user.model'
import { UserConstants } from '../models/user.constants'
import { SortRequest } from '../../../shared/repository/repository.models'
import { AuthConstants } from '../../../auth/models/auth.constants'
import { BootstrapConstants } from '../../../bootstrap/models/bootstrap.constants'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private repositoryService: RepositoryService<User, UserStatus>,
    private authService: AuthService
  ) { }

  private readonly collection = UserConstants.collectionName

  createAdminUser(id: string, name: string) {
    return this.authService.firebaseUser.pipe(
      filter(firebaseUser => firebaseUser?.emailVerified),
      switchMap(firebaseUser => this.authService.getAuth(id).pipe(
        map(auth => mapAdminUser(auth.authId, {
          avatar: AuthConstants.adminAvatarPath,
          email: firebaseUser.email,
          locale: BootstrapConstants.locale,
          name
        })),
        switchMap(user => this.repositoryService.setDocument(this.collection, user, user.userId).pipe(
          map(() => user))))))
  }

  createRequestedUser(auth: Auth, role: UserRole, info: UserInfo) {
    return this.repositoryService.setDocument(this.collection, mapRequestedUser(auth.authId, role, info), auth.authId).pipe(
      map(() => ({ id: auth.authId, auth })))
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

  updateLanguage(id: string, locale: string) {
    return this.repositoryService.updateDocument(this.collection, { locale }, id)
  }

  updateStatus(id: string, status: UserStatus, role: UserRole) {
    return this.repositoryService.updateDocument(this.collection, { status, role }, id)
  }

}