import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { ORDER_STATUS_COLOR, ORDER_STATUS_TRANSLATE, OrderStatus } from '../../models/order.model'
import { OrderConstants } from '../../models/order.constants'

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderStatusComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<OrderStatusComponent>,
    @Inject(MAT_DIALOG_DATA) private dialogData: any
  ) { }

  currentStatus: OrderStatus
  readonly statusList = OrderConstants.dialogStatusList
  readonly orderTranslate = ORDER_STATUS_TRANSLATE
  readonly statusColor = ORDER_STATUS_COLOR

  ngOnInit(): void {
    this.currentStatus = this.dialogData.status
  }

  confirm(status: OrderStatus) {
    this.dialogRef.close(status)
  }

  close() {
    this.dialogRef.close(false)
  }

}