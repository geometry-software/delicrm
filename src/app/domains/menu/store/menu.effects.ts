import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { map, switchMap, tap, catchError, of, withLatestFrom, combineLatest, first, EMPTY } from 'rxjs'
import { MenuActions as ItemActions } from './menu.actions'
import { Router } from '@angular/router'
import { Store } from '@ngrx/store'
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
import { DeliveryInfo } from '../../delivery/models/delivery.model'
import { getExtras, getRestaurantInfo } from './menu.selectors'
import { CheckoutOrder } from '../models/checkout'
import { NotificationService } from '../../../shared/services/notification.service'
import { cloneDeep } from 'lodash'

@Injectable()
export class MenuEffects {

  constructor(
    private router: Router,
    private actions: Actions,
    private store: Store,
    private deliveryService: DeliveryService,
    private authService: AuthService,
    private userService: UserService,
    private orderService: OrderService,
    private restaurantService: RestaurantService,
    private signalService: SignalService,
    private notificationService: NotificationService
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
        catchError(error => this.handleError(error)))))
  )

  setOrder = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.setOrder),
      withLatestFrom(
        this.store.select(getExtras),
        this.store.select(getRestaurantInfo),
        this.userService.getUser().pipe(map(user => user ? true : false))
      ),
      tap(() => this.router.navigate([this.checkOutUrl])),
      map(([{ main, alacarte }, extra, restaurant, isCreatedByUser]) => prepareOrder(main, alacarte, extra, restaurant, isCreatedByUser)),
      map(order => ItemActions.setOrderSuccess({ order })))
  )

  checkoutOrder = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.checkoutOrder),
      tap(() => this.setLoading()),
      map(({ order }) => !order.isCreatedByUser
        ? ItemActions.createClientDeliveryOrder({ delivery: order.category.delivery })
        : ItemActions.createUserOrder({ order })))
  )

  createDeliveryOrder = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.createClientDeliveryOrder),
      switchMap(({ delivery }) => this.updateAuth(delivery.deliveryInfo).pipe(
        switchMap(() => this.deliveryService.create(delivery).pipe(
          map(id => ItemActions.checkoutOrderSuccess({ id, checkout: 'delivery' })),
          catchError(error => this.handleError(error)))),
        catchError(error => this.handleError(error)),
      )))
  )

  createUserOrder = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.createUserOrder),
      switchMap(({ order }) => this.restaurantService.getCheckOutOrders().pipe(
        switchMap(orders => this.orderService.create(order).pipe(
          switchMap(id => this.restaurantService.updateDailyMenuOrders([...orders, { id, total: order.price.total }]).pipe(
            map(() => order.category.type === 'delivery'
              ? ItemActions.createUserDelivery({ delivery: cloneDeep({ ...order.category.delivery, orderId: id }) })
              : ItemActions.checkoutOrderSuccess({ id, checkout: 'order' })))),
          catchError(error => this.handleError(error)))),
        catchError(error => this.handleError(error)))))
  )

  createUserDelivery = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.createUserDelivery),
      switchMap(({ delivery }) => this.deliveryService.create(delivery).pipe(
        map(() => ItemActions.checkoutOrderSuccess({ id: delivery.orderId, checkout: 'order' })),
        catchError(error => this.handleError(error)))))
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

  private handleError(error: Error) {
    this.notificationService.error(error)
    this.signalService.setLoadingStatus(LoadingStatus.LoadingFailed)
    this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.LoadingFailed }))
    return EMPTY
  }

  private updateAuth(info: DeliveryInfo) {
    return this.userService.getAuth().pipe(
      first(),
      switchMap(auth => {
        const currentAuthName = auth.name
        const currentAuthAddress = auth.address
        const currentAuthPhone = auth.phone
        const newAuthName = info.name
        const newAuthAddress = info.address
        const newAuthPhone = info.phone
        if (currentAuthName !== newAuthName || currentAuthAddress !== newAuthAddress || currentAuthPhone !== newAuthPhone) {
          const updatedAuth: Partial<Auth> = {
            name: newAuthName,
            address: newAuthAddress,
            phone: newAuthPhone,
          }
          this.userService.setAuth({ ...auth, ...updatedAuth })
          return this.authService.updateAuth(auth.authId, updatedAuth)
        } else {
          return of(null)
        }
      })
    )
  }

  private updateCheckoutOrders(orders: CheckoutOrder[], total: number, id: string) {
    const updatedOrders = [...orders, { id, total }]
    return this.restaurantService.updateDailyMenuOrders(updatedOrders)
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