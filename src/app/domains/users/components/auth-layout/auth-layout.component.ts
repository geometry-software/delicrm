import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core'
import { FormControl } from '@angular/forms'
import { Observable, debounceTime, tap } from 'rxjs'
import { Store, select } from '@ngrx/store'
import { getItemId, getLayoutLoading } from '../../store/user.selectors'
import { UserConstants } from '../../utils/user.constants'
import { AuthActions as ItemActions } from '../../store/user.actions'

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent implements OnInit {
  // DI
  readonly store: Store = inject(Store)

  // Selectors
  itemId: Observable<string> = this.store.pipe(select(getItemId))
  layoutLoading: Observable<boolean> = this.store.pipe(select(getLayoutLoading))

  // Other properties
  readonly searchControl = new FormControl()
  readonly backTitle = UserConstants.paginationTitle
  readonly searchPlaceholder = UserConstants.searchPlaceholder
  readonly defaultSearchKey = UserConstants.defaultSearchKey
  readonly defaultFirstPageRequest = UserConstants.defaultFirstPageRequest

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        tap((value) =>
          value
            ? this.store.dispatch(
              ItemActions.getItemsBySearchQuery({
                request: {
                  key: this.defaultSearchKey,
                  value,
                },
              })
            )
            : this.store.dispatch(ItemActions.getItems({ request: this.defaultFirstPageRequest }))
        )
      )
      .subscribe()
  }
}
