import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms'
import { CheckoutService } from '../../services/checkout.service'
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Observable, map, startWith } from 'rxjs'
import {
  zoomOutUpOnLeaveAnimation,
  expandOnEnterAnimation,
  collapseOnLeaveAnimation,
  fadeInUpOnEnterAnimation,
  fadeInOnEnterAnimation,
} from 'angular-animations'
import { CheckoutOrder, DeliveryTime, Order, OrderDelivery, OrderType } from '../../utils/menu.model'
import { MenuService } from '../../services/menu.service'
import { Recipe } from '../../../recipe/models/recipe.model'
import { User } from '../../../users/utils/user.model'
import { UserService } from '../../../users/services/user.service'
import { MenuConstants } from '../../utils/menu.constants'

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
    private checkoutService: CheckoutService,
    private menuService: MenuService,
    private userService: UserService,
    private navRouter: Router,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }

  readonly appUser = this.userService.appUser
  readonly dailyMenuLabel = MenuConstants.dailyMenuLabel
  readonly alaCarteLabel = MenuConstants.alaCarteLabel

  plates: Array<any> = new Array()
  extra: any
  total: number = 0
  deliveryTime: DeliveryTime = 'now'
  order: Order = {
    plates: new Array(),
    alacarte: this.menuService.order.alacarte,
    statusHistory: new Array(),
    category: {
      delivery: {},
    },
    price: {},
  }

  platesAmount: number

  dishTemplate = {} as Recipe
  isCash: boolean
  changeTypes: Array<string> = []

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
  isTemplateReady: boolean

  ngOnInit() {
    this.initOrderDetails()
    this.initForm()
    this.initClients()
    this.initTables()
    this.initChangeType()
    this.initUser()
  }

  initUser() {
    // this.userService.getAppAuth().subscribe(value => {
    //   this.initUserType(value)
    //   if (this.isClientUser) {
    //     this.initClientUser()
    //   }
    //   this.isTemplateReady = true
    //   this.cdr.markForCheck()
    // })
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

  initChangeType() {
    this.changeTypes.push('Exact value')
    this.changeTypes.push('10')
    this.changeTypes.push('20')
    this.changeTypes.push('50')
    this.changeTypes.push('100')
  }

  initTables() {
    this.tablesAmount = Array.from(Array(10).keys())
    this.tablesAmount.shift()
  }

  initOrderDetails() {
    if (this.menuService.order.isComposed) {
      this.plates = this.menuService.order.main
      this.extra = this.menuService.order.extra
      this.prepareOrder()
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
    }
  }

  initForm() {
    this.form = this.formBuilder.group({
      table: [null, Validators.required],
    })
  }

  prepareOrder() {
    this.plates = this.menuService.order.main
    this.extra = this.menuService.order.extra
    this.plates.forEach((el) => {
      const combinedOrder: CheckoutOrder = {
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
      }
      this.order.plates.push(combinedOrder)
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
          this.form.controls['table'].errors['required'] ? (this.hasTableNumberError = true) : (this.hasTableNumberError = false)

          break
        case 'takeaway':
          this.form.controls['name'].hasError('required') ? (this.hasTakeAwayError = true) : (this.hasTakeAwayError = false)
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
      user: this.user,
      timestamp: new Date(),
    })
    this.order.comment = this.comment
    // this.order.timestamp = new Date()
  }

  initUserType(user: User): void {
    this.user = user
    // this.isServiceUser = this.user.role === 'admin' || this.user.role === 'delivery' || this.user.role === 'waiter'
    // this.isClientUser = this.user.role === 'client'
  }

  confirmOrder() {
    this.resetValidation()
    if (!this.hasSkippedStarter && !this.hasSkippedDrink && this.form.valid) {
      this.isUploading = true
      this.formatOrder()
      this.isServiceUser ? this.confirmTableOrder() : this.confirmDelivery()
    } else {
      this.hightlightValidation()
    }
  }

  private handleDocumentCreateError(error) {
    console.error(error)
  }

  private confirmDelivery() {
    // console.log(this.order)

    // this.tablesAmount.forEach(() => {
    this.order.timestamp = new Date()
    console.log(this.order.timestamp)

    this.checkoutService.createDelivery(this.order)

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
  }

  private confirmTableOrder() {
    this.order.status = 'cooking'
    this.order.progress = '60%'
    this.order.statusHistory.push({
      status: 'cooking',
      user: this.user,
      timestamp: new Date(),
    })
    console.log(this.order)
    this.checkoutService
      .createTableOrder(this.order)
      .then(value => this.navRouter.navigate(['/orders', value.id]))
      .catch(error => this.handleDocumentCreateError(error))
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

  updateTime(time: DeliveryTime) {
    this.deliveryTime = time
    if (time === 'now') this.order.category.delivery.time = 'now'
  }

  initClients() {
    this.userService.getAllClients().subscribe((res) => {
      this.clientList = res
      this.filteredClients = this.clientFormControl.valueChanges.pipe(
        startWith(''),
        map(value => (typeof value === 'string' ? value : value.name)),
        map((name) => (name ? this.filterAutocompleteName(name) : this.clientList.slice()))
      )
    })
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
