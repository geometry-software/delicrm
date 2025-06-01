import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, ViewChild } from '@angular/core'
import { fadeInUpOnEnterAnimation, fadeInDownOnEnterAnimation, fadeOutDownOnLeaveAnimation } from 'angular-animations'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { MatStepper } from '@angular/material/stepper'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Observable, combineLatest, filter, map, startWith } from 'rxjs'
import { SignalService } from '../../../../shared/services/signal.service'
import { getCurrentUnixTime } from '../../../../shared/utils/format-unix-time'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { Store } from '@ngrx/store'
import { BoardActions as ItemActions } from '../../store/board-store/board.actions'
import { getCurrency, loadingStatus, rebuildMenu } from '../../store/board-store/board.selectors'
import { DailyMenu, MenuItem } from '../../models/restaurant'
import { highlightInvalidFields, showFieldErrors } from '../../../../shared/utils/form-error-handling'
import { TranslateService } from '@ngx-translate/core'
import { MenuFormService } from '../../services/menu-form.service'
import { Recipe } from '../../../recipe/models/recipe.model'
import { requiredAutocompleteValidator } from '../../../../shared/utils/required-autocomplete-validator.validator'

@Component({
    selector: 'app-menu-form',
    templateUrl: './menu-form.component.html',
    styleUrls: ['./menu-form.component.scss'],
    animations: [
        fadeOutDownOnLeaveAnimation(),
        fadeInDownOnEnterAnimation(),
        fadeInUpOnEnterAnimation()
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class MenuFormComponent implements AfterViewInit {

  constructor(
    private signalService: SignalService,
    private translateService: TranslateService,
    private menuFormService: MenuFormService,
    private store: Store,
    private destroyRef: DestroyRef
  ) { }

  private startersAmount: number
  private drinksAmount: number
  private sideDishesAmount: number
  private dessertsAmount: number

  extrasForm: FormGroup
  @ViewChild('stepper') stepper: MatStepper

  readonly isFormDataLoaded = combineLatest([
    this.menuFormService.getRecipes(),
    this.menuFormService.getMainPlates(),
    this.menuFormService.getChosenPlates(),
    this.menuFormService.getExtrasAmount().pipe(filter(Boolean)),
  ]).pipe(
    map(([recipes, plates, chosenPlates, extrasAmount]) => {
      this.startersAmount = extrasAmount.starters
      this.drinksAmount = extrasAmount.drinks
      this.sideDishesAmount = extrasAmount.sideDishes
      this.dessertsAmount = extrasAmount.desserts
      this.plateList = plates
      this.chosenPlates = chosenPlates
      this.recipes = recipes
      this.extrasForm = this.menuFormService.getForm()
      this.initAutocompleteOptions()
      this.signalService.setLoadingStatus(LoadingStatus.Loaded)
      return true
    }))
  readonly isLoading = this.store.select(loadingStatus).pipe(
    map(value => value === LoadingStatus.Loading ? true : false))
  readonly currency = this.store.select(getCurrency)
  readonly filteredStarterOptions: Observable<MenuItem[]>[] = []
  readonly filteredDrinkOptions: Observable<MenuItem[]>[] = []
  readonly filteredSideDishOptions: Observable<MenuItem[]>[] = []
  readonly filteredDessertOptions: Observable<MenuItem[]>[] = []
  readonly showFieldErrors = showFieldErrors

  recipes: Array<Recipe>
  plateList: Array<MenuItem>
  starterList: Array<MenuItem>
  drinkList: Array<MenuItem>
  sideDishList: Array<MenuItem>
  dessertList: Array<MenuItem>

  chosenPlates: Array<MenuItem>
  hasStartersValidationError: boolean
  dailyMenu: DailyMenu

  get starters() {
    return this.menuFormService.getStarters()
  }

  get drinks() {
    return this.menuFormService.getDrinks()
  }

  get sideDishes() {
    return this.menuFormService.getSideDishes()
  }

  get desserts() {
    return this.menuFormService.getDesserts()
  }

  ngAfterViewInit(): void {
    this.rebuildMenu()
  }

  getStartersLabel(index: number) {
    const label = this.translateService.instant('MISC.PLATE_TYPE.STARTER')
    return `${label} ${index + 1}`
  }

  getDrinksLabel(index: number) {
    const label = this.translateService.instant('MISC.PLATE_TYPE.DRINK')
    return `${label} ${index + 1}`
  }

  getSideDishesLabel(index: number) {
    const label = this.translateService.instant('MISC.PLATE_TYPE.SIDE_DISH')
    return `${label} ${index + 1}`
  }

  getDessertLabel(index: number) {
    const label = this.translateService.instant('MISC.PLATE_TYPE.DESSERT')
    return `${label} ${index + 1}`
  }

  addStarter() {
    this.starters.push(new FormControl(null, Validators.required))
    const index = this.starters.length - 1
    this.starters.at(index).setValidators(requiredAutocompleteValidator)
    this.filteredStarterOptions[index] = this.starters.at(index).valueChanges.pipe(
      map(search => search
        ? this.starterList.filter(option => {
          const name = typeof search === 'string' ? search : search?.name;
          return option?.name.toLowerCase().includes(name?.toLowerCase())
        })
        : this.starterList.slice()
      )
    )
  }

  removeStarter(index: number) {
    this.starters.removeAt(index)
    this.hasStartersValidationError = false
  }

  addDrink() {
    this.drinks.push(new FormControl(null, Validators.required))
    const index = this.drinks.length - 1
    this.drinks.at(index).setValidators(requiredAutocompleteValidator)
    this.filteredDrinkOptions[index] = this.drinks.at(index).valueChanges.pipe(
      map(search => search
        ? this.drinkList.filter(option => {
          const name = typeof search === 'string' ? search : search?.name;
          return option?.name.toLowerCase().includes(name?.toLowerCase())
        })
        : this.drinkList.slice()
      )
    )
  }

  removeDrink(index: number) {
    this.drinks.removeAt(index)
    this.hasStartersValidationError = false
  }

  addSidedish() {
    this.sideDishes.push(new FormControl(null, Validators.required))
    const index = this.sideDishes.length - 1
    this.sideDishes.at(index).setValidators(requiredAutocompleteValidator)
    this.filteredSideDishOptions[index] = this.sideDishes.at(index).valueChanges.pipe(
      map(search => search
        ? this.drinkList.filter(option => {
          const name = typeof search === 'string' ? search : search?.name;
          return option?.name.toLowerCase().includes(name?.toLowerCase())
        })
        : this.sideDishList.slice()
      )
    )
  }

  removeSidedish(index: number) {
    this.sideDishes.removeAt(index)
    this.hasStartersValidationError = false
  }

  addDessert() {
    this.desserts.push(new FormControl(null, Validators.required))
    const index = this.desserts.length - 1
    this.desserts.at(index).setValidators(requiredAutocompleteValidator)
    this.filteredDessertOptions[index] = this.desserts.at(index).valueChanges.pipe(
      map(search => search
        ? this.drinkList.filter(option => {
          const name = typeof search === 'string' ? search : search?.name;
          return option?.name.toLowerCase().includes(name?.toLowerCase())
        })
        : this.dessertList.slice()
      )
    )
  }

  removeDessert(index: number) {
    this.desserts.removeAt(index)
    this.hasStartersValidationError = false
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
      this.dailyMenu = {
        createdAt: getCurrentUnixTime(),
        extrasAmount: {
          starters: this.starters.length,
          drinks: this.drinks.length,
          sideDishes: this.sideDishes.length,
          desserts: this.desserts.length
        },
        extras: this.extrasForm.value,
        main: this.chosenPlates
      }
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
    this.store.dispatch(ItemActions.createDailyMenu({ menu: this.dailyMenu }))
  }

  private rebuildMenu() {
    this.store.select(rebuildMenu).pipe(
      filter(Boolean),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.initAutocompleteOptions()
      this.stepper.reset()
    })
  }

  private initAutocompleteOptions() {
    this.starterList = this.recipes.filter(value => value.type == 'starter')
    this.drinkList = this.recipes.filter(value => value.type == 'drink')
    this.sideDishList = this.recipes.filter(value => value.type == 'side')
    this.dessertList = this.recipes.filter(value => value.type == 'dessert')
    for (let i = 0; i < this.startersAmount; i++) {
      this.filteredStarterOptions[i] = this.starters.at(i).valueChanges.pipe(
        startWith(null),
        map(search => search
          ? this.starterList.filter(option => {
            const name = typeof search === 'string' ? search : search?.name;
            return option?.name.toLowerCase().includes(name?.toLowerCase())
          })
          : this.starterList.slice()
        )
      )
    }
    for (let i = 0; i < this.drinksAmount; i++) {
      this.filteredDrinkOptions[i] = this.drinks.at(i).valueChanges.pipe(
        startWith(null),
        map(search => search
          ? this.drinkList.filter(option => {
            const name = typeof search === 'string' ? search : search?.name;
            return option?.name.toLowerCase().includes(name?.toLowerCase())
          })
          : this.drinkList.slice()
        )
      )
    }
    for (let i = 0; i < this.sideDishesAmount; i++) {
      this.filteredSideDishOptions[i] = this.sideDishes.at(i).valueChanges.pipe(
        startWith(null),
        map(search => search
          ? this.sideDishList.filter(option => {
            const name = typeof search === 'string' ? search : search?.name;
            return option?.name.toLowerCase().includes(name?.toLowerCase())
          })
          : this.sideDishList.slice()
        )
      )
    }
    for (let i = 0; i < this.dessertsAmount; i++) {
      this.filteredDessertOptions[i] = this.desserts.at(i).valueChanges.pipe(
        startWith(null),
        map(search => search
          ? this.dessertList.filter(option => {
            const name = typeof search === 'string' ? search : search?.name;
            return option?.name.toLowerCase().includes(name?.toLowerCase())
          })
          : this.dessertList.slice()
        )
      )
    }
  }

}