import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects'
import { catchError, delay, map, of, switchMap, tap } from 'rxjs'
import { AdminActions as ItemActions } from './admin.actions'
import { Router } from '@angular/router'
import { AdminConstants } from '../models/admin.constants'
import { Action, Store } from '@ngrx/store'
import { RestaurantService } from '../services/restaurant.service'
import { SignalService } from '../../../shared/services/signal.service'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { RepositoryRequestQuery } from '../../../shared/repository/repository.models'
import { getCurrentUnixTime } from '../../../shared/utils/format-unix-time'
import { CheckoutOrder } from '../../menu/models/checkout'
import { ShiftSummary } from '../models/shift'

@Injectable()
export class AdminEffects implements OnInitEffects {

  constructor(
    private router: Router,
    private actions: Actions,
    private store: Store,
    private restaurantService: RestaurantService,
    private signalService: SignalService
  ) { }

  readonly moduleUrl = AdminConstants.moduleUrl
  readonly deleteTitle = AdminConstants.deleteTitle
  readonly defaultCreateStatus = AdminConstants.defaultCreateStatus

  ngrxOnInitEffects(): Action {
    return ItemActions.getRestaurantInfo()
  }

  createDailyMenu = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.createDailyMenu),
      tap(() => this.setLoading()),
      switchMap(({ menu }) => this.restaurantService.updateDailyMenu(menu).pipe(
        tap(() => {
          this.setLoaded()
          this.router.navigate(['admin/board'])
        }),
        catchError(error => this.handleError(error, 'create')))))
    , { dispatch: false }
  )

  getRestaurantInfo = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.getRestaurantInfo),
      tap(() => this.setLoading()),
      switchMap(() => this.restaurantService.getRestaurantInfo().pipe(
        map(restaurant => {
          this.setLoaded()
          return ItemActions.setRestaurantInfo({ restaurant })
        }),
        catchError(error => this.handleError(error, 'create')))))
    , { dispatch: false }
  )

  closeShift = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.closeShift),
      tap(() => this.setLoading()),
      switchMap(() => this.restaurantService.getDailyMenu().pipe(
        map(({ orders, createdAt }) => this.calculateShiftOrders(orders, createdAt)),
        switchMap(shift => this.restaurantService.closeShift(shift).pipe(
          map(() => ItemActions.closeShiftSuccess())
        )),
        catchError(error => this.handleError(error, 'create')))))
  )

  closeShiftSuccess = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.closeShiftSuccess),
      tap(() => this.setLoaded()))
    , { dispatch: false }
  )

  updateRestaurant = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.updateRestaurant),
      tap(() => this.setLoading()),
      switchMap(({ restaurant }) => this.restaurantService.updateRestaurantInfo(restaurant).pipe(
        tap(() => this.setLoaded()),
        catchError(error => this.handleError(error, 'create')))))
    , { dispatch: false }
  )

  printMenu = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.printMenu),
      tap(() => this.setLoading()))
    , { dispatch: false }
  )

  printMenuSuccess = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.printMenuSuccess),
      delay(1000),
      tap(() => this.setLoaded()))
    , { dispatch: false }
  )

  private handleError(error, type: RepositoryRequestQuery) {
    this.signalService.setLoadingStatus(LoadingStatus.LoadingFailed)
    this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.LoadingFailed }))
    return of(ItemActions.notifyError({ error, errorType: type }))
  }

  private setLoading() {
    this.signalService.setLoadingStatus(LoadingStatus.Loading)
    this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Loading }))
  }

  private setLoaded() {
    this.signalService.setLoadingStatus(LoadingStatus.Loaded)
    this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Loaded }))
  }

  private calculateShiftOrders(orders: CheckoutOrder[], createdAt: number): ShiftSummary {
    const totalPrice = orders.map(el => el.total).reduce((sum, total) => sum + total, 0)
    const totalOrders = orders.length
    const averageOrder = totalPrice / totalOrders
    const ids = orders.map(el => el.id)
    return { totalPrice, totalOrders, averageOrder, createdAt, closedAt: getCurrentUnixTime(), orders: ids, status: 'active' }
  }

}