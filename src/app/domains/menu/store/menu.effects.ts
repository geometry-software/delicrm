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
import { prepareOrder } from '../utils/prepare-order'

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
  private readonly deliveryUrl = MenuConstants.deliveryUrl

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
      tap(() => this.router.navigate([this.checkOutUrl])),
      map(({ main, alacarte }) => prepareOrder(main, alacarte)),
      map(order => ItemActions.setOrderSuccess({ order }))
    )
  )

  createDeliveryOrder = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.createDeliveryOrder),
      switchMap(({ delivery }) => this.deliveryService.create(delivery).pipe(
        map(id => ItemActions.checkoutOrderSuccess({ id, checkout: 'delivery' })),
        catchError(() => this.handleError())
      )))
  )

  createTableOrder = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.createTableOrder),
      switchMap(({ order }) => this.orderService.create(order).pipe(
        tap((id) => this.router.navigate([this.ordersUrl, id])),
        map(id => ItemActions.checkoutOrderSuccess({ id, checkout: 'order' })),
        catchError(() => this.handleError())
      )))
  )

  createOrderSuccess = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.checkoutOrderSuccess),
      tap(({ checkout, id }) => checkout === 'order'
        ? this.router.navigate([this.ordersUrl, id])
        : this.router.navigate([this.deliveryUrl])),
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