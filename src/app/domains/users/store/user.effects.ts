import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import {
  catchError,
  combineLatest,
  EMPTY,
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
import { getCurrent, getSize, getTotal } from './user.selectors'
import { compareItemsRequestStateSize, formatRequest } from '../../../shared/utils/format-request'
import { formatResponseList } from '../../../shared/repository/repository.utils'

@Injectable()
export class UserEffects {

  constructor(
    private actions: Actions,
    private store: Store,
    private userService: UserService,
    private signalService: SignalService
  ) { }

  readonly moduleUrl = UserConstants.moduleUrl
  readonly defaultFirstPageRequest = UserConstants.defaultPageRequest

  updateStatus = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.updateUserStatus),
      tap(() => this.handleLoadingRequest()),
      switchMap(({ id, status }) =>
        this.userService.updateStatus(status, id).pipe(
          map(() => {
            this.handleLoadedRequest()
            return ItemActions.updateUserStatusSuccess()
          }),
          catchError(error => of(
            ItemActions.notifyError({ error, query: 'edit' }),
            ItemActions.setItemsLoadingStatus({ status: LoadingStatus.LoadingFailed })
          )))))
  )

  updateUserStatusSuccess = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.updateUserStatusSuccess),
      switchMap(() => of(ItemActions.getItems({ request: this.defaultFirstPageRequest }))))
  )

  getItem = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.getItem),
      tap(() => this.handleLoadingRequest()),
      switchMap(({ id }) =>
        this.userService.getById(id).pipe(
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
        this.store.select(getTotal),
        this.store.select(getSize)
      ),
      switchMap(([{ request }, current, total, stateSize]) => {
        const { query, size, item, sort, status } = formatRequest(request, stateSize)
        switch (query) {
          case 'first':
            return combineLatest([
              this.userService.getTotalLabels(),
              this.userService.getFirstPage(sort, size, status),
              this.userService.getTotalByStatus(status),
            ]).pipe(
              tap(() => this.handleLoadedRequest()),
              switchMap(([amount, items, total]) =>
                [
                  ItemActions.getItemsSuccess({
                    items: formatResponseList(query, items, total, current, compareItemsRequestStateSize(size, stateSize)),
                    size
                  }),
                  ItemActions.setItemsAmountByStatus({ status, amount })
                ]
              ),
              catchError(error => of(ItemActions.notifyError({ error, query })))
            )
          case 'next':
            return this.userService
              .getNextPage(sort, size, status, item[sort.active])
              .pipe(
                tap(() => this.handleLoadedRequest()),
                map(items => ItemActions.getItemsSuccess({ items: formatResponseList(query, items, total, current) })),
                catchError(error => of(ItemActions.notifyError({ error, query })))
              )
          case 'previous':
            return this.userService
              .getPreviousPage(sort, size, status, item[sort.active])
              .pipe(
                tap(() => this.handleLoadedRequest()),
                map(items => ItemActions.getItemsSuccess({ items: formatResponseList(query, items, total, current) })),
                catchError(error => of(ItemActions.notifyError({ error, query })))
              )
          default: return EMPTY
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