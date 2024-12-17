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
import { OrderActions as ItemActions } from './order.actions'
import { Store } from '@ngrx/store'
import { getCurrent, getSize, getTotal } from './order.selectors'
import { OrderService } from '../services/order.service'
import { compareItemsRequestStateSize, formatRequest } from '../../../shared/utils/format-request'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { OrderConstants } from '../models/order.constants'
import { SignalService } from '../../../shared/services/signal.service'
import { formatResponseList } from '../../../shared/repository/repository.utils'

@Injectable()
export class OrderEffects {

  constructor(
    private actions: Actions,
    private store: Store,
    private orderService: OrderService,
    private signalService: SignalService
  ) { }

  readonly moduleUrl = OrderConstants.moduleUrl

  updateOrderStatus = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.updateOrderStatus),
      tap(() => this.handleLoadingRequest()),
      switchMap(({ id, status, statusHistory, progress }) =>
        this.orderService.updateStatus(id, status, statusHistory, progress).pipe(
          map(() => {
            this.handleLoadedRequest()
            return ItemActions.updateOrderStatusSuccess({ statusBar: { progress, status } })
          }),
          catchError(error => of(
            ItemActions.notifyError({ error, query: 'edit' }),
            ItemActions.setItemsLoadingStatus({ status: LoadingStatus.LoadingFailed })
          )))))
  )

  getItem = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.getItem),
      tap(() => this.handleLoadingRequest()),
      switchMap(({ id }) =>
        this.orderService.getById(id).pipe(
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
              .getNextPage(sort, size, status, item[sort.active])
              .pipe(
                tap(() => this.handleLoadedRequest()),
                map(items => ItemActions.getItemsSuccess({ items: formatResponseList(query, items, total, current) })),
                catchError(error => of(ItemActions.notifyError({ error, query })))
              )
          case 'previous':
            return this.orderService
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