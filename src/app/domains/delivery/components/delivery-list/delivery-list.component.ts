import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import { MatTableDataSource } from '@angular/material/table'
import { DeliveryService } from '../../services/delivery.service'
import { Observable, combineLatest, of, shareReplay, switchMap, tap } from 'rxjs'

import { FormControl } from '@angular/forms'

import { Sort } from '@angular/material/sort'
import { Store } from '@ngrx/store'
import { Order, OrderStatusValue } from '../../../menu/utils/waiter.model'
import { AuthService } from '../../../../auth/services/auth.service'
import { AppUser } from '../../../users/utils/user.model'
import { DeliveryDetailComponent } from '../delivery-detail/delivery-detail.component'

@Component({
  selector: 'app-delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryListComponent {
  datasource
  displayedColumns = ['user', 'plates']

  orders = new Array()
  delivery: Order = {}
  deliveryId
  user: AppUser

  // PAGE_ITEMS_SIZE = 20
  // firstItem
  // lastItem

  readonly defaultPaginationControlValue: any = {
    query: 'first',
    item: null,
  }
  readonly defaultSizeControlValue = {
    size: 10,
  }

  readonly defaultOrderControlValue: any = {
    active: 'timestamp',
    direction: 'desc',
  }

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private router: Router,
    private deliveryService: DeliveryService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) { }

  // ngOnInit() {
  //   combineListControls(this.paginationControl, this.sizeControl, this.store)
  //     .pipe(
  //       tap(([pagination, size]) =>
  //         this.store.dispatch(
  //           ItemActions.getItems({
  //             request: {
  //               pagination: pagination,
  //               size: size,
  //               status: 'requested',
  //               order: {
  //                 key: 'timestamp',
  //                 value: 'desc',
  //               },
  //             },
  //           })
  //         )
  //       )
  //     )
  //     .subscribe()
  //   this.initUser()
  // }

  initUser() {
    // this.authService.getAppAuth().subscribe((value) => {
    //   this.user = value
    // })
  }

  preloadTabData(ev) {
    switch (ev) {
      case 0:
        this.initDelivery('requested')
        break
      case 1:
        this.initDelivery('delivery')
        break
      case 2:
        this.initDelivery('canceled')
        break
      default:
        break
    }
  }

  initDelivery(status: OrderStatusValue) {
    this.datasource = combineLatest([]).pipe(
      switchMap(() =>
        this.deliveryService.getNewDeliveries(status).pipe(
          // tap((value) => console.log(value)),
          shareReplay(1)
        )
      )
    )
  }

  // loadAcceptedDelivery() {
  //   this.deliveryService.getNewDeliveries().subscribe((res) => {
  //     this.datasource = new MatTableDataSource(res)
  //     this.cdr.markForCheck()
  //   })
  // }

  // loadRejectedDelivery() {
  //   this.deliveryService.getNewDeliveries().subscribe((res) => {
  //     this.datasource = new MatTableDataSource(res)
  //     this.cdr.markForCheck()
  //   })
  // }

  // loadAcceptedDelivery() {
  //   this.isLoadingAcceptedDelivery = true
  //   this.deliveryService.getAcceptedOrdersFirstPage(this.PAGE_ITEMS_SIZE).subscribe((res) => {
  //     this.datasourceAcceptedOrders = new MatTableDataSource(res)
  //     this.lastItem = [...res].pop()
  //     this.isLoadingAcceptedDelivery = false
  //   })
  // }

  // loadRejectedDelivery() {
  //   this.isLoadingRejectedDelivery = true
  //   this.deliveryService.getRejectedOrders().subscribe((res) => {
  //     this.datasourceRejectedOrders = new MatTableDataSource(res)
  //     this.isLoadingRejectedDelivery = false
  //   })
  // }

  showDetail(data): void {
    this.delivery = data
    this.deliveryId = data.id
    let dialogRef = this.dialog.open(DeliveryDetailComponent, {
      width: '300px',
      maxHeight: 'auto',
      data,
    })
    dialogRef.afterClosed().subscribe((value) => {
      if (value === 'confirm') {
        this.confirm()
      } else if (value === 'delete') {
        this.reject()
      }
    })
  }

  confirm(): void {
    this.delivery.status = 'cooking'
    this.delivery.progress = '60%'
    this.delivery.category.delivery.id = this.delivery.id
    this.delivery.statusHistory.push({
      status: 'cooking',
      user: this.user,
      timestamp: new Date(),
    })
    delete this.delivery.id
    this.deliveryService
      .createOrder(this.delivery)
      .then((value) =>
        this.deliveryService.confirmDelivery(this.deliveryId, value.id).then(() => this.router.navigate(['/orders', value.id]))
      )
  }

  reject(): void {
    this.deliveryService.rejectDelivery(this.deliveryId, 'cause of').then(() => this.preloadTabData(2))
  }

  // showOrder(id) {
  //   this.router.navigate(['/orderdetail', id, 'employee'])
  // }

  // nextPage() {
  //   this.deliveryService.getAcceptedOrdersNextPage(this.PAGE_ITEMS_SIZE, this.lastItem).subscribe((res) => {
  //     this.datasourceAcceptedOrders = new MatTableDataSource(res)
  //     this.firstItem = [...res][0]
  //     this.lastItem = [...res].pop()
  //   })
  // }

  // updatePage() {
  //   this.isLoadingAcceptedDelivery = true
  //   this.firstItem = undefined
  //   this.deliveryService.getAcceptedOrdersFirstPage(this.PAGE_ITEMS_SIZE).subscribe((res) => {
  //     setTimeout(() => {
  //       this.datasourceAcceptedOrders = new MatTableDataSource(res)
  //       this.lastItem = [...res].pop()
  //       this.isLoadingAcceptedDelivery = false
  //     }, 1000)
  //   })
  // }

  // previousPage() {
  //   this.deliveryService.getAcceptedOrdersPreviousPage(this.PAGE_ITEMS_SIZE, this.firstItem).subscribe((res) => {
  //     this.datasourceAcceptedOrders = new MatTableDataSource(res)
  //     this.firstItem = [...res][0]
  //     this.lastItem = [...res].pop()
  //   })
  // }
}
