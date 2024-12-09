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
import { ClientActions as ItemActions } from './client.actions'
import { Router } from '@angular/router'
import { Action, Store } from '@ngrx/store'
import { getItemsPageAmount, getResetRequestToTheFirstPage } from './client.selectors'
import { ClientService } from '../services/client.service'
import { ClientConstants } from '../utils/client.constants'
import { ConfirmationService } from '../../../shared/services/confirmation.service'
import { formatRequest } from '../../../shared/utils/format-request'
import { ClientActions } from './client.actions'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { Client, ClientStatus } from '../models/client.model'

@Injectable()
export class ClientEffects implements OnInitEffects {

  constructor(
    private router: Router,
    private actions: Actions,
    private store: Store,
    private clientService: ClientService,
    private confirmationService: ConfirmationService
  ) { }

  readonly moduleUrl = ClientConstants.moduleUrl
  readonly confirmationTitleStart = ClientConstants.confirmationTitleStart
  readonly confirmationTitleEnd = ClientConstants.confirmationTitleEnd
  readonly defaultCreateStatus = ClientConstants.defaultCreateStatus
  readonly defaultFirstPageRequest = ClientConstants.defaultFirstPageRequest

  // updateUserStatus = createEffect(() =>
  //   this.actions.pipe(
  //     ofType(ItemActions.updateClientStatus),
  //     tap(() => this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Loading }))),
  //     switchMap(({ id, status }) => this.userService.updateStatus(status, id).pipe(
  //       map(() => ItemActions.updateClientStatusSuccess()),
  //       catchError(error => of(
  //         ItemActions.notifyError({ error, errorType: 'edit' }),
  //         ClientActions.setItemsLoadingStatus({ status: LoadingStatus.LoadingFailed })
  //       )))))
  // )

  updateUserStatusSuccess = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.updateClientStatusSuccess),
      switchMap(() => of(ItemActions.getItems({ request: this.defaultFirstPageRequest }))))
    // switchMap(() => of(ItemActions.getUsersTotalAmount(), ItemActions.getItems({ request: this.defaultFirstPageRequest }))))
  )

  updateItem = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.updateItem),
      switchMap(({ item, id }) =>
        this.clientService.update(item, id).pipe(
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
        this.clientService.getById(id).pipe(
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
        const { size, item, query, order, status } = formatRequest<Client, ClientStatus>(request, resetRequest)
        // console.log(formatRequest(request, resetRequest));

        switch (query) {
          case 'first':
            return combineLatest([
              this.clientService.getTotalLabels(),
              this.clientService.getFirstPage(order, size, status).pipe(
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
            return this.clientService
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
            return this.clientService
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
        this.clientService.getAllByQuery(request.key, request.value).pipe(
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
    ), { dispatch: false }
  )

  ngrxOnInitEffects(): Action {
    return ItemActions.getItems({ request: this.defaultFirstPageRequest });
  }

}