import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { User } from '../../utils/user.model'
import { UserConstants } from '../../utils/user.constants'
import { FormControl } from '@angular/forms'
import { map, Observable, switchMap, tap } from 'rxjs'
import { Store } from '@ngrx/store'
import { UserActions as ItemActions } from '../../store/user.actions'
import { getItem } from '../../store/user.selectors'
import { ActivatedRoute } from '@angular/router'
import { Auth } from '../../../../auth/models/auth.model'

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {

  constructor(private store: Store, private route: ActivatedRoute,) { }

  user = this.route.params.pipe(
    map(value => value['id']),
    switchMap(id => this.store.select(getItem(id)))
  )

  ngOnInit() {
    // this.user = 
  }

}