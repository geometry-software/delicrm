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
import { SessionService } from '../../../auth/services/session.service'
import { calulatedAlacarteMenuWithEightySix, calulatedDailyMenuWithEightySix } from '../../admin/utils/eighty-six'
import { ClientService } from '../../clients/services/client.service'

@Injectable()
export class MenuEffects {

  constructor(
    private router: Router,
    private actions: Actions,
    private store: Store,
    private deliveryService: DeliveryService,
    private authService: AuthService,
    private userService: UserService,
    private clientService: ClientService,
    private orderService: OrderService,
    private restaurantService: RestaurantService,
    private signalService: SignalService,
    private notificationService: NotificationService,
    private sessionService: SessionService,
  ) { }

  private readonly checkOutUrl = MenuConstants.checkOutUrl
  private readonly ordersUrl = MenuConstants.ordersUrl
  private readonly deliveryUrl = MenuConstants.deliveryUrl

  initDailyMenu = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.initDailyMenu),
      tap(() => this.setLoading()),
      switchMap(() => combineLatest([
        this.restaurantService.getDailyMenu(),
        this.restaurantService.getRestaurantInfo(),
        this.restaurantService.getAlacarteMenu(),
        this.clientService.getAllByActiveStatus(),
      ]).pipe(
        map(([menu, info, alacarte, clients]) => {
          this.setLoaded()
          return ItemActions.initDailyMenuSuccess({
            menu,
            restaurant: info.restaurant,
            open: info.open,
            alacarte,
            clients
          })
        }),
        catchError(error => this.handleError(error)))))
  )

  setOrder = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.setOrder),
      withLatestFrom(
        this.store.select(getExtras),
        this.store.select(getRestaurantInfo)
      ),
      tap(() => this.router.navigate([this.checkOutUrl])),
      map(([{ main, alacarte }, extras, restaurant]) => prepareOrder(main, alacarte, extras, restaurant)),
      map(order => ItemActions.setOrderSuccess({ order })))
  )

  setDailyMenuEightySix = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.setDailyMenuEightySix),
      tap(() => this.setLoading()),
      switchMap(({ id }) => this.restaurantService.getDailyMenu().pipe(
        map(menu => calulatedDailyMenuWithEightySix(menu, id)),
        switchMap(updatedMenu => this.restaurantService.updateDailyMenu(updatedMenu).pipe(
          map(() => {
            this.setLoaded()
            return ItemActions.setDailyMenuEightySixSuccess({ menu: updatedMenu })
          })
        )))))
  )

  setAlacarteEightySix = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.setAlacarteEightySix),
      tap(() => this.setLoading()),
      switchMap(({ id }) => this.restaurantService.getAlacarteMenu().pipe(
        map(alacarte => calulatedAlacarteMenuWithEightySix(alacarte, id)),
        switchMap(updatedAlacarte => this.restaurantService.updateAlacarteMenu(updatedAlacarte).pipe(
          map(() => {
            this.setLoaded()
            return ItemActions.setAlacarteEightySixSuccess({ alacarte: updatedAlacarte })
          }))))))
  )

  checkoutOrder = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.checkoutOrder),
      tap(() => this.setLoading()),
      map(({ order }) => order.category.type !== 'delivery'
        ? ItemActions.createUserOrder({ order })
        : order.category.delivery.createdBy
          ? ItemActions.createUserDeliveryOrder({ order })
          : ItemActions.createClientDeliveryOrder({ delivery: order.category.delivery })))

  )

  createUserDeliveryOrder = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.createUserDeliveryOrder),
      switchMap(({ order }) => this.orderService.create(order).pipe(
        switchMap(id => this.deliveryService.create(order.category.delivery).pipe(
          map(() => ItemActions.checkoutOrderSuccess({ id, checkout: 'order' })),
          catchError(error => this.handleError(error)))),
        catchError(error => this.handleError(error)),
      )))
  )

  createClientDeliveryOrder = createEffect(() =>
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
      switchMap(({ order }) => this.restaurantService.getDailyOrders().pipe(
        switchMap(orders => this.orderService.create(order).pipe(
          switchMap(id => this.restaurantService.updateDailyOrders([...orders, { id, total: order.price.total }]).pipe(
            map(() => ItemActions.checkoutOrderSuccess({ id, checkout: 'order' })))),
          catchError(error => this.handleError(error)))),
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

  createClient = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.createClient),
      tap(() => this.signalService.setClientLoadingStatus(LoadingStatus.Loading)),
      switchMap(({ name, address, phone }) => this.sessionService.getUser().pipe(
        switchMap(user => this.clientService.create(name, address, phone, user.name).pipe(
          map(() => ItemActions.getActiveClients()),
          catchError(error => {
            this.notificationService.error(error)
            this.signalService.setClientLoadingStatus(LoadingStatus.Failed)
            return EMPTY
          }))))))
  )

  getActiveClients = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.getActiveClients),
      switchMap(() => this.clientService.getAllByActiveStatus().pipe(
        map(clients => {
          this.notificationService.success('CLIENTS.FORM.CREATE_CLIENT_SUCCESS')
          this.signalService.setClientLoadingStatus(LoadingStatus.Loaded)
          return ItemActions.getActiveClientsSuccess({ clients })
        }),
        catchError(error => {
          this.notificationService.error(error)
          this.signalService.setClientLoadingStatus(LoadingStatus.Failed)
          return EMPTY
        }))))
  )

  private handleError(error: Error) {
    this.notificationService.error(error)
    this.signalService.setLoadingStatus(LoadingStatus.Failed)
    this.store.dispatch(ItemActions.setItemsLoadingStatus({ status: LoadingStatus.Failed }))
    return EMPTY
  }

  private updateAuth(info: DeliveryInfo) {
    return this.sessionService.getAuth().pipe(
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
          this.sessionService.setAuth({ ...auth, ...updatedAuth })
          return this.authService.updateAuth(auth.authId, updatedAuth)
        } else {
          return EMPTY
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