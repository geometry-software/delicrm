import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core'
import { ClientConstants } from '../../utils/client.constants'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { ClientStatus } from '../../models/client.model'

@Component({
  selector: 'app-client-status',
  templateUrl: './client-status.component.html',
  styleUrls: ['./client-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientStatusComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ClientStatusComponent>,
    @Inject(MAT_DIALOG_DATA) private dialogData: any) { }

  currentStatus: ClientStatus
  statusList = ClientConstants.statusList

  ngOnInit(): void {
    this.currentStatus = this.dialogData.status
  }

  confirm() {
    this.dialogRef.close(this.currentStatus)
  }

  close() {
    this.dialogRef.close(false)
  }

}