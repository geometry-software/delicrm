import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { MatTableDataSource } from '@angular/material/table'
import { fadeInUpOnEnterAnimation, fadeInDownOnEnterAnimation, fadeOutDownOnLeaveAnimation } from 'angular-animations'
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms'
import { AdminService } from '../../services/admin.service'
import { MatStepper } from '@angular/material/stepper'
import { Observable, filter, map, of, startWith, switchMap, tap } from 'rxjs'
import { Recipe } from '../../../recipe/models/recipe.model'
import { SignalService } from '../../../../shared/services/signal.service'
import { RecipeEntityService } from '../../../recipe/services/recipe.service'
import { getCurrentUnixTime } from '../../../../shared/utils/format-unix-time'
import { RestaurantConstants } from '../../models/restaurant.constants'
import { LoadingStatus } from '../../../../shared/models/loading-status'
import { RestaurantService } from '../../services/restaurant.service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Store } from '@ngrx/store'
import { AdminActions as ItemActions } from '../../store/admin.actions'
import { loadingStatus } from '../../store/admin.selectors'

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.component.html',
  styleUrls: ['./menu-form.component.scss'],
  animations: [fadeOutDownOnLeaveAnimation(), fadeInDownOnEnterAnimation(), fadeInUpOnEnterAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuFormComponent implements OnInit {

  constructor(
    private signalService: SignalService,
    private formBuilder: FormBuilder,
    private recipeEntityService: RecipeEntityService,
    private store: Store,
  ) { }

  private readonly startersAmount = RestaurantConstants.startersAmount
  private readonly drinksAmount = RestaurantConstants.drinksAmount
  readonly isFormDataLoaded = of(this.signalService.setLoadingStatus(LoadingStatus.Loading)).pipe(
    switchMap(() => this.recipeEntityService.getAll().pipe(
      tap(recipes => {
        this.signalService.setLoadingStatus(LoadingStatus.Loaded)
        this.initAutocompleteOptions(recipes)
      }),
      map(() => true)))
  )
  readonly isLoading = this.store.select(loadingStatus).pipe(
    filter(value => value === LoadingStatus.Loading),
    map(Boolean)
  )

  menuForm: FormGroup
  plateForm: FormGroup

  plateList: Array<Recipe & { isAdded?: boolean }>
  starterList: Array<Recipe>
  drinkList: Array<Recipe>
  barList: Array<Recipe>
  saladList: Array<Recipe>
  dessertList: Array<Recipe>
  riceList: Array<Recipe>
  garnishList: Array<Recipe>

  chosenPlates = []

  barSource
  barSourceColumns = ['name', 'price', 'remove']
  hasBarItems: boolean

  hasStartersValidationError: boolean

  dailyMenu: any = {}

  adminList: Array<any>
  chefList: Array<any>
  waiterList: Array<any>
  deliveryList: Array<any>

  filteredStarterOptions: Observable<Recipe[]>[] = []
  filteredDrinkOptions: Observable<Recipe[]>[] = []
  filteredSaladOptions: Observable<Recipe[]>
  filteredRiceOptions: Observable<Recipe[]>
  filteredGarnishOptions: Observable<Recipe[]>
  filteredDessertOptions: Observable<Recipe[]>

  ngOnInit() {
    this.initForm()
    this.updateServerDataBar()
  }

  initForm() {
    this.menuForm = this.formBuilder.group({
      starters: this.addFormArrayItem(this.startersAmount),
      drinks: this.addFormArrayItem(this.drinksAmount),
      salad: [null, Validators.required],
      rice: [null, Validators.required],
      garnish: [null, Validators.required],
      dessert: [null, Validators.required],
    })
    this.plateForm = this.formBuilder.group({})
  }

  addFormArrayItem(amount: number) {
    const array: FormArray = this.formBuilder.array([])
    for (let i = 0; i < amount; i++) {
      array.push(
        this.formBuilder.group({
          item: [null, [Validators.required]],
        })
      )
    }
    return array
  }

  addFormItem() {
    return new FormGroup({
      item: new FormControl(null, Validators.required),
    })
  }

  getStarters() {
    return this.menuForm.get('starters') as FormArray
  }

  getDrinks() {
    return this.menuForm.get('drinks') as FormArray
  }

  initAutocompleteOptions(recipes) {
    this.starterList = recipes.filter(value => value.type == 'starter')
    this.drinkList = recipes.filter(value => value.type == 'drink')
    this.saladList = recipes.filter(value => value.type == 'salad')
    this.riceList = recipes.filter(value => value.type == 'rice')
    this.garnishList = recipes.filter(value => value.type == 'garnish')
    this.dessertList = recipes.filter(value => value.type == 'dessert')
    this.barList = recipes.filter(value => value.type == 'alacarte')
    this.plateList = recipes.filter(value => value.type == 'main')
    for (let i = 0; i < this.startersAmount; i++) {
      this.filteredStarterOptions[i] = this.getStarters()
        .at(i)
        .get('item')
        .valueChanges.pipe(
          startWith<string | Recipe>(''),
          map(value => (typeof value === 'string' ? value : value.name)),
          map(name => name
            ? this.starterList.filter((option) => option.name.toLowerCase().includes(name.toLowerCase()))
            : this.starterList.slice()
          )
        )
    }
    for (let i = 0; i < this.drinksAmount; i++) {
      this.filteredDrinkOptions[i] = this.getDrinks()
        .at(i)
        .get('item')
        .valueChanges.pipe(
          startWith<string | Recipe>(''),
          map(value => (typeof value === 'string' ? value : value.name)),
          map(name => name
            ? this.drinkList.filter((option) => option.name.toLowerCase().includes(name.toLowerCase()))
            : this.drinkList.slice()
          )
        )
    }
    this.filteredSaladOptions = this.menuForm.get('salad').valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.name)),
      map(name => name
        ? this.saladList.filter((option) => option.name.toLowerCase().includes(name.toLowerCase()))
        : this.saladList.slice()
      )
    )
    this.filteredRiceOptions = this.menuForm.get('rice').valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.name)),
      map(name => name
        ? this.riceList.filter((option) => option.name.toLowerCase().includes(name.toLowerCase()))
        : this.riceList.slice()
      )
    )
    this.filteredGarnishOptions = this.menuForm.get('garnish').valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.name)),
      map(name => name
        ? this.garnishList.filter((option) => option.name.toLowerCase().includes(name.toLowerCase()))
        : this.garnishList.slice()
      )
    )
    this.filteredDessertOptions = this.menuForm.get('dessert').valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.name)),
      map(name => name
        ? this.dessertList.filter((option) => option.name.toLowerCase().includes(name.toLowerCase()))
        : this.dessertList.slice()
      )
    )
  }

  displayFn(item: Recipe): string {
    return item && item.name ? item.name : ''
  }

  updateServerDataBar() {
    // this.daoBar.getAll().subscribe(value => {
    //   if (value.length == 0) this.hasBarItems = false
    //   else {
    //     this.barSource = new MatTableDataSource(value)
    //     this.hasBarItems = true
    //   }
    // })
  }

  chooseDrinks(form, stepper: MatStepper) {
    this.hasStartersValidationError = false
    if (form.valid) {
      stepper.next()
    } else this.hasStartersValidationError = true
  }

  choosePlates(stepper: MatStepper) {
    if (this.chosenPlates.length) {
      stepper.next()
      this.dailyMenu.extra = this.menuForm.value
      this.dailyMenu.main = this.chosenPlates
    }
  }

  addPlate(item) {
    if (item.isAdded) {
      this.chosenPlates = this.chosenPlates.filter((el) => el.id !== item.id)
    } else {
      this.chosenPlates.push({ item, isAdded: true })
    }
  }

  createDailyMenu() {
    this.dailyMenu.open = true
    this.dailyMenu.createdAt = getCurrentUnixTime()
    this.dailyMenu.orders = new Array()
    this.store.dispatch(ItemActions.createDailyMenu({ menu: this.dailyMenu }))
  }

}