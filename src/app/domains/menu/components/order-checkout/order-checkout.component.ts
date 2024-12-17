import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms'
import { Observable, combineLatest, firstValueFrom, from, map, startWith, tap } from 'rxjs'
import {
  zoomOutUpOnLeaveAnimation,
  expandOnEnterAnimation,
  collapseOnLeaveAnimation,
  fadeInUpOnEnterAnimation,
  fadeInOnEnterAnimation,
} from 'angular-animations'
import { OrderItem, OrderDeliveryTime, Order, OrderType, OrderProgress } from '../../../orders/models/order.model'
import { MenuActions as ItemActions } from '../../store/menu.actions'
import { Recipe } from '../../../recipe/models/recipe.model'
import { User } from '../../../users/models/user.model'
import { UserService } from '../../../users/services/user.service'
import { MenuConstants } from '../../utils/menu.constants'
import { getCurrentUnixTime } from '../../../../shared/utils/format-unix-time'
import { Store } from '@ngrx/store'
import { getExtra, getOrder } from '../../store/menu.selectors'
import { Router } from '@angular/router'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Delivery } from '../../../delivery/models/delivery.model'

@Component({
  selector: 'app-order-checkout',
  templateUrl: './order-checkout.component.html',
  styleUrls: ['./order-checkout.component.scss'],
  animations: [
    zoomOutUpOnLeaveAnimation(),
    expandOnEnterAnimation(),
    collapseOnLeaveAnimation(),
    fadeInUpOnEnterAnimation(),
    fadeInOnEnterAnimation(),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderCheckoutComponent implements OnInit {

  constructor(
    private store: Store,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private destroyRef: DestroyRef
  ) { }

  readonly appUser = this.userService.appUser
  readonly dailyMenuLabel = MenuConstants.dailyMenuLabel
  readonly alaCarteLabel = MenuConstants.alaCarteLabel

  plates: Array<any> = new Array()
  extra: any
  total: number = 0
  deliveryTime: OrderDeliveryTime = 'now'
  order: Order = {
    createdAt: getCurrentUnixTime(),
    plates: new Array(),
    // alacarte: this.menuService.order.alacarte,
    statusHistory: [],
    category: {
      delivery: {},
    },
    price: {},
  }

  platesAmount: number

  dishTemplate = {} as Recipe
  isCash: boolean
  changeTypes: Array<string> = ['Exact value', '10', '20', '50', '100']

  form: FormGroup
  isOldClient: boolean = false
  clientFormControl = new FormControl()
  filteredClients: Observable<any[]>
  clientList = new Array()

  hasSkippedStarter: boolean
  hasSkippedDrink: boolean
  hasClientDataError: boolean
  hasStarterError: boolean
  hasDrinkError: boolean
  hasPaymentTypeError: boolean
  hasTableNumberError: boolean
  hasTakeAwayError: boolean

  recipeHistoryList = new Array()

  menuEntry = {} as any
  barList = new Array()
  hasAdicionales: boolean

  isUploading: boolean
  isGifLoaderShowing: boolean

  hasDiscount: boolean
  discountAmount: number = 0
  hasDelivery: boolean
  deliveryAmount: number = 0

  orderType: OrderType = 'table'
  user: User
  orderId: string

  tablePayment: FormControl = new FormControl(null, Validators.required)
  hasTableWithClient: boolean
  extraClientName: FormControl = new FormControl()
  extraClientPhone: FormControl = new FormControl()

  totalOrderList: Array<any>

  tablesAmount: Array<number>
  comment: string = ''

  isServiceUser: boolean
  isClientUser: boolean

  ngOnInit() {
    this.initOrderDetails()
    this.initForm()
    this.initClients()
    this.initTables()
  }

  initClientUser() {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required]],
      address: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      payment: [null, [Validators.required]],
      change: [null],
    })
    this.orderType = 'delivery'
  }

  initTables() {
    this.tablesAmount = Array.from(Array(10).keys())
    this.tablesAmount.shift()
  }

  initOrderDetails() {
    combineLatest([
      this.store.select(getOrder),
      this.store.select(getExtra)
    ]).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(([order, extra]) => {
      if (!order) {
        this.router.navigate(['/menu'])
      } else {
        this.prepareOrder(order.main, extra)
      }
    })
    // if (this.menuService.order.isComposed) {
    // this.plates = this.menuService.order.main
    // this.extra = this.menuService.order.extra

    // this.priceService.getDiscountPrice().subscribe((res: any) => {
    //   this.discountAmount = res?.amount
    //   this.hasDiscount = res?.isActive
    //   if (this.hasDiscount == false) this.discountAmount = 0
    //   this.priceService.getDeliveryPrice().subscribe((res: any) => {
    //     this.deliveryAmount = res?.amount
    //     this.hasDelivery = res?.isActive
    //     if (this.hasDelivery == false) this.deliveryAmount = 0
    //     this.prepareOrder()
    //   })
    // })
    // this.userService.getAllClients().subscribe(value => console.log(value))
    // }
  }

  initForm() {
    this.form = this.formBuilder.group({
      table: [null, Validators.required],
    })
  }

  prepareOrder(main, extra) {
    this.plates = main


    this.extra = extra
    console.log(this.plates);
    console.log(this.extra);
    this.plates.forEach((el) => {
      const combinedOrder: OrderItem = {
        starter: {
          name: 'NA',
          id: null,
        },
        drink: {
          name: 'NA',
          id: null,
        },
        salad: {
          name: this.extra.salad.name,
          id: this.extra.salad.id,
        },
        garnish: {
          name: this.extra.garnish.name,
          id: this.extra.garnish.id,
        },
        rice: {
          name: this.extra.rice.name,
          id: this.extra.rice.id,
        },
        dessert: {
          name: this.extra.dessert.name,
          id: this.extra.dessert.id,
        },
        plate: el,
        name: '',
        type: ''
      }
      this.order.plates.push(combinedOrder)
      console.log(this.order);

    })
    const platePrice = this.plates.map((a) => a.price).reduce((a, b) => a + b, 0)
    const barPrice = this.barList.map((a) => a.price).reduce((a, b) => a + b, 0)
    // console.log(barPrice)
    // this.total = platePrice + barPrice + this.platesAmount * this.deliveryAmount - this.platesAmount * this.discountAmount
    this.total = platePrice + barPrice
    this.cdr.markForCheck()
  }

  private resetValidation() {
    this.isUploading = false
    this.hasClientDataError = false
    this.hasStarterError = false
    this.hasDrinkError = false
    this.hasPaymentTypeError = false
    this.hasTakeAwayError = false
    this.hasTableNumberError = false
    this.hasSkippedStarter = !!this.order.plates.find((el) => el.starter.name == 'NA')
    this.hasSkippedDrink = !!this.order.plates.find((el) => el.drink.name == 'NA')
  }

  private hightlightValidation() {
    this.hasSkippedStarter ? (this.hasStarterError = true) : (this.hasStarterError = false)
    this.hasSkippedDrink ? (this.hasDrinkError = true) : (this.hasDrinkError = false)
    if (this.form.invalid) {
      switch (this.orderType) {
        case 'delivery':
          this.form.controls['payment'].hasError('required')
            ? (this.hasPaymentTypeError = true)
            : (this.hasPaymentTypeError = false)
          const nameError = this.form.controls['name'].hasError('required')
          const addressError = this.form.controls['address'].hasError('required')
          const phoneError = this.form.controls['phone'].hasError('required')
          if (nameError || addressError || phoneError) {
            this.hasClientDataError = true
          }
          break
        case 'table':
          this.form.controls['table'].errors['required']
            ? (this.hasTableNumberError = true)
            : (this.hasTableNumberError = false)
          break
        case 'takeaway':
          this.form.controls['name'].hasError('required')
            ? (this.hasTakeAwayError = true)
            : (this.hasTakeAwayError = false)
          break
      }
      this.form.markAllAsTouched()
    }
  }

  private formatOrder() {
    switch (this.orderType) {
      case 'delivery':
        this.order.category.delivery = {
          time: this.order.category?.delivery.time ?? 'now',
          ...this.form.value,
        }
        break
      case 'table':
        this.order.category.table = this.form.value.table
        break
      case 'takeaway':
        this.order.category.delivery.name = this.form.value.name
        break
    }
    this.order.category.type = this.orderType
    this.order.price.total = this.total
    this.order.status = 'requested'
    this.order.statusHistory.push({
      status: 'requested',
      user: this.user ?? 'default user' as any,
      createdAt: getCurrentUnixTime()
    })
    this.order.comment = this.comment
    // this.order.createdAt = new Date()
  }

  initUserType(user: User): void {
    this.user = user
    // this.isServiceUser = this.user.role === 'admin' || this.user.role === 'delivery' || this.user.role === 'waiter'
    // this.isClientUser = this.user.role === 'client'
  }

  async confirmOrder() {
    this.resetValidation()
    if (!this.hasSkippedStarter && !this.hasSkippedDrink && this.form.valid) {
      this.isUploading = true
      this.formatOrder()
      this.user = await firstValueFrom(this.appUser)
      console.log(this.form.value);

      this.user
        ? this.confirmTableOrder()
        : this.confirmDelivery()
    } else {
      this.hightlightValidation()
    }
  }

  private confirmDelivery() {
    this.order.createdAt = getCurrentUnixTime()

    // this.tablesAmount.forEach(() => {
    // this.checkoutService.createDelivery(this.order)
    // })
    // this.checkoutService
    //   .createDelivery(this.order)
    //   .then(value => {
    //     this.isGifLoaderShowing = true
    //     this.cdr.detectChanges()
    //     setTimeout(() => {
    //       this.isGifLoaderShowing = false
    //       this.isUploading = false
    //       this.menuService.order.isComposed = false
    //       this.cdr.detectChanges()
    //       this.navRouter.navigate(['/menu/client-order', value.id])
    //     }, 4000)
    //   })
    //   .catch(error => this.handleDocumentCreateError(error))
    console.log(this.order)
    const delivery: Delivery = {
      client: 'new client',
      createdAt: getCurrentUnixTime(),
      order: this.order,
      status: 'requested',
      statusHistory: [{
        status: 'requested',
        user: this.user ?? 'default user' as any,
        createdAt: getCurrentUnixTime()
      }],
      user: this.user,
    }
    this.store.dispatch(ItemActions.createDeliveryOrder({ delivery }))
  }

  // 9
  // 1734108837.579
  // 10
  // 1734108837.579

  private confirmTableOrder() {
    this.order.status = 'cooking'
    this.order.progress = OrderProgress['0%']
    this.order.statusHistory.push({
      status: 'cooking',
      user: this.user,
      createdAt: getCurrentUnixTime(),
    })
    // console.log(this.order)
    this.store.dispatch(ItemActions.createTableOrder({ order: this.order }))
    // this.checkoutService.createTableOrder(this.order)
    // .then(value => this.navRouter.navigate(['/orders', value.id]))
    // .catch(error => this.handleDocumentCreateError(error))

    // from(new Array(20)).subscribe((v) => {
    // const order = this.order
    // console.log(v);
    // this.store.dispatch(ItemActions.createTableOrder({ order: this.order }))
    // })
  }

  updateMenuHistoryAmount() {
    this.menuEntry.plates.forEach((el) => {
      let filtereListBySameItemsOfOrderPlateAmount = this.plates.filter((innerEl) => {
        return innerEl.id == el.plato.id
      })
      let amount = filtereListBySameItemsOfOrderPlateAmount.length
      let item = filtereListBySameItemsOfOrderPlateAmount.pop()
      if (amount > 0) {
        let sameItemIndex = this.menuEntry.plates.map((el) => el.plato.id).indexOf(item.id)
        let oldAmount: number = this.menuEntry.plates[sameItemIndex].plato.amount
        let newAmount: number = oldAmount + amount
        this.menuEntry.plates[sameItemIndex].plato.amount = newAmount
      }
    })

    if (!this.menuEntry.orders) this.menuEntry.orders = new Array()
    this.menuEntry.orders.push(this.order)
  }

  chooseCash(ev) {
    if (ev == 'cash') {
      this.isCash = true
      this.form.get('change').setValidators([Validators.required])
      this.form.updateValueAndValidity()
    } else {
      this.isCash = false
      this.form.get('change').setValidators([])
      this.form.get('change').setValue(null)
      this.form.updateValueAndValidity()
    }
    this.cdr.markForCheck()
  }

  chooseStarter(event, i) {
    if (event == 'skip') {
      this.order.plates[i].starter.id = null
      this.order.plates[i].starter.name = 'without starter'
    } else {
      this.order.plates[i].starter.id = event.id
      this.order.plates[i].starter.name = event.name
    }
  }

  chooseDrink(event, i) {
    if (event == 'skip') {
      this.order.plates[i].drink.id = null
      this.order.plates[i].drink.name = 'without drink'
    } else {
      this.order.plates[i].drink.id = event.id
      this.order.plates[i].drink.name = event.name
    }
  }

  chooseToppings(event: Recipe, i) {
    if (event.type == 'salad') {
      if (this.order.plates[i].salad.id !== event.id) {
        this.order.plates[i].salad.id = event.id
        this.order.plates[i].salad.name = event.name
      } else {
        this.order.plates[i].salad.id = null
        this.order.plates[i].salad.name = 'NA'
      }
    } else if (event.type == 'rice') {
      if (this.order.plates[i].rice.id !== event.id) {
        this.order.plates[i].rice.id = event.id
        this.order.plates[i].rice.name = event.name
      } else {
        this.order.plates[i].rice.id = null
        this.order.plates[i].rice.name = 'NA'
      }
    } else if (event.type == 'garnish') {
      if (this.order.plates[i].garnish.id !== event.id) {
        this.order.plates[i].garnish.id = event.id
        this.order.plates[i].garnish.name = event.name
      } else {
        this.order.plates[i].garnish.id = null
        this.order.plates[i].garnish.name = 'NA'
      }
    } else if (event.type == 'dessert') {
      if (this.order.plates[i].dessert.id !== event.id) {
        this.order.plates[i].dessert.id = event.id
        this.order.plates[i].dessert.name = event.name
      } else {
        this.order.plates[i].dessert.id = null
        this.order.plates[i].dessert.name = 'NA'
      }
    }
  }

  setDeliveryTime(event: string) {
    this.order.category.delivery.time = event
  }

  updateTime(time: OrderDeliveryTime) {
    this.deliveryTime = time
    if (time === 'now') this.order.category.delivery.time = 'now'
  }

  initClients() {
    // this.userService.getAllClients().subscribe((res) => {
    //   this.clientList = res
    //   this.filteredClients = this.clientFormControl.valueChanges.pipe(
    //     startWith(''),
    //     map(value => (typeof value === 'string' ? value : value.name)),
    //     map((name) => (name ? this.filterAutocompleteName(name) : this.clientList.slice()))
    //   )
    // })
  }

  displayFn(item): string {
    return item && item.name ? item.name : ''
  }

  filterAutocompleteName(name: string) {
    const filterValue = name.toLowerCase()
    return this.clientList.filter((option) => option.name.toLowerCase().indexOf(filterValue) === 0)
  }

  addClientData(item) {
    this.form.reset()
    this.form.patchValue(item)
  }

  chooseOrderType(type: OrderType) {
    this.orderType = type
    switch (type) {
      case 'delivery':
        this.form = this.formBuilder.group({
          name: [null, [Validators.required]],
          address: [null, [Validators.required]],
          phone: [null, [Validators.required]],
          payment: [null, [Validators.required]],
          change: [null],
        })
        break
      case 'table':
        this.form = this.formBuilder.group({
          table: [null, Validators.required],
        })
        break
      case 'takeaway':
        this.form = this.formBuilder.group({
          name: [null, Validators.required],
        })
        break
    }
    this.order.category.type = type
  }

  // showClientForTable() {
  //   if (this.hasTableWithClient) this.hasTableWithClient = false
  //   else this.hasTableWithClient = true
  // }

  // attachTableToOrder(ev) {
  //   this.chosenTable = ev
  // }
}
