import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core'
import { FormControl } from '@angular/forms'
import { EMPTY, Observable, debounceTime, tap } from 'rxjs'
import { Store, select } from '@ngrx/store'
import { getItemId, getLayoutLoading } from '../../store/user.selectors'
import { UserConstants } from '../../utils/user.constants'
import { UserActions as ItemActions } from '../../store/user.actions'

@Component({
  selector: 'app-users-layout',
  templateUrl: './users-layout.component.html',
  styleUrls: ['./users-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersLayoutComponent implements OnInit {

  constructor(private store: Store) { }

  readonly itemId = this.store.pipe(select(getItemId))
  readonly layoutLoading = EMPTY
  readonly searchControl = new FormControl()
  readonly backTitle = UserConstants.paginationTitle
  readonly searchPlaceholder = UserConstants.searchPlaceholder
  readonly defaultSearchKey = UserConstants.defaultSearchKey
  readonly defaultFirstPageRequest = UserConstants.defaultFirstPageRequest

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        tap(value => value
          ? this.store.dispatch(
            ItemActions.getItemsBySearchQuery({
              request: {
                key: this.defaultSearchKey,
                value,
              },
            }))
          : this.store.dispatch(ItemActions.getItems({ request: this.defaultFirstPageRequest }))
        )
      )
      .subscribe()
  }
}
