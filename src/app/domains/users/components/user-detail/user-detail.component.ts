import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { AppUser } from '../../utils/user.model'
import { UserConstants } from '../../utils/user.constants'
import { FormControl } from '@angular/forms'
import { tap } from 'rxjs'

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  readonly roleList = UserConstants.roleList
  role = new FormControl()

  constructor(public dialogRef: MatDialogRef<UserDetailComponent>, @Inject(MAT_DIALOG_DATA) public data: AppUser) { }

  ngOnInit() {
    // this.role.setValue(this.data.role)
    this.role.valueChanges.pipe(tap((value) => console.log(value))).subscribe()
  }
}
