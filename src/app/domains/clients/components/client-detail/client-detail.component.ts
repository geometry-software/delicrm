import { Component } from '@angular/core'
import { map, switchMap } from 'rxjs'
import { Store } from '@ngrx/store'
import { getItemById } from '../../store/client.selectors'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.scss'],
})
export class ClientDetailComponent {

  constructor(
    private store: Store,
    private route: ActivatedRoute
  ) { }

  user = this.route.params.pipe(
    map(value => value['id']),
    switchMap(id => this.store.select(getItemById(id)))
  )

}