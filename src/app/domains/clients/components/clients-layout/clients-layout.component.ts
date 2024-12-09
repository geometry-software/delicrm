import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core'
import { FormControl } from '@angular/forms'
import { EMPTY, Observable, debounceTime, tap } from 'rxjs'
import { Store, select } from '@ngrx/store'
import { getItemId, getLayoutLoading } from '../../store/client.selectors'
import { ClientConstants } from '../../utils/client.constants'
import { ClientActions as ItemActions } from '../../store/client.actions'

@Component({
  selector: 'app-clients-layout',
  templateUrl: './clients-layout.component.html',
  styleUrls: ['./clients-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsLayoutComponent implements OnInit {

  constructor(private store: Store) { }

  readonly itemId = this.store.pipe(select(getItemId))
  readonly layoutLoading = EMPTY
  readonly searchControl = new FormControl()
  readonly backTitle = ClientConstants.paginationTitle
  readonly searchPlaceholder = ClientConstants.searchPlaceholder
  readonly defaultSearchKey = ClientConstants.defaultSearchKey
  readonly defaultFirstPageRequest = ClientConstants.defaultFirstPageRequest

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
