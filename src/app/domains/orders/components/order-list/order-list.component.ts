import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { OrderService } from '../../services/order.service'
import { Router } from '@angular/router'
import { Observable, tap } from 'rxjs'

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListComponent implements OnInit {
  PAGE_ITEMS_SIZE = 20

  datasource: any
  datasourceDelivered
  datasourcePaid
  displayedColumns = ['client', 'waiter', 'price']

  itemsListFirstQuery
  lastItem
  firstItem

  constructor(private orderService: OrderService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.initCookingOrders()
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
    this.orderService.getCookingOrders().subscribe(value => {
      this.datasource = value
      this.cdr.markForCheck()
    })
  }

  initDeliveryOrders() {
    this.orderService.getDeliveryOrders().subscribe(value => {
      this.datasource = value
      this.cdr.markForCheck()
    })
  }

  initPaidOrders() {
    this.orderService.getPaidOrders().subscribe(value => {
      this.datasource = value
      this.cdr.markForCheck()
    })
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
