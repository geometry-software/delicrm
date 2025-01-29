import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { RecipeConstants } from '../../models/recipe.constants'
import { debounceTime, tap } from 'rxjs'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Store } from '@ngrx/store'
import { RecipeActions as ItemActions } from '../../store/recipe.actions'
import { getItem, getItemId } from '../../store/recipe.selectors'

@Component({
  selector: 'app-recipe-layout',
  templateUrl: './recipe-layout.component.html',
  styleUrls: ['./recipe-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeLayoutComponent implements OnInit {

  constructor(
    private destroyRef: DestroyRef,
    private store: Store
  ) { }

  readonly searchControl = new FormControl()
  readonly backToListButton = RecipeConstants.backToListButton
  readonly searchPlaceholder = RecipeConstants.searchPlaceholder
  readonly defaultSearchKey = RecipeConstants.defaultSearchKey
  readonly defaultPageRequest = RecipeConstants.defaultPageRequest
  readonly item = this.store.select(getItem)

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
          : this.store.dispatch(ItemActions.getItems({ request: this.defaultPageRequest }))
        ),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe()
  }

  deleteItem(id: string) {
    this.store.dispatch(ItemActions.deleteItem({ id }))
  }
}
