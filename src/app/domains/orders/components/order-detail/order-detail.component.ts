import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { MatTableDataSource } from '@angular/material/table'
import { MatDialog } from '@angular/material/dialog'
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { MatSnackBar } from '@angular/material/snack-bar'
import { OrderService } from '../../services/order.service'
import { fadeInLeftOnEnterAnimation, fadeInOnEnterAnimation } from 'angular-animations'
import { STATUS_COLOR, STATUS_ICON } from '../../utils/waiter.constants'
import { PrintService } from '../../../../shared/services/print.service'
import { tap } from 'rxjs'
import { Order, OrderStatus, OrderStatusValue, ProgressStatus } from '../../../menu/utils/waiter.model'
import { AppUser } from '../../../users/utils/user.model'
import { UserService } from '../../../users/services/user.service'

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
  animations: [fadeInOnEnterAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailComponent implements OnInit {
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
  user: AppUser

  constructor(
    private orderService: OrderService,
    private router: ActivatedRoute,
    private printService: PrintService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.initAuth()
    this.orderId = this.router.snapshot.params['id']
    this.orderService.getDocument(this.orderId).subscribe((value) => {
      console.log(value)
      this.order = value
      this.cdr.markForCheck()
      this.isOrderClosed = !!this.order.statusHistory.find((el) => el.status === 'paid' || el.status === 'canceled')
    })
  }

  copyAddress(): void {
    navigator.clipboard.writeText(this.order.category.delivery.address).then(() => this.openSnackBar('Dirección fue copiado'))
  }

  copyPhone(): void {
    navigator.clipboard.writeText(this.order.category.delivery.phone).then(() => this.openSnackBar('Teléfono fue copiado'))
  }

  openSnackBar(message: string): void {
    this.snackBar.open(message, '', {
      duration: 2000,
    })
  }

  print() {
    this.printService.connect().then((value) => this.printService.print(value, this.order.price.total))
  }

  update() {
    const currentStatus = this.order.status
    let newStatus: OrderStatusValue
    let progress: ProgressStatus
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
    const historyData: OrderStatus = {
      status: newStatus,
      timestamp: new Date(),
      user: this.user,
    }
    this.order.statusHistory.push(historyData)
    this.orderService.updateStatus(this.orderId, newStatus, this.order.statusHistory, progress)
  }

  initAuth() {
    // this.userService
    //   .getAppAuth()
    //   .pipe(
    //     tap((value) => {
    //       this.user = value
    //       this.cdr.markForCheck()
    //     })
    //   )
    //   .subscribe()
  }

  getTimestamp(status: OrderStatusValue): Date {
    return this.order.statusHistory.find((el) => el.status === status).timestamp
  }

  getUser(status: OrderStatusValue) {
    // return this.order.statusHistory.find((el) => el.status === status).user.name
  }
}
