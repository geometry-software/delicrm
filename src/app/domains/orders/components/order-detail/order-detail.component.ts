import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import { fadeInOnEnterAnimation } from 'angular-animations'
import { ORDER_STATUS_COLOR, ORDER_STATUS_ICON, ORDER_STATUS_TRANSLATE } from '../../models/order.model'
import { PrintService } from '../../../../shared/services/print.service'
import { catchError, combineLatest, debounceTime, delay, distinctUntilChanged, filter, firstValueFrom, map, shareReplay, switchMap, tap } from 'rxjs'
import { Order, OrderStatus, OrderProgress, OrderStatusHistory, OrderStatusBar, orderStatusProgress } from '../../models/order.model'
import { UserService } from '../../../users/services/user.service'
import { getCurrentUnixTime, getFullTimeFromUnix } from '../../../../shared/utils/format-unix-time'
import { Store } from '@ngrx/store'
import { getCurrency, getItem, getItemById, getItemLoadingStatus, getItemsLoadingStatus, statusBar } from '../../store/order.selectors'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { User } from '../../../users/models/user.model'
import { OrderActions as ItemActions } from '../../store/order.actions'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { OrderStatusComponent } from '../order-status/order-status.component'
import { defaultErrorHandler } from '../../../../shared/utils/default-error-handler'
import { isNaN } from 'lodash'

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
  animations: [fadeInOnEnterAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailComponent implements OnInit {

  constructor(
    private printService: PrintService,
    private userService: UserService,
    private route: ActivatedRoute,
    private store: Store,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private destroyRef: DestroyRef
  ) { }

  readonly statusButtonTitle: string = 'Update'
  readonly printButtonTitle: string = 'Print'
  readonly statusColor = ORDER_STATUS_COLOR
  readonly statusIcon = ORDER_STATUS_ICON
  readonly getFullTimeFromUnix = getFullTimeFromUnix
  readonly orderTranslate = ORDER_STATUS_TRANSLATE

  readonly loadingStatus = this.store.select(getItemsLoadingStatus).pipe(shareReplay(1))
  readonly LoadingStatus = LoadingStatus

  order: Order
  currency: string
  user: User
  orderId: string
  orderNotFound: boolean
  orderStatusBar: OrderStatusBar
  status: OrderStatus

  get orderTitle() {
    // TODO use obj[key]
    const type = this.order.category.type
    switch (type) {
      case 'table':
        return 'Table'
      case 'delivery':
        return 'Delivery'
      case 'takeaway':
        return 'Takeaway'
    }
  }

  get comment() {
    return this.order.comment || '-'
  }

  get emptyOrder() {
    return isNaN(this.order)
  }

  ngOnInit() {
    this.initData()
    this.onOrderStatusUpdated()
  }

  get orderDetail() {
    switch (this.order.category.type) {
      case 'table':
        return 'number ' + this.order.category.table
      case 'delivery':
        return this.order.category.delivery.deliveryInfo.name
      case 'takeaway':
        return this.order.category.clientName
    }
  }

  print() {
    this.printService.connect().then(value => this.printService.print(value, this.order.price.total))
  }

  update() {
    this.dialog.open(OrderStatusComponent, {
      width: '300px',
      height: 'auto',
      autoFocus: false,
      data: this.order
    }).afterClosed().pipe(
      filter(Boolean),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(status =>
      this.store.dispatch(ItemActions.updateOrderStatus({
        id: this.orderId,
        status,
        progress: orderStatusProgress[status]
      }))
    )
  }

  // TODO make order history by status changes
  // const history: OrderStatusHistory = {
  //   status,
  //   createdAt: getCurrentUnixTime(),
  //   createdBy: this.user,
  // }
  // const statusHistory = [...this.order.statusHistory]
  // statusHistory.push(history)


  getTotal(total: number) {
    return total + ' ' + this.currency
  }

  private async initData() {
    combineLatest([
      this.userService.appUser.pipe(filter(Boolean)),
      this.store.select(getCurrency).pipe(filter(Boolean)),
      this.route.params.pipe(
        map(value => value['id']),
        switchMap(id => this.store.select(getItemById(id)).pipe(
          map(order => ({ order, id }))
        ))),
    ]).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(async ([user, currency, { order, id }]) => {
      this.user = user
      if (order) {
        this.order = order
      } else {
        this.order = await this.requestOrder(id)
      }
      this.orderId = id
      this.currency = currency
      this.orderStatusBar = {
        progress: this.order?.progress,
        status: this.order?.status
      }
      this.cdr.markForCheck()
    })
  }

  private async requestOrder(id: string) {
    this.store.dispatch(ItemActions.getItem({ id }))
    return await firstValueFrom(this.store.select(getItemLoadingStatus).pipe(
      filter(value => value === LoadingStatus.Loaded),
      distinctUntilChanged(),
      debounceTime(100),
      switchMap(() => this.store.select(getItem).pipe(
        tap(order => {
          if (!order) {
            this.orderNotFound = true
          }
        }))),
      catchError(error => defaultErrorHandler(error, 'Request Order'))
    ))
  }

  private onOrderStatusUpdated() {
    this.store.select(statusBar).pipe(
      filter(Boolean),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      this.orderStatusBar = value
      this.cdr.markForCheck()
    })
  }

}