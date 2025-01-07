import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects'
import { map, switchMap, tap, catchError, of, withLatestFrom, combineLatest } from 'rxjs'
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
import { AuthService } from '../../../auth/services/auth.service'
import { Auth } from '../../../auth/models/auth.model'
import { UserService } from '../../users/services/user.service'
import { Delivery } from '../../delivery/models/delivery.model'
import { getExtras, getRestaurantInfo } from './menu.selectors'

@Injectable()
export class MenuEffects implements OnInitEffects {

  constructor(
    private router: Router,
    private actions: Actions,
    private store: Store,
    private deliveryService: DeliveryService,
    private authService: AuthService,
    private userService: UserService,
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
      tap(() => this.setLoading()),
      switchMap(() => combineLatest([
        this.restaurantService.getDailyMenu(),
        this.restaurantService.getRestaurantInfo()
      ]).pipe(
        map(([menu, restaurant]) => {
          this.setLoaded()
          return ItemActions.initDailyMenuSuccess({ menu, restaurant })
        }),
        catchError(() => this.handleError()))))
  )

  setOrder = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.setOrder),
      withLatestFrom(
        this.store.select(getExtras),
        this.store.select(getRestaurantInfo)
      ),
      tap(() => this.router.navigate([this.checkOutUrl])),
      map(([{ main, alacarte }, extra, restaurant]) => prepareOrder(main, alacarte, extra, restaurant)),
      map(order => ItemActions.setOrderSuccess({ order })))
  )

  createDeliveryOrder = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.createDeliveryOrder),
      tap(() => this.setLoading()),
      switchMap(({ delivery }) => this.updateAuth(delivery).pipe(
        switchMap(() => this.deliveryService.create(delivery).pipe(
          map(id => ItemActions.checkoutOrderSuccess({ id, checkout: 'delivery' })),
          catchError(() => this.handleError())
        )))))
  )

  createTableOrder = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.createTableOrder),
      tap(() => this.setLoading()),
      switchMap(({ order }) => this.orderService.create(order).pipe(
        map(id => ItemActions.checkoutOrderSuccess({ id, checkout: 'order' })),
        catchError(() => this.handleError())
      )))
  )

  createOrderSuccess = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.checkoutOrderSuccess),
      tap(({ checkout, id }) => checkout === 'order'
        ? this.router.navigate([this.ordersUrl, id])
        : this.router.navigate([this.deliveryUrl, id])),
      tap(() => this.setLoaded()))
    , { dispatch: false }
  )

  ngrxOnInitEffects(): Action {
    return ItemActions.initDailyMenu()
  }

  private handleError() {
    this.signalService.setLoadingStatus(LoadingStatus.LoadingFailed)
    this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.LoadingFailed }))
    return []
  }

  private updateAuth(delivery: Delivery) {
    return this.userService.appAuth.pipe(
      map(auth => {
        const currentAuthName = auth?.name
        const currentAuthAddress = auth?.deliveryInfo.address
        const currentAuthPhone = auth?.deliveryInfo.phone
        const newAuthName = delivery.order.category.delivery.name
        const newAuthAddress = delivery.order.category.delivery.address
        const newAuthPhone = delivery.order.category.delivery.phone
        if (currentAuthName !== newAuthName || currentAuthAddress !== newAuthAddress || currentAuthPhone !== newAuthPhone) {
          const updatedAuth: Partial<Auth> = {
            name: newAuthName,
            deliveryInfo: {
              address: newAuthAddress,
              phone: newAuthPhone
            }
          }
          this.userService.appAuthSubject.next({ ...auth, ...updatedAuth })
          return this.authService.updateAuth(auth.authId, updatedAuth)
        } else {
          return of(null)
        }
      })
    )
  }

  private setLoading() {
    this.signalService.setLoadingStatus(LoadingStatus.Loading)
    this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Loading }))
  }

  private setLoaded() {
    this.signalService.setLoadingStatus(LoadingStatus.Loaded)
    this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Loaded }))
  }

}