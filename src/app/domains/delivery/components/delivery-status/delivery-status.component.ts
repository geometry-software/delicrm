import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
// import { ORDER_STATUS_COLOR, ORDER_STATUS_TRANSLATE, OrderStatus } from '../../models/order.model'
import { DeliveryConstants } from '../../models/delivery.constants'
import { DeliveryStatus } from '../../models/delivery.model'
import { ORDER_STATUS_COLOR, ORDER_STATUS_TRANSLATE, OrderStatus } from '../../../orders/models/order.model'

@Component({
  selector: 'app-delivery-status',
  templateUrl: './delivery-status.component.html',
  styleUrls: ['./delivery-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderStatusComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<OrderStatusComponent>,
    @Inject(MAT_DIALOG_DATA) private dialogData: any
  ) { }

  currentStatus: DeliveryStatus
  statusList = DeliveryConstants.statusList
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