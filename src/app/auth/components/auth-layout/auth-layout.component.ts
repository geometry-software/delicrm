import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core'
import { FormControl } from '@angular/forms'
import { Observable, debounceTime, tap } from 'rxjs'
import { Store, select } from '@ngrx/store'
import { getItemId, getLayoutLoading } from '../../store/auth.selectors'
import { AuthConstants } from '../../utils/auth.constants'
import { AuthActions as ItemActions } from '../../store/auth.actions'

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent implements OnInit {
  // DI
  readonly store$: Store = inject(Store)

  // Selectors
  itemId$: Observable<string> = this.store$.pipe(select(getItemId))
  layoutLoading$: Observable<boolean> = this.store$.pipe(select(getLayoutLoading))

  // Other properties
  readonly searchControl = new FormControl()
  readonly backTitle = AuthConstants.paginationTitle
  readonly searchPlaceholder = AuthConstants.searchPlaceholder
  readonly defaultSearchKey = AuthConstants.defaultSearchKey
  readonly defaultFirstPageRequest = AuthConstants.defaultFirstPageRequest

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        tap((value) =>
          value
            ? this.store$.dispatch(
                ItemActions.getItemsBySearchQuery({
                  request: {
                    key: this.defaultSearchKey,
                    value,
                  },
                })
              )
            : this.store$.dispatch(ItemActions.getItems({ request: this.defaultFirstPageRequest }))
        )
      )
      .subscribe()
  }
}
