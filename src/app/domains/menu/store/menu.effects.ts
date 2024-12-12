import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects'
import { map, switchMap, tap, catchError } from 'rxjs'
import { MenuActions as ItemActions } from './menu.actions'
import { Router } from '@angular/router'
import { Action, Store } from '@ngrx/store'
import { LoadingStatus } from '../../../shared/models/loading-status'
import { SignalService } from '../../../shared/services/signal.service'
import { RestaurantService } from '../../admin/services/restaurant.service'
import { MenuConstants } from '../utils/menu.constants'
import { OrderService } from '../../orders/services/order.service'
import { DeliveryService } from '../../delivery/services/delivery.service'

@Injectable()
export class MenuEffects implements OnInitEffects {

  constructor(
    private router: Router,
    private actions: Actions,
    private store: Store,
    private deliveryService: DeliveryService,
    private orderService: OrderService,
    private restaurantService: RestaurantService,
    private signalService: SignalService
  ) { }

  private readonly checkOutUrl = MenuConstants.checkOutUrl
  private readonly ordersUrl = MenuConstants.ordersUrl

  updateUserStatus = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.initDailyMenu),
      tap(() => {
        this.signalService.setLoadingStatus(LoadingStatus.Loading)
        this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Loading }))
      }),
      switchMap(() => this.restaurantService.getDailyMenu().pipe(
        map((menu) => {
          this.signalService.setLoadingStatus(LoadingStatus.Loaded)
          this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Loaded }))
          return ItemActions.initDailyMenuSuccess({ menu })
        }),
        catchError(() => this.handleError()))))
  )

  setOrder = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.setOrder),
      tap(() => this.router.navigate([this.checkOutUrl])))
    , { dispatch: false }
  )

  createDeliveryOrder = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.createDeliveryOrder),
      switchMap(({ order }) => this.deliveryService.create(order).pipe(
        map(id => ItemActions.createOrderSuccess({ id })),
        catchError(() => this.handleError())
      )))
  )

  createTableOrder = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.createTableOrder),
      switchMap(({ order }) => this.orderService.create(order).pipe(
        tap(() => this.router.navigate([this.ordersUrl])),
        map(id => ItemActions.createOrderSuccess({ id })),
        catchError(() => this.handleError())
      )))
  )

  createOrderSuccess = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.createOrderSuccess),
      tap(() => this.signalService.setLoadingStatus(LoadingStatus.Loaded)))
    , { dispatch: false }
  )

  ngrxOnInitEffects(): Action {
    return ItemActions.initDailyMenu()
  }

  private handleError() {
    this.signalService.setLoadingStatus(LoadingStatus.LoadingFailed)
    return []
  }

}