import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects'
import {
  catchError,
  combineLatest,
  concatMap,
  forkJoin,
  map,
  of,
  switchMap,
  take,
  tap,
  withLatestFrom,
  zip,
} from 'rxjs'
import { UserActions as ItemActions } from './user.actions'
import { Router } from '@angular/router'
import { Action, Store } from '@ngrx/store'
import { getItemsPageAmount, getResetRequestToTheFirstPage } from './user.selectors'
import { UserService } from '../services/user.service'
import { UserConstants } from '../utils/user.constants'
import { AppUser } from '../utils/user.model'
import { formatAuthUser } from '../utils/format-auth-user'
import { ConfirmationService } from '../../../shared/services/confirmation.service'
import { formatRequest } from '../../../shared/utils/format-request'
import { UserActions } from '../store/user.actions'
import { LoadingStatus } from '../../../shared/models/loading-status'

@Injectable()
export class UserEffects implements OnInitEffects {
  constructor(
    private router: Router,
    private actions: Actions,
    private store: Store,
    private userService: UserService,
    private confirmationService: ConfirmationService
  ) { }

  ngrxOnInitEffects(): Action {
    return ItemActions.getItems({ request: this.defaultFirstPageRequest });
  }

  readonly moduleUrl = UserConstants.moduleUrl
  readonly confirmationTitleStart = UserConstants.confirmationTitleStart
  readonly confirmationTitleEnd = UserConstants.confirmationTitleEnd
  readonly defaultCreateStatus = UserConstants.defaultCreateStatus
  readonly defaultFirstPageRequest = UserConstants.defaultFirstPageRequest

  updateUserStatus = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.updateUserStatus),
      tap(() => this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Loading }))),
      switchMap(({ id, status }) => this.userService.updateStatus(status, id).pipe(
        map(() => ItemActions.updateUserStatusSuccess()),
        catchError(error => of(
          ItemActions.notifyError({ error, errorType: 'edit' }),
          UserActions.setItemsLoadingStatus({ status: LoadingStatus.LoadingFailed })
        )))))
  )

  updateUserStatusSuccess = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.updateUserStatusSuccess),
      switchMap(() => of(ItemActions.getItems({ request: this.defaultFirstPageRequest }))))
    // switchMap(() => of(ItemActions.getUsersTotalAmount(), ItemActions.getItems({ request: this.defaultFirstPageRequest }))))
  )

  updateItem = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.updateItem),
      switchMap(({ item, id }) =>
        this.userService.update(item, id).pipe(
          map(() => {
            // TODO: add notification through service
            // this.notificationService.notifyEditSuccess('message)
            this.router.navigate([this.moduleUrl, id])
            return ItemActions.updateItemSuccess()
          }),
          catchError(error => of(ItemActions.notifyError({ error, errorType: 'edit' })))
        )
      )
    )
  )

  getItem = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.getItem),
      switchMap(({ id }) =>
        this.userService.getById(id).pipe(
          map((item) => ItemActions.getItemSuccess({ item })),
          catchError(error => of(ItemActions.notifyError({ error, errorType: 'create' })))
        )
      )
    )
  )

  getItems = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.getItems),
      withLatestFrom(this.store.select(getResetRequestToTheFirstPage), this.store.select(getItemsPageAmount)),
      switchMap(([{ request }, resetRequest, pageAmount]) => {
        const { size, item, query, order, status } = formatRequest(request, resetRequest)
        // console.log(formatRequest(request, resetRequest));

        switch (query) {
          case 'first':
            return combineLatest([
              this.userService.getTotalLabels(),
              this.userService.getFirstPage(order, size, status).pipe(
                tap(value => {
                  console.warn('user getItems Effects');
                  console.log(value);
                })
              ),
            ]).pipe(
              map(([listLabelAmount, items]) =>
                ItemActions.getItemsSuccess({
                  items,
                  query: 'first',
                  total: items.length,
                  listLabelAmount,
                })
              ),
              catchError(error => of(ItemActions.notifyError({ error, errorType: 'edit' })))
            )
          case 'next':
            return this.userService
              .getNextPage<typeof order.key>(order, size, status, item[order.key])
              .pipe(
                map((items) =>
                  ItemActions.getItemsSuccess({
                    items,
                    query: 'next',
                    size: pageAmount,
                  })
                ),
                catchError(error => of(ItemActions.notifyError({ error, errorType: 'list' })))
              )
          case 'previous':
            return this.userService
              .getPreviousPage<typeof order.key>(order, size, status, item[order.key])
              .pipe(
                map((items) =>
                  ItemActions.getItemsSuccess({
                    items,
                    query: 'previous',
                    size: pageAmount,
                  })
                ),
                catchError(error => of(ItemActions.notifyError({ error, errorType: 'list' })))
              )
          default:
            return of(ItemActions.getItemsSuccess({ items: null, query: 'custom' }))
        }
      })
    )
  )

  getItemsBySearchQuery = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.getItemsBySearchQuery),
      switchMap(({ request }) =>
        this.userService.getAllByQuery(request.key, request.value).pipe(
          map((items) =>
            ItemActions.getItemsSuccess({
              items,
              query: 'custom',
              total: items.length,
            })
          ),
          catchError(error => of(ItemActions.notifyError({ error, errorType: 'list' })))
        )
      )
    )
  )

  notifyError = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.notifyError),
      tap(({ error }) => console.error(error))
      // switchMap(() => of(this.notificationService.notifyError()))
    ),
    { dispatch: false }
  )

}