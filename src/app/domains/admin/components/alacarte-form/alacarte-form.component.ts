import { ChangeDetectionStrategy, Component } from '@angular/core'
import { fadeInOnEnterAnimation, fadeInUpOnEnterAnimation, rubberBandOnEnterAnimation } from 'angular-animations'
import { BoardActions as ItemActions } from '../../store/board-store/board.actions'
import { Store } from '@ngrx/store'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { MenuItem } from '../../models/restaurant'
import { combineLatest, filter, map } from 'rxjs'
import { getAlacarteMenu, getRecipes, getRestaurantInfo, loadingStatus } from '../../store/board-store/board.selectors'
import { cloneDeep } from 'lodash'

@Component({
    selector: 'app-alacarte-form',
    templateUrl: './alacarte-form.component.html',
    styleUrls: ['./alacarte-form.component.scss'],
    animations: [
        fadeInOnEnterAnimation(),
        fadeInUpOnEnterAnimation(),
        rubberBandOnEnterAnimation()
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AlacarteFormComponent {

  constructor(
    private store: Store
  ) { }

  chosenPlates = new Array<MenuItem>

  readonly alacarteList = combineLatest([
    this.store.select(getRecipes).pipe(
      map(value => value.filter(el => el.type == 'alacarte').map(el => ({ ...el, isAdded: false }) as MenuItem) ?? [])),
    this.store.select(getAlacarteMenu).pipe(
      map(value => {
        this.chosenPlates = cloneDeep(value)
        return value.map(el => el.id)
      })),
    this.store.select(getRestaurantInfo).pipe(
      filter(Boolean),
      map(value => value.currency))
  ]).pipe(
    map(([recipes, menuIds, currency]) => recipes.map(recipe => ({ ...recipe, isAdded: menuIds.includes(recipe.id), currency }))))

  readonly isLoading = this.store.select(loadingStatus).pipe(
    map(value => value === LoadingStatus.Loading ? true : false))

  updateAlacarteMenu() {
    this.store.dispatch(ItemActions.createAlacarteMenu({ menu: this.chosenPlates }))
  }

  addPlate(item: MenuItem) {
    const isPlateAdded = this.chosenPlates.map(el => el.id).includes(item.id)
    if (isPlateAdded) {
      this.chosenPlates = this.chosenPlates.filter(el => el.id !== item.id)
    } else {
      this.chosenPlates.push({ ...item, isAdded: true })
    }
  }

}