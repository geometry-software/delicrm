import { Component, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Order } from '../../../orders/models/order.model'

@Component({
  selector: 'app-delivery-detail',
  templateUrl: './delivery-detail.component.html',
  styleUrls: ['./delivery-detail.component.scss'],
})
export class DeliveryDetailComponent {
  isDeliverDetails: boolean
  hasActionButtons: boolean
  hasRedirectButton: boolean
  isDeleteOrder: boolean
  isRejectedOrder: boolean

  data: any

  constructor() { }

  confirm() {
    // this.dialogRef.close('confirm')
  }

  cancel() {
    // this.dialogRef.close('delete')
  }

  showConfirmaion() {
    this.isDeleteOrder = true
  }

  hideConfirmaion() {
    this.isDeleteOrder = false
  }
}
