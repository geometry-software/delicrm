import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects'
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
import { Action, Store } from '@ngrx/store'
import { getCurrent, getSize, getTotal } from './order.selectors'
import { OrderService } from '../services/order.service'
import { compareItemsRequestStateSize, formatRequest } from '../../../shared/utils/format-request'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { OrderConstants } from '../models/order.constants'
import { SignalService } from '../../../shared/services/signal.service'
import { formatResponseList } from '../../../shared/repository/repository.utils'
import { RestaurantService } from '../../admin/services/restaurant.service'
import { RepositoryRequestQuery } from '../../../shared/repository/repository.models'

@Injectable()
export class OrderEffects implements OnInitEffects {

  constructor(
    private actions: Actions,
    private store: Store,
    private orderService: OrderService,
    private restaurantService: RestaurantService,
    private signalService: SignalService
  ) { }

  readonly moduleUrl = OrderConstants.moduleUrl

  ngrxOnInitEffects(): Action {
    return ItemActions.getRestaurantInfo()
  }

  getRestaurantInfo = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.getRestaurantInfo),
      tap(() => this.handleLoadingRequest()),
      switchMap(() => this.restaurantService.getRestaurantInfo().pipe(
        map(restaurant => {
          this.handleLoadedRequest()
          return ItemActions.setRestaurantInfo({ restaurant: restaurant.restaurant })
        }),
        catchError(error => this.handleError(error, 'create')))))
  )

  updateOrderStatus = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.updateOrderStatus),
      tap(() => this.handleLoadingRequest()),
      switchMap(({ id, status, progress }) =>
        this.orderService.updateStatus(id, status, progress).pipe(
          map(() => {
            this.handleLoadedRequest()
            return ItemActions.updateOrderStatusSuccess({ statusBar: { progress, status } })
          }),
          catchError(error => this.handleError(error, 'edit')))))
  )

  getItem = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.getItem),
      tap(() => this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Loading }))),
      switchMap(({ id }) => this.orderService.getById(id).pipe(
        map(item => {
          this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Loaded }))
          return ItemActions.getItemSuccess({ item })
        }),
        catchError(error => this.handleError(error, 'detail')))))
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
                  ItemActions.getItemsSuccess({ items: formatResponseList(query, items, total, current, compareItemsRequestStateSize(size, stateSize)), size }),
                  ItemActions.setItemsAmountByStatus({ status, amount })
                ]
              ),
              catchError(error => this.handleError(error, 'all'))
            )
          case 'next':
            return this.orderService
              .getNextPage(sort, size, status, item[sort.active])
              .pipe(
                tap(() => this.handleLoadedRequest()),
                map(items => ItemActions.getItemsSuccess({ items: formatResponseList(query, items, total, current) })),
                catchError(error => this.handleError(error, 'all'))
              )
          case 'previous':
            return this.orderService
              .getPreviousPage(sort, size, status, item[sort.active])
              .pipe(
                tap(() => this.handleLoadedRequest()),
                map(items => ItemActions.getItemsSuccess({ items: formatResponseList(query, items, total, current) })),
                catchError(error => this.handleError(error, 'all'))
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

  private handleError(error, type: RepositoryRequestQuery) {
    this.signalService.setLoadingStatus(LoadingStatus.Failed)
    this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Failed }))
    return of(ItemActions.notifyError({ error, errorType: type }))
  }

  private handleLoadingRequest() {
    this.signalService.setLoadingStatus(LoadingStatus.Loading)
    this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Loading }))
  }

  private handleLoadedRequest() {
    this.signalService.setLoadingStatus(LoadingStatus.Loaded)
    this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Loaded }))
  }

}