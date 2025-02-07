import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, OnInit, ViewChild } from '@angular/core'
import { fadeInUpOnEnterAnimation, fadeInDownOnEnterAnimation, fadeOutDownOnLeaveAnimation } from 'angular-animations'
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms'
import { MatStepper } from '@angular/material/stepper'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Observable, combineLatest, filter, map, of, startWith, switchMap, tap } from 'rxjs'
import { SignalService } from '../../../../shared/services/signal.service'
import { RecipeService } from '../../../recipe/services/recipe.service'
import { getCurrentUnixTime } from '../../../../shared/utils/format-unix-time'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { Store } from '@ngrx/store'
import { AdminActions as ItemActions } from '../../store/admin-store/admin.actions'
import { getCurrency, getRecipes, getRestaurantInfo, loadingStatus, rebuildMenu } from '../../store/admin-store/admin.selectors'
import { DailyMenu, MenuItem } from '../../models/restaurant'
import { highlightInvalidFields, showFieldErrors } from '../../../../shared/utils/form-error-handling'
import { TranslateService } from '@ngx-translate/core'
import { RestaurantService } from '../../services/restaurant.service'
import { MenuFormService } from '../../services/menu-form.service'

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.component.html',
  styleUrls: ['./menu-form.component.scss'],
  animations: [
    fadeOutDownOnLeaveAnimation(),
    fadeInDownOnEnterAnimation(),
    fadeInUpOnEnterAnimation()
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuFormComponent implements AfterViewInit {

  constructor(
    private signalService: SignalService,
    private translateService: TranslateService,
    private menuFormService: MenuFormService,
    private store: Store,
    private destroyRef: DestroyRef
  ) { }

  ngAfterViewInit(): void {
    this.store.select(rebuildMenu).pipe(
      filter(Boolean),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.stepper.reset())
  }

  private startersAmount: number
  private drinksAmount: number
  private sideDishesAmount: number

  menuForm: FormGroup
  plateForm: FormGroup
  @ViewChild('stepper') stepper: MatStepper

  readonly isFormDataLoaded = combineLatest([
    this.store.select(getRecipes).pipe(filter(Boolean)),
    this.store.select(getRestaurantInfo).pipe(filter(Boolean)),
  ]).pipe(
    tap(([recipes, info]) => {
      this.startersAmount = info.startersAmount
      this.drinksAmount = info.drinksAmount
      this.sideDishesAmount = info.sideDishesAmount
      this.menuForm = this.menuFormService.menuForm
      this.plateForm = this.menuFormService.plateForm
      this.initAutocompleteOptions(recipes)
      this.signalService.setLoadingStatus(LoadingStatus.Loaded)
    }),
    map(() => true))

  readonly isLoading = this.store.select(loadingStatus).pipe(
    filter(value => value === LoadingStatus.Loading),
    map(Boolean)
  )
  readonly currency = this.store.select(getCurrency)

  plateList: Array<MenuItem>
  starterList: Array<MenuItem>
  drinkList: Array<MenuItem>
  sideDishesList: Array<MenuItem>
  alacarteList: Array<MenuItem>

  chosenPlates: Array<MenuItem> = []

  barSource
  barSourceColumns = ['name', 'price', 'remove']
  hasBarItems: boolean

  hasStartersValidationError: boolean

  dailyMenu: DailyMenu = {
    open: false,
    extras: null,
    alacarte: null,
    main: null,
    createdAt: null,
    orders: null
  }

  adminList: Array<any>
  chefList: Array<any>
  waiterList: Array<any>
  deliveryList: Array<any>

  filteredStarterOptions: Observable<MenuItem[]>[] = []
  filteredDrinkOptions: Observable<MenuItem[]>[] = []
  filteredSideDishesOptions: Observable<MenuItem[]>[] = []

  readonly showFieldErrors = showFieldErrors

  get starters() {
    return this.menuFormService.getStarters()
  }

  get drinks() {
    return this.menuFormService.getDrinks()
  }

  get sideDishes() {
    return this.menuFormService.getSideDishes()
  }

  getStartersLabel(index: number) {
    const label = this.translateService.instant('ADMIN.BOARD.FORM.LABEL.STARTER')
    return `${label} ${index + 1}`
  }

  getDrinksLabel(index: number) {
    const label = this.translateService.instant('ADMIN.BOARD.FORM.LABEL.DRINK')
    return `${label} ${index + 1}`
  }

  getSideDishesLabel(index: number) {
    const label = this.translateService.instant('ADMIN.BOARD.FORM.LABEL.SIDE_DISH')
    return `${label} ${index + 1}`
  }

  initAutocompleteOptions(recipes: MenuItem[]) {
    this.starterList = recipes.filter(value => value.type == 'starter')
    this.drinkList = recipes.filter(value => value.type == 'drink')
    this.sideDishesList = recipes.filter(value => value.type == 'side')
    this.alacarteList = recipes.filter(value => value.type == 'alacarte')
    this.plateList = recipes.filter(value => value.type == 'main')
    for (let i = 0; i < this.startersAmount; i++) {
      this.filteredStarterOptions[i] = this.starters.at(i).valueChanges.pipe(
        startWith<string | MenuItem>(''),
        map(value => (typeof value === 'string' ? value : value?.name)),
        map(name => name
          ? this.starterList.filter((option) => option.name.toLowerCase().includes(name.toLowerCase()))
          : this.starterList.slice()
        )
      )
    }
    for (let i = 0; i < this.drinksAmount; i++) {
      this.filteredDrinkOptions[i] = this.drinks.at(i).valueChanges.pipe(
        startWith<string | MenuItem>(''),
        map(value => (typeof value === 'string' ? value : value?.name)),
        map(name => name
          ? this.drinkList.filter((option) => option.name.toLowerCase().includes(name.toLowerCase()))
          : this.drinkList.slice()
        )
      )
    }
    for (let i = 0; i < this.sideDishesAmount; i++) {
      this.filteredSideDishesOptions[i] = this.sideDishes.at(i).valueChanges.pipe(
        startWith<string | MenuItem>(''),
        map(value => (typeof value === 'string' ? value : value?.name)),
        map(name => name
          ? this.sideDishesList.filter((option) => option.name.toLowerCase().includes(name.toLowerCase()))
          : this.sideDishesList.slice()
        )
      )
    }
  }

  displayFn(item: MenuItem): string {
    return item && item.name ? item.name : ''
  }

  addExtras(form: FormGroup, stepper: MatStepper) {
    this.hasStartersValidationError = false
    if (form.valid) {
      stepper.next()
    } else {
      highlightInvalidFields(form)
      this.hasStartersValidationError = true
    }
  }

  choosePlates(stepper: MatStepper) {
    if (this.chosenPlates.length) {
      stepper.next()
      this.dailyMenu.extras = this.menuForm.value
      this.dailyMenu.main = this.chosenPlates
    }
  }

  addPlate(item: MenuItem) {
    const isPlateAdded = this.chosenPlates.map(el => el.id).includes(item.id)
    if (isPlateAdded) {
      this.chosenPlates = this.chosenPlates.filter(el => el.id !== item.id)
    } else {
      this.chosenPlates.push({ ...item, isAdded: true })
    }
  }

  createDailyMenu() {
    this.dailyMenu.open = true
    this.dailyMenu.createdAt = getCurrentUnixTime()
    this.dailyMenu.orders = []
    this.store.dispatch(ItemActions.createDailyMenu({ menu: this.dailyMenu }))
  }

}