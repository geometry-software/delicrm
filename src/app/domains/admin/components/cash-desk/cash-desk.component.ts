import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { OrderService } from '../../../orders/services/order.service'
import { MatDialog } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { SignalService } from 'src/app/shared/services/signal.service'
import { AppConfirmationDialogComponent } from 'src/app/shared/components/app-confirmation-dialog/app-confirmation-dialog.component'
import { AdminService } from '../../services/admin.service'

@Component({
  selector: 'app-cash-desk',
  templateUrl: './cash-desk.component.html',
  styleUrls: ['./cash-desk.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashDeskComponent implements OnInit {
  datasource
  displayedColumns = ['waiter', 'timestamp', 'price']

  datasourceHistorial
  datasourceHistorialColumns = ['manager', 'createdAt', 'plates']

  waiter
  waiterName
  orders

  sum
  amount

  isUpdatingOrders: boolean

  PAGE_ITEMS_SIZE = 20
  firstItem
  lastItem
  isLoadingHistory: boolean

  constructor(
    private dialog: MatDialog,
    private orderService: OrderService,
    private adminService: AdminService,
    private router: Router,
    private signalService: SignalService
  ) { }

  ngOnInit() {
    this.loadPaidOrders()
  }

  preloadTabData(ev) {
    switch (ev) {
      case 0:
        this.loadPaidOrders()
        break
      case 1:
        this.loadHistoryOrders()
        break
      case 2:
        this.loadServicePayments()
        break
    }
  }

  loadPaidOrders() {
    this.orderService.getArchivedOrders().subscribe((res) => {
      this.orders = res
      this.datasource = new MatTableDataSource(res)
      this.sum = this.orders.map((a) => a.totalPrice).reduce((a, b) => a + b, 0)
      this.amount = this.orders.length
    })
  }

  loadHistoryOrders() {
    this.isLoadingHistory = true
    this.adminService.getHistoryFirstPage(this.PAGE_ITEMS_SIZE).subscribe((res) => {
      this.lastItem = [...res].pop()
      this.datasourceHistorial = new MatTableDataSource(res)
      this.isLoadingHistory = false
    })
  }

  loadServicePayments() {
    this.orderService.getPaidOrders().subscribe((res) => {
      this.orders = res
      this.datasource = new MatTableDataSource(res)
    })
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase()
    this.datasource.filter = filterValue
  }

  clearAll() {
    let dialog = this.dialog.open(AppConfirmationDialogComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        type: 'delete-orders',
      },
    })
    dialog.afterClosed().subscribe((res) => {
      if (res) {
        this.clearAllOrders()
      }
    })
  }

  clearAllOrders() {
    this.isUpdatingOrders = true
    let queries = this.datasource.data.map((element) => {
      return this.orderService.delete(element.id)
    })
    Promise.all(queries).then((res) => {
      this.isUpdatingOrders = false
    })
  }

  redirect(path, id) {
    this.router.navigate([path, id])
  }

  nextPage() {
    this.isLoadingHistory = true
    this.adminService.getHistoryNextPage(this.PAGE_ITEMS_SIZE, this.lastItem).subscribe((res) => {
      this.isLoadingHistory = false
      this.datasourceHistorial = new MatTableDataSource(res)
      this.firstItem = [...res][0]
      this.lastItem = [...res].pop()
    })
  }

  updatePage() {
    this.isLoadingHistory = true
    this.firstItem = undefined
    this.adminService.getHistoryFirstPage(this.PAGE_ITEMS_SIZE).subscribe((res) => {
      setTimeout(() => {
        this.datasourceHistorial = new MatTableDataSource(res)
        this.lastItem = [...res].pop()
        this.isLoadingHistory = false
      }, 1000)
    })
  }

  previousPage() {
    this.adminService.getHistoryPreviousPage(this.PAGE_ITEMS_SIZE, this.firstItem).subscribe((res) => {
      let list = res.sort(function (a, b) {
        return b.createdAt - a.createdAt
      })
      this.datasourceHistorial = new MatTableDataSource(list)
      this.firstItem = [...res][0]
      this.lastItem = [...res].pop()
    })
  }
}
