import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects'
import {
  catchError,
  combineLatest,
  concatMap,
  EMPTY,
  forkJoin,
  map,
  of,
  switchMap,
  take,
  tap,
  withLatestFrom,
  zip,
} from 'rxjs'
import { DeliveryActions as ItemActions } from './orders.actions'
import { Router } from '@angular/router'
import { Action, Store } from '@ngrx/store'
import { getItemsPageAmount, getResetRequestToTheFirstPage } from './orders.selectors'
// import { OrderService } from '../services/order.service'
import { ConfirmationService } from '../../../shared/services/confirmation.service'
import { formatRequest } from '../../../shared/utils/format-request'

import { LoadingStatus } from '../../../shared/models/loading-status'
// import { OrderConstants } from '../models/order.constants'
import { SignalService } from '../../../shared/services/signal.service'
import { DeliveryService } from '../services/delivery.service'

@Injectable()
export class DeliveryEffects implements OnInitEffects {

  constructor(
    private router: Router,
    private actions: Actions,
    private store: Store,
    private deliveryService: DeliveryService,
    private signalService: SignalService
  ) { }

  readonly moduleUrl = OrderConstants.moduleUrl
  // readonly confirmationTitleStart = OrderConstants.confirmationTitleStart
  // readonly confirmationTitleEnd = OrderConstants.confirmationTitleEnd
  readonly defaultCreateStatus = OrderConstants.defaultCreateStatus
  readonly defaultFirstPageRequest = OrderConstants.defaultFirstPageRequest

  updateOrderStatus = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.updateOrderStatus),
      tap(() => this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Loading }))),
      switchMap(({ id, status }) => this.deliveryService.updateStatus(status, id).pipe(
        map(() => ItemActions.updateOrderStatusSuccess()),
        catchError(error => of(
          ItemActions.notifyError({ error, errorType: 'edit' }),
          OrderActions.setItemsLoadingStatus({ status: LoadingStatus.LoadingFailed })
        )))))
  )

  // updateOrderStatusSuccess = createEffect(() =>
  //   this.actions.pipe(
  //     ofType(ItemActions.updateOrderStatusSuccess),
  //     switchMap(() => of(ItemActions.getItems({ request: this.defaultFirstPageRequest }))))
  //   // switchMap(() => of(ItemActions.getOrdersTotalAmount(), ItemActions.getItems({ request: this.defaultFirstPageRequest }))))
  // )

  updateItem = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.updateItem),
      switchMap(({ item, id }) =>
        this.deliveryService.update(item, id).pipe(
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
        this.deliveryService.getById(id).pipe(
          map((item) => ItemActions.getItemSuccess({ item })),
          catchError(error => of(ItemActions.notifyError({ error, errorType: 'create' })))
        )
      )
    )
  )

  getItems = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.getItems),
      tap(() => {
        this.signalService.setLoadingStatus(LoadingStatus.Loading)
        this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Loading }))
      }),
      withLatestFrom(this.store.select(getResetRequestToTheFirstPage), this.store.select(getItemsPageAmount)),
      switchMap(([{ request }, resetRequest, pageAmount]) => {
        const { size, item, query, order, status } = formatRequest(request, resetRequest)
        console.log(formatRequest(request, resetRequest));

        switch (query) {
          case 'first':
            return combineLatest([
              this.deliveryService.getTotalLabels(),
              this.deliveryService.getFirstPage(order, size, status)
            ]).pipe(
              tap(() => this.handleLoadedRequest()),
              map(([itemAmountByStatus, items]) =>
                ItemActions.getItemsSuccess({
                  items,
                  query: 'first',
                  total: items.length,
                  itemAmountByStatus,
                })
              ),
              catchError(error => of(ItemActions.notifyError({ error, errorType: 'edit' })))
            )
          case 'next':
            return this.deliveryService
              .getNextPage<typeof order.key>(order, size, status, item[order.key])
              .pipe(
                tap(() => this.handleLoadedRequest()),
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
            return this.deliveryService
              .getPreviousPage<typeof order.key>(order, size, status, item[order.key])
              .pipe(
                tap(() => this.handleLoadedRequest()),
                map((items) =>
                  ItemActions.getItemsSuccess({
                    items,
                    query: 'previous',
                    size: pageAmount,
                  })
                ),
                catchError(error => of(ItemActions.notifyError({ error, errorType: 'list' })))
              )
          default: return EMPTY
        }
      })
    )
  )

  getItemsBySearchQuery = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.getItemsBySearchQuery),
      switchMap(({ request }) =>
        this.deliveryService.getAllByQuery(request.key, request.value).pipe(
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
      tap(({ error }) => console.error(error))),
    // switchMap(() => of(this.notificationService.notifyError()))
    { dispatch: false }
  )

  ngrxOnInitEffects(): Action {
    return ItemActions.getItems({ request: this.defaultFirstPageRequest })
  }

  private handleLoadedRequest() {
    this.signalService.setLoadingStatus(LoadingStatus.Loaded)
    this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Loaded }))
  }

}