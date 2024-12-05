import { ChangeDetectionStrategy, Component, Inject, OnInit, inject } from '@angular/core'
import { FormControl, FormsModule } from '@angular/forms'
import { EMPTY, Observable, debounceTime, tap } from 'rxjs'
import { Store, select } from '@ngrx/store'
import { getItemId, getLayoutLoading } from '../../store/user.selectors'
import { UserConstants } from '../../utils/user.constants'

import { MatRadioModule } from '@angular/material/radio'
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
    console.log(this.dialogData)
    this.currentStatus = this.dialogData.status
  }

  confirm() {

    console.log(1);

    this.dialogRef.close(this.currentStatus)
  }

  close() {
    this.dialogRef.close(false)
  }

}