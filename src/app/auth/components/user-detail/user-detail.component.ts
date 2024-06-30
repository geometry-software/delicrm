import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { AuthUser } from '../../utils/auth.model'
import { AuthConstants } from '../../utils/auth.constants'
import { FormControl } from '@angular/forms'
import { tap } from 'rxjs'

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  readonly roleList = AuthConstants.roleList
  role = new FormControl()

  constructor(public dialogRef: MatDialogRef<UserDetailComponent>, @Inject(MAT_DIALOG_DATA) public data: AuthUser) { }

  ngOnInit() {
    this.role.setValue(this.data.role)
    this.role.valueChanges.pipe(tap((value) => console.log(value))).subscribe()
  }
}
