import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ClientConstants } from '../../utils/client.constants'
import { FormControl } from '@angular/forms'
import { map, Observable, switchMap, tap } from 'rxjs'
import { Store } from '@ngrx/store'
import { ClientActions as ItemActions } from '../../store/client.actions'
import { getItem } from '../../store/client.selectors'
import { ActivatedRoute } from '@angular/router'
import { Auth } from '../../../../auth/models/auth.model'

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.scss'],
})
export class ClientDetailComponent implements OnInit {

  constructor(private store: Store, private route: ActivatedRoute,) { }

  user = this.route.params.pipe(
    map(value => value['id']),
    switchMap(id => this.store.select(getItem(id)))
  )

  ngOnInit() {
    // this.user = 
  }

}