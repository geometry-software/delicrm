import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { OrderService } from '../../services/order.service'
import { Router } from '@angular/router'
import { combineLatest, EMPTY, filter, map, Observable, shareReplay, tap } from 'rxjs'
import { OrderActions as ItemActions } from '../../store/orders.actions'
import { OrderConstants } from '../../models/order.constants'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { Store } from '@ngrx/store'
import { getItems, getItemsData, getItemsLoadingStatus, getListLabels, getPaginationResponse, getRequestStatus, isStatusUpdated } from '../../store/orders.selectors'
import { MatTabChangeEvent } from '@angular/material/tabs'
import { OrderStatus } from '../../models/order.model'
import { OrderActions } from '../../store/orders.actions'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormControl } from '@angular/forms'
import { combineListControls } from '../../utils/combine-list-controls'

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListComponent implements OnInit {

  constructor(
    private store: Store,
    private destroyRef: DestroyRef,
    private cdr: ChangeDetectorRef) { }

  readonly LoadingStatus = LoadingStatus
  readonly defaultFirstPageRequest = OrderConstants.defaultFirstPageRequest
  readonly defaultOrderControl = OrderConstants.defaultOrderControlValue
  readonly tableColumns = OrderConstants.tableColumns
  readonly defaultOrderControlValue = OrderConstants.defaultOrderControlValue
  readonly defaultPaginationControlValue = OrderConstants.defaultPaginationControlValue
  readonly defaultSizeControlValue = OrderConstants.defaultSizeControlValue
  readonly defaultRequestStatus = OrderConstants.defaultRequestStatus
  // readonly userStatusFormComponentConfig = SharedConstants.formComponentConfig

  readonly orderList = this.store.select(getItems)
  readonly listLabels = this.store.select(getListLabels)
  readonly loadingStatus = this.store.select(getItemsLoadingStatus)

  readonly paginationControl = new FormControl(this.defaultPaginationControlValue)
  readonly sizeControl = new FormControl(this.defaultSizeControlValue)
  readonly orderControl = new FormControl(this.defaultOrderControlValue)
  readonly downloadState = EMPTY
  readonly paginationPayload = this.store.select(getPaginationResponse)

  displayedColumns = ['client', 'waiter', 'price']
  selectedTabIndex: number
  updatedStatus: OrderStatus

  ngOnInit() {
    this.initCookingOrders()
  }

  changeUserList(event: MatTabChangeEvent) {
    let labelAmount = event.tab.textLabel.split('(').pop().slice(0, -1)
    const status = event.tab.textLabel.slice(0, -labelAmount.length - 3).toLowerCase() as unknown as OrderStatus
    this.store.dispatch(OrderActions.getItems({
      request: {
        pagination: this.defaultFirstPageRequest.pagination,
        size: this.defaultFirstPageRequest.size,
        status,
        order: this.defaultFirstPageRequest.order
      }
    }))
  }

  onSwitchTabAfterUpdate() {
    this.store
      .select(isStatusUpdated)
      .pipe(
        filter(Boolean),
        tap(() => {
          switch (this.updatedStatus) {
            case 'cooking':
              this.selectedTabIndex = 0
              break
            case 'delivery':
              this.selectedTabIndex = 1
              break
            case 'paid':
              this.selectedTabIndex = 2
              break
            case 'canceled':
              this.selectedTabIndex = 3
              break
          }
        }),
        takeUntilDestroyed(this.destroyRef))
      .subscribe()
  }

  preloadTabData(ev) {
    switch (ev) {
      case 0:
        this.initCookingOrders()
        break
      case 1:
        this.initDeliveryOrders()
        break
      case 2:
        this.initPaidOrders()
        break
    }
  }

  initCookingOrders() {
    combineListControls(this.paginationControl, this.sizeControl, this.orderControl, this.store)
      .pipe(
        tap(([pagination, size, order]) =>
          this.store.dispatch(
            ItemActions.getItems({
              request: {
                pagination: pagination,
                size: size,
                order: order,
                status: this.defaultRequestStatus,
              },
            })))
      ).subscribe()
  }

  initDeliveryOrders() {
    // this.orderService.getDeliveryOrders().subscribe(value => {
    //   this.datasource = value
    //   this.cdr.markForCheck()
    // })
  }

  initPaidOrders() {
    // this.orderService.getPaidOrders().subscribe(value => {
    //   this.datasource = value
    //   this.cdr.markForCheck()
    // })
    // this.orderService.getPaidOrdersFirstPage(this.PAGE_ITEMS_SIZE).subscribe((res) => {
    //   this.datasourcePaid = new MatTableDataSource(res)
    //   this.lastItem = [...res].pop()
    // })
  }

  next() {
    // this.orderService.getPaidOrdersNextPage(this.PAGE_ITEMS_SIZE, this.lastItem).subscribe((res) => {
    //   this.datasourcePaid = new MatTableDataSource(res)
    //   this.firstItem = [...res][0]
    //   this.lastItem = [...res].slice(-1).pop()
    // })
  }

  update() {
    // this.firstItem = undefined
    // this.orderService.getPaidOrdersFirstPage(this.PAGE_ITEMS_SIZE).subscribe((res) => {
    //   setTimeout(() => {
    //     this.datasourcePaid = new MatTableDataSource(res)
    //     this.lastItem = [...res].pop()
    //   }, 1000)
    // })
  }

  previous() {
    // this.orderService.getPaidOrdersPreviousPage(this.PAGE_ITEMS_SIZE, this.firstItem).subscribe((res) => {
    //   this.datasourcePaid = new MatTableDataSource(res)
    //   this.firstItem = [...res][0]
    //   this.lastItem = [...res].pop()
    // })
  }

}