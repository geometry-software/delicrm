import { ChangeDetectionStrategy, Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { ORDER_STATUS_COLOR, ORDER_STATUS_TRANSLATE, OrderStatus, OrderStatusInput, orderStatusRecord } from '../../models/order-status'

@Component({
    selector: 'app-order-status',
    templateUrl: './app-order-status.component.html',
    styleUrls: ['./app-order-status.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})

export class AppOrderStatusComponent<OrderStatus> {

  readonly statusList = Object.entries(orderStatusRecord).map(([k]) => k)
  readonly orderTranslate = ORDER_STATUS_TRANSLATE
  readonly statusColor = ORDER_STATUS_COLOR

  constructor(
    private dialogRef: MatDialogRef<AppOrderStatusComponent<OrderStatus>>,
    @Inject(MAT_DIALOG_DATA) private dialogData: OrderStatusInput
  ) { }

  currentStatus: OrderStatus
  currentStatusList: string[]

  ngOnInit(): void {
    this.currentStatus = this.dialogData.status as OrderStatus
    this.currentStatusList = this.statusList.filter(el => this.dialogData.list.includes(el))
  }

  confirm(status: string) {
    this.dialogRef.close(status)
  }

  close() {
    this.dialogRef.close(false)
  }

}