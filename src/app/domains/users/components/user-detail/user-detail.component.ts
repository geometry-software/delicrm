import { Component, OnInit } from '@angular/core'
import { map, switchMap } from 'rxjs'
import { Store } from '@ngrx/store'
import { getItem } from '../../store/user.selectors'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {

  constructor(private store: Store, private route: ActivatedRoute) { }

  user = this.route.params.pipe(
    map(value => value['id']),
    switchMap(id => this.store.select(getItem(id)))
  )

  ngOnInit() {
    // this.user = 
  }

}