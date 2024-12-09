import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core'
import { UserConstants } from '../../utils/user.constants'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { AuthStatus } from '../../../../auth/models/auth.model'

@Component({
  selector: 'app-user-status',
  templateUrl: './user-status.component.html',
  styleUrls: ['./user-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserStatusComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<UserStatusComponent>,
    @Inject(MAT_DIALOG_DATA) private dialogData: any) { }

  currentStatus: AuthStatus
  statusList = UserConstants.statusList

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