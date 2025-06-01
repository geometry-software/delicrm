import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import {
  catchError,
  combineLatest,
  map,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs'
import { UserActions as ItemActions } from './user.actions'
import { Store } from '@ngrx/store'
import { UserService } from '../services/user.service'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { UserConstants } from '../models/user.constants'
import { SignalService } from '../../../shared/services/signal.service'
import { getCurrent, getSize } from './user.selectors'
import { formatRequest } from '../../../shared/utils/format-request'
import { formatResponseList } from '../../../shared/repository/repository.utils'
import { NotificationService } from '../../../shared/services/notification.service'
import { TranslateService } from '@ngx-translate/core'
import { AuthService } from '../../../auth/services/auth.service'

@Injectable()
export class UserEffects {

  constructor(
    private actions: Actions,
    private store: Store,
    private userService: UserService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private signalService: SignalService
  ) { }

  readonly moduleUrl = UserConstants.moduleUrl
  readonly defaultFirstPageRequest = UserConstants.defaultPageRequest

  updateStatus = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.updateUserStatus),
      tap(() => this.handleLoadingRequest()),
      switchMap(({ id, status, role, user }) => user
        ? this.userService.set(user, id).pipe(
          switchMap(() => this.authService.deleteRequested(id).pipe(
            map(() => {
              this.handleLoadedRequest()
              return ItemActions.updateUserStatusSuccess()
            }),
            catchError(error => of(
              ItemActions.notifyError({ error, query: 'edit' }),
              ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Failed })
            )))))
        : this.userService.updateStatus(id, status, role).pipe(
          map(() => {
            this.handleLoadedRequest()
            return ItemActions.updateUserStatusSuccess()
          }),
          catchError(error => of(
            ItemActions.notifyError({ error, query: 'edit' }),
            ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Failed })
          )))
      ))
  )

  updateUserStatusSuccess = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.updateUserStatusSuccess),
      switchMap(() => of(ItemActions.getItems({ request: this.defaultFirstPageRequest }))))
  )

  updateUserName = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.updateUserName),
      tap(() => this.handleLoadingRequest()),
      switchMap(({ name, id }) => this.userService.updateName(name, id).pipe(
        map(() => ItemActions.updateUserNameSuccess()))))
  )

  updateUserNameSuccess = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.updateUserNameSuccess),
      tap(() => {
        const message = this.translateService.instant('USERS.FORM.CHANGE_NAME_SUCCESS')
        this.notificationService.success(message)
        this.handleLoadedRequest()
      })),
    { dispatch: false }
  )

  getItem = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.getItem),
      tap(() => this.handleLoadingRequest()),
      switchMap(({ id }) =>
        this.userService.getUser(id).pipe(
          map(item => {
            this.handleLoadedRequest()
            return ItemActions.getItemSuccess({ item })
          }),
          catchError(error => of(ItemActions.notifyError({ error, query: 'detail' })))
        )))
  )

  getItems = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.getItems),
      tap(() => this.handleLoadingRequest()),
      withLatestFrom(
        this.store.select(getCurrent),
        this.store.select(getSize)
      ),
      switchMap(([{ request }, current, stateSize]) => {
        const { query, size, item, sort, status } = formatRequest(request, stateSize)
        if (status === 'requested') {
          return combineLatest([
            this.userService.getTotalLabels(),
            this.authService.getRequested(sort, size, status),
            this.userService.getTotalByStatus(status),
          ]).pipe(
            tap(() => this.handleLoadedRequest()),
            switchMap(([amount, items, total]) =>
              [
                ItemActions.getItemsSuccess({
                  items: formatResponseList(query, items as any, total, current),
                  size
                }),
                ItemActions.setItemsAmountByStatus({ status, amount })
              ]
            ),
            catchError(error => of(ItemActions.notifyError({ error, query })))
          )
        } else {
          return combineLatest([
            this.userService.getTotalLabels(),
            this.userService.getFirstPage(sort, size, status),
            this.userService.getTotalByStatus(status),
          ]).pipe(
            tap(() => this.handleLoadedRequest()),
            switchMap(([amount, items, total]) =>
              [
                ItemActions.getItemsSuccess({
                  items: formatResponseList(query, items, total, current),
                  size
                }),
                ItemActions.setItemsAmountByStatus({ status, amount })
              ]
            ),
            catchError(error => of(ItemActions.notifyError({ error, query })))
          )
        }
      }))
  )

  notifyError = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.notifyError),
      tap(({ error }) => console.error(error))),
    // TODO
    // switchMap(() => of(this.notificationService.notifyError()))
    { dispatch: false }
  )

  private handleLoadingRequest() {
    this.signalService.setLoadingStatus(LoadingStatus.Loading)
    this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Loading }))
  }

  private handleLoadedRequest() {
    this.signalService.setLoadingStatus(LoadingStatus.Loaded)
    this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Loaded }))
  }

}