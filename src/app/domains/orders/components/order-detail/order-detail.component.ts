import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { MatTableDataSource } from '@angular/material/table'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { OrderService } from '../../services/order.service'
import { fadeInLeftOnEnterAnimation, fadeInOnEnterAnimation } from 'angular-animations'
import { STATUS_COLOR, STATUS_ICON } from '../../models/order.constants'
import { PrintService } from '../../../../shared/services/print.service'
import { tap } from 'rxjs'
import { Order, OrderStatus, OrderProgressStatus } from '../../models/order.model'
import { UserService } from '../../../users/services/user.service'
import { getCurrentUnixTime } from '../../../../shared/utils/format-unix-time'

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
  animations: [fadeInOnEnterAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailComponent implements OnInit {

  constructor(
    private orderService: OrderService,
    private router: ActivatedRoute,
    private printService: PrintService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private userService: UserService
  ) { }

  tableNumber: string
  isOrderClosed: boolean
  isTableOrder: boolean
  isDeliveryOrder: boolean
  isButtonReadyToAppear: boolean
  copiedPhone: number
  copiedAddress: string
  order: Order
  orderId: string
  statusButtonTitle: string = 'Update'
  printButtonTitle: string = 'Print'
  statusColor = STATUS_COLOR
  statusIcon = STATUS_ICON

  ngOnInit() {
    this.initAuth()
    this.orderId = this.router.snapshot.params['id']
    // this.orderService.getDocument(this.orderId).subscribe(value => {
    //   console.log(value)
    //   this.order = value
    //   this.cdr.markForCheck()
    //   this.isOrderClosed = !!this.order.statusHistory.find((el) => el.status === 'paid' || el.status === 'canceled')
    // })
  }

  copyAddress(): void {
    navigator.clipboard.writeText(this.order.category.delivery.address)
      .then(() => this.openSnackBar('Dirección fue copiado'))
  }

  copyPhone(): void {
    navigator.clipboard.writeText(this.order.category.delivery.phone)
      .then(() => this.openSnackBar('Teléfono fue copiado'))
  }

  openSnackBar(message: string): void {
    this.snackBar.open(message, '', {
      duration: 2000,
    })
  }

  print() {
    this.printService.connect().then(value => this.printService.print(value, this.order.price.total))
  }

  update() {
    const currentStatus = this.order.status
    let newStatus: OrderStatus
    let progress: OrderProgressStatus
    switch (currentStatus) {
      case 'cooking':
        newStatus = 'delivery'
        progress = '80%'
        break
      case 'delivery':
        newStatus = 'paid'
        progress = '100%'
        break
    }
    // const historyData: OrderStatusHistory = {
    //   status: newStatus,
    //   createdAt: getCurrentUnixTime,
    //   user: this.user,
    // }
    // this.order.statusHistory.push(historyData)
    // this.orderService.updateStatus(this.orderId, newStatus, this.order.statusHistory, progress)
  }

  initAuth() {
    // this.userService
    //   .getAppAuth()
    //   .pipe(
    //     tap(value => {
    //       this.user = value
    //       this.cdr.markForCheck()
    //     })
    //   )
    //   .subscribe()
  }

  getTimestamp(status: OrderStatus) {
    // return this.order.statusHistory.find((el) => el.status === status).createdAt
  }

  getUser(status: OrderStatus) {
    // return this.order.statusHistory.find((el) => el.status === status).user.name
  }
}
