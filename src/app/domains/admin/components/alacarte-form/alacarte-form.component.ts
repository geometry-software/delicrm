import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { fadeInOnEnterAnimation, fadeInUpOnEnterAnimation, rubberBandOnEnterAnimation } from 'angular-animations'
import { PlateDetailComponent } from '../../../menu/components/plate-detail/plate-detail.component'
import { BoardActions as ItemActions } from '../../store/board-store/board.actions'
import { Order } from '../../../orders/models/order.model'
import { Recipe } from '../../../recipe/models/recipe.model'
import { setProteinImage } from '../../../../shared/utils/protein-image'
import { MenuConstants } from '../../../menu/utils/menu.constants'
import { Store } from '@ngrx/store'
// import { getCurrency, getMenu, getRestaurantInfo, isRestaurantOpen, loadingStatus } from '../../../menu/store/menu.selectors'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { MenuItem } from '../../models/restaurant'
import { TranslateService } from '@ngx-translate/core'
import { combineLatest, filter, map, tap } from 'rxjs'
import { UserService } from '../../../users/services/user.service'
import { SessionService } from '../../../../auth/services/session.service'
import { getAlacarteMenu, getRecipes, getRestaurantInfo, loadingStatus } from '../../store/board-store/board.selectors'
import { FormBuilder, FormGroup } from '@angular/forms'
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
})
export class AlacarteFormComponent {

  constructor(
    private dialog: MatDialog,
    private store: Store,
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService,
    private userService: UserService,
    private sessionService: SessionService,
    private formBuilder: FormBuilder
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