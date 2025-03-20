import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { UserConstants } from '../../models/user.constants'
import { FormControl } from '@angular/forms'
import { UserRole, UserStatus } from '../../models/user.model'

@Component({
  selector: 'app-user-status',
  templateUrl: './user-status.component.html',
  styleUrls: ['./user-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserStatusComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<UserStatusComponent>,
    @Inject(MAT_DIALOG_DATA) private dialogData: any
  ) { }

  readonly currentStatus = new FormControl<UserStatus>(null)
  readonly currentRole = new FormControl<UserRole>(null)
  readonly statusList = UserConstants.statusList.filter(el => el !== 'requested')
  readonly roleList = UserConstants.roleList

  ngOnInit(): void {
    this.currentStatus.setValue(this.dialogData.status)
    this.currentRole.setValue(this.dialogData.role)
  }

  confirm() {
    const response = {
      status: this.currentStatus.value,
      role: this.currentRole.value,
    }
    this.dialogRef.close(response)
  }

  isConfirmDisabled() {
    return !this.currentStatus.value || !this.currentRole.value
  }

  close() {
    this.dialogRef.close(false)
  }

}