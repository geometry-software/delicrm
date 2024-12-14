import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects'
import {
  catchError,
  combineLatest,
  concatMap,
  distinctUntilChanged,
  EMPTY,
  forkJoin,
  map,
  of,
  skip,
  switchMap,
  take,
  tap,
  withLatestFrom,
  zip,
} from 'rxjs'
import { OrderActions as ItemActions } from './orders.actions'
import { Router } from '@angular/router'
import { Action, Store } from '@ngrx/store'
import { getCurrent, getItemsPageAmount, getQuery, getSize, getStatus, getTotal } from './orders.selectors'
import { OrderService } from '../services/order.service'
import { ConfirmationService } from '../../../shared/services/confirmation.service'
import { compareItemsRequestStateSize, formatRequest } from '../../../shared/utils/format-request'
import { OrderActions } from './orders.actions'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { OrderConstants } from '../models/order.constants'
import { SignalService } from '../../../shared/services/signal.service'
import { formatResponseList } from '../../../shared/repository/repository.utils'
import { RepositoryRequestListQuery } from '../../../shared/repository/repository.models'

@Injectable()
export class OrderEffects {

  constructor(
    private router: Router,
    private actions: Actions,
    private store: Store,
    private orderService: OrderService,
    private signalService: SignalService
  ) { }

  readonly moduleUrl = OrderConstants.moduleUrl
  // readonly confirmationTitleStart = OrderConstants.confirmationTitleStart
  // readonly confirmationTitleEnd = OrderConstants.confirmationTitleEnd
  // readonly defaultCreateStatus = OrderConstants.defaultCreateStatus
  // readonly defaultPageRequest = OrderConstants.defaultPageRequest

  updateOrderStatus = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.updateOrderStatus),
      tap(() => this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Loading }))),
      switchMap(({ id, status }) => this.orderService.updateStatus(status, id).pipe(
        map(() => ItemActions.updateOrderStatusSuccess()),
        catchError(error => of(
          ItemActions.notifyError({ error, query: 'edit' }),
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
        this.orderService.update(item, id).pipe(
          map(() => {
            // TODO: add notification through service
            // this.notificationService.notifyEditSuccess('message)
            this.router.navigate([this.moduleUrl, id])
            return ItemActions.updateItemSuccess()
          }),
          catchError(error => of(ItemActions.notifyError({ error, query: 'edit' })))
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
              this.orderService.getTotalLabels(),
              this.orderService.getFirstPage(sort, size, status),
              this.orderService.getTotalByStatus(status),
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
            return this.orderService
              .getNextPage<typeof sort.active>(sort, size, status, item[sort.active])
              .pipe(
                tap(() => this.handleLoadedRequest()),
                map(items => ItemActions.getItemsSuccess({ items: formatResponseList(query, items, total, current) })),
                catchError(error => of(ItemActions.notifyError({ error, query })))
              )
          case 'previous':
            return this.orderService
              .getPreviousPage<typeof sort.active>(sort, size, status, item[sort.active])
              .pipe(
                tap(() => this.handleLoadedRequest()),
                map(items => ItemActions.getItemsSuccess({ items: formatResponseList(query, items, total, current) })),
                catchError(error => of(ItemActions.notifyError({ error, query })))
              )
          default: return EMPTY
        }
      }))
  )

  getItemsBySearchQuery = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.getItemsBySearchQuery),
      withLatestFrom(this.store.select(getTotal)),
      switchMap(([{ request }, total]) =>
        this.orderService.getAllByQuery(request.key, request.value).pipe(
          map((items) => ItemActions.getItemsSuccess({ items: formatResponseList('custom', items, total, 0) })),
          catchError(error => of(ItemActions.notifyError({ error, query: 'custom' })))
        )))
  )

  notifyError = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.notifyError),
      tap(({ error }) => console.error(error))),
    // TODO
    // switchMap(() => of(this.notificationService.notifyError()))
    { dispatch: false }
  )

  private handleLoadedRequest() {
    this.signalService.setLoadingStatus(LoadingStatus.Loaded)
    this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Loaded }))
  }

}